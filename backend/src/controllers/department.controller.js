"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import DepartmentService from "../services/department.service.js";
import { departmentBodySchema, departmentIdSchema } from "../schema/department.schema.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los departamentos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getDepartments(req, res) {
  try {
    const [departments, errorDepartments] = await DepartmentService.getDepartments();
    if (errorDepartments) return respondError(req, res, 404, errorDepartments);

    departments.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, departments);
  } catch (error) {
    handleError(error, "department.controller -> getDepartments");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Crea un nuevo departamento
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createDepartment(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = departmentBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [newDepartment, departmentError] = await DepartmentService.createDepartment(body);

    if (departmentError) return respondError(req, res, 400, departmentError);
    if (!newDepartment) {
      return respondError(req, res, 400, "No se creó el departamento");
    }

    respondSuccess(req, res, 201, newDepartment);
  } catch (error) {
    handleError(error, "department.controller -> createDepartment");
    respondError(req, res, 500, "No se creó el departamento");
  }
}

/**
 * Obtiene un departamento por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getDepartmentById(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = departmentIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [department, errorDepartment] = await DepartmentService.getDepartmentById(params.id);

    if (errorDepartment) return respondError(req, res, 404, errorDepartment);

    respondSuccess(req, res, 200, department);
  } catch (error) {
    handleError(error, "department.controller -> getDepartmentById");
    respondError(req, res, 500, "No se pudo obtener el departamento");
  }
}

/**
 * Actualiza un departamento por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateDepartment(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = departmentIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { error: bodyError } = departmentBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [department, departmentError] = await DepartmentService.updateDepartment(params.id, body);

    if (departmentError) return respondError(req, res, 400, departmentError);

    respondSuccess(req, res, 200, department);
  } catch (error) {
    handleError(error, "department.controller -> updateDepartment");
    respondError(req, res, 500, "No se pudo actualizar el departamento");
  }
}

/**
 * Elimina un departamento por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteDepartment(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = departmentIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const department = await DepartmentService.deleteDepartment(params.id);
    !department
      ? respondError(
          req,
          res,
          404,
          "No se encontró el departamento solicitado",
          "Verifique el id ingresado",
        )
      : respondSuccess(req, res, 200, department);
  } catch (error) {
    handleError(error, "department.controller -> deleteDepartment");
    respondError(req, res, 500, "No se pudo eliminar el departamento");
  }
}

export default {
  getDepartments,
  createDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
