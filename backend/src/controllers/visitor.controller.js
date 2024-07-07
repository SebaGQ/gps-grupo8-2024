"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import VisitorService from "../services/visitor.service.js";
import {
  visitorBodySchema,
  visitorIdSchema,
  visitorExitDateSchema,
} from "../schema/visitor.schema.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los visitantes
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getVisitors(req, res) {
  try {
    const [visitors, errorVisitors] = await VisitorService.getVisitors();
    if (errorVisitors) return respondError(req, res, 404, errorVisitors);

    visitors.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, visitors);
  } catch (error) {
    handleError(error, "visitor.controller -> getVisitors");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Crea un nuevo visitante
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createVisitor(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = visitorBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [newVisitor, visitorError] = await VisitorService.createVisitor(req);

    if (visitorError) return respondError(req, res, 400, visitorError);
    if (!newVisitor) {
      return respondError(req, res, 400, "No se creó el visitante");
    }

    respondSuccess(req, res, 201, newVisitor);
  } catch (error) {
    handleError(error, "visitor.controller -> createVisitor");
    respondError(req, res, 500, "No se creó el visitante");
  }
}

/**
 * Obtiene un visitante por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getVisitorById(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = visitorIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [visitor, errorVisitor] = await VisitorService.getVisitorById(
      params.id,
    );

    if (errorVisitor) return respondError(req, res, 404, errorVisitor);

    respondSuccess(req, res, 200, visitor);
  } catch (error) {
    handleError(error, "visitor.controller -> getVisitorById");
    respondError(req, res, 500, "No se pudo obtener el visitante");
  }
}

/**
 * Actualiza un visitante por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateVisitor(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = visitorIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { error: bodyError } = visitorBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [visitor, visitorError] = await VisitorService.updateVisitor(
      params.id,
      body,
    );

    if (visitorError) return respondError(req, res, 400, visitorError);

    respondSuccess(req, res, 200, visitor);
  } catch (error) {
    handleError(error, "visitor.controller -> updateVisitor");
    respondError(req, res, 500, "No se pudo actualizar el visitante");
  }
}

/**
 * Actualiza la fecha de salida de un visitante por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateVisitorExitDate(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = visitorIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { error: bodyError } = visitorExitDateSchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [visitor, visitorError] = await VisitorService.updateVisitorExitDate(
      params.id,
      body.exitDate,
    );

    if (visitorError) return respondError(req, res, 400, visitorError);

    respondSuccess(req, res, 200, visitor);
  } catch (error) {
    handleError(error, "visitor.controller -> updateVisitorExitDate");
    respondError(
      req,
      res,
      500,
      "No se pudo actualizar la fecha de salida del visitante",
    );
  }
}

/**
 * Elimina un visitante por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteVisitor(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = visitorIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const visitor = await VisitorService.deleteVisitor(params.id);
    !visitor
      ? respondError(
          req,
          res,
          404,
          "No se encontró el visitante solicitado",
          "Verifique el id ingresado",
        )
      : respondSuccess(req, res, 200, visitor);
  } catch (error) {
    handleError(error, "visitor.controller -> deleteVisitor");
    respondError(req, res, 500, "No se pudo eliminar el visitante");
  }
}

export default {
  getVisitors,
  createVisitor,
  getVisitorById,
  updateVisitor,
  updateVisitorExitDate,
  deleteVisitor,
};
