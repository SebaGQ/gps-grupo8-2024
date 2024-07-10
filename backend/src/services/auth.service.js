"use strict";

/** Modelo de datos 'User' */
import User from "../models/user.model.js";
/** Modelo de datos 'Department' */
import Department from "../models/department.model.js";
/** Modulo 'jsonwebtoken' para crear tokens */
import jwt from "jsonwebtoken";

import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } from "../config/configEnv.js";

import { handleError } from "../utils/errorHandler.js";

/**
 * Inicia sesión con un usuario.
 * @async
 * @function login
 * @param {Object} user - Objeto de usuario
 */
async function login(user) {
  try {
    const { email, password } = user;

    const userFound = await User.findOne({ email: email })
      .populate("roles")
      .exec();
    if (!userFound) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    const matchPassword = await User.comparePassword(
      password,
      userFound.password,
    );

    if (!matchPassword) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    // Buscar departamento por el ID del usuario que se está logeando
    const department = await Department.findOne({ residentId: userFound._id });
    const departmentNumber = department ? department.departmentNumber : null;

    const accessToken = jwt.sign(
      { _id: userFound._id, email: userFound.email, roles: userFound.roles, departmentNumber: departmentNumber },
      ACCESS_JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    const refreshToken = jwt.sign(
      { email: userFound.email },
      REFRESH_JWT_SECRET,
      {
        expiresIn: "7d", // 7 días
      },
    );

    return [accessToken, refreshToken, null];
  } catch (error) {
    handleError(error, "auth.service -> signIn");
    return [null, null, "Error al iniciar sesión"];
  }
}

/**
 * Refresca el token de acceso
 * @async
 * @function refresh
 * @param {Object} cookies - Objeto de cookies
 */
async function refresh(cookies) {
  try {
    if (!cookies.jwt) return [null, "No hay autorización"];
    const refreshToken = cookies.jwt;

    const [accessToken, error] = await new Promise((resolve) =>

      jwt.verify(
        refreshToken,
        REFRESH_JWT_SECRET,
        async (err, user) => {
          if (err) return [null, "La sesión ha caducado, vuelva a iniciar sesión"];

          const userFound = await User.findOne({
            email: user.email,
          })
            .populate("roles")
            .exec();

          if (!userFound) return [null, "Usuario no autorizado"];

          const accessToken = jwt.sign(
            { _id: userFound._id, email: userFound.email, roles: userFound.roles, departmentNumber: userFound.departmentNumber },
            ACCESS_JWT_SECRET,
            {
              expiresIn: "1d",
            },
          );

          return [accessToken, null];
        },
      ));

    return accessToken;
  } catch (error) {
    handleError(error, "auth.service -> refresh");
  }
}

export default { login, refresh };
