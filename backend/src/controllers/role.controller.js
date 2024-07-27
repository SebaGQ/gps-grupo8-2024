import { respondSuccess, respondError } from "../utils/resHandler.js";
import RoleService from "../services/role.service.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los roles
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getRoles(req, res) {
  try {
    const [roles, errorRoles] = await RoleService.getRoles();
    if (errorRoles) return respondError(req, res, 404, errorRoles);

    roles.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, roles);
  } catch (error) {
    handleError(error, "role.controller -> getRoles");
    respondError(req, res, 400, error.message);
  }
}

export default {
  getRoles
};
