"use strict";

import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";



/**
 * Comprueba si el usuario es administrador
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isAdmin(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email });
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }
    return respondError(
      req,
      res,
      401,
      "Se requiere un rol de administrador para realizar esta acción",
    );
  } catch (error) {
    handleError(error, "authorization.middleware -> isAdmin");
  }
}

/**
 * Comprueba si el usuario tiene el rol de conserje (janitor)
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isJanitor(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email });
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (let role of roles) {
      if (role.name === "janitor") {
        next();
        return;
      }
    }
    return respondError(
      req,
      res,
      401,
      "Se requiere un rol de conserje para realizar esta acción"
    );
  } catch (error) {
    handleError(error, "authorization.middleware -> isJanitor");
  }
}

/**
 * Comprueba si el usuario tiene el rol de usuario (user)
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isUser(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email });
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (let role of roles) {
      if (role.name === "user") {
        next();
        return;
      }
    }
    return respondError(
      req,
      res,
      401,
      "Se requiere un rol de usuario para realizar esta acción"
    );
  } catch (error) {
    handleError(error, "authorization.middleware -> isUser");
  }
}

/**
 * Comprueba si el usuario tiene el rol de administrador o conserje
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isJanitorOrAdmin(req, res, next) {
  try {
    const user = await User.findOne({ email: req.email });
    const roles = await Role.find({ _id: { $in: user.roles } });
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    const requiredRoles = ["admin", "janitor"];
    const userHasRequiredRole = roles.some(role => requiredRoles.includes(role.name));

    if (userHasRequiredRole) {
      next();
      return;
    }

    // Si el usuario no tiene ninguno de los roles necesarios, enviar un mensaje de error
    return respondError(
      req,
      res,
      401,
      "Se requiere un rol de administrador o conserje para realizar esta acción"
    );
  } catch (error) {
    handleError(error, "authorization.middleware -> isJanitorOrAdmin");
  }
}

export { isAdmin, isJanitor, isUser, isJanitorOrAdmin };