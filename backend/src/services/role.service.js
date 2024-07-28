"use strict";
// Importa el modelo necesario
import Role from "../models/role.model.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los roles de la base de datos
 * @returns {Promise} Promesa con el objeto de los roles
 */
async function getRoles() {
  try {
    const roles = await Role.find().exec();
    if (!roles) return [null, "No hay roles"];

    return [roles, null];
  } catch (error) {
    handleError(error, "role.service -> getRoles");
  }
}

export default {
  getRoles
};
