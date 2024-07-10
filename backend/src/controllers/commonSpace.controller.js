"use strict";
import CommonSpaceService from "../services/commonSpace.service.js";
import { handleError } from "../utils/errorHandler.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";

/**
 * Obtiene todos los espacios comunes.
 */
async function getAllCommonSpaces(req, res) {
    try {
        const [commonSpaces, errorCommonSpaces] = await CommonSpaceService.getAllCommonSpaces();
        if (errorCommonSpaces) return respondError(req, res, 404, errorCommonSpaces);

        commonSpaces.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, commonSpaces);
    } catch (error) {
        handleError(error, "commonSpace.controller -> getAllCommonSpaces");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Obtiene un espacio común por ID.
 */
async function getCommonSpaceById(req, res) {
    try {
        const { params } = req;
        const [commonSpace, errorCommonSpace] = await CommonSpaceService.getCommonSpaceById(
            params.id,
        );

        if (errorCommonSpace) return respondError(req, res, 404, errorCommonSpace);
        if (!commonSpace) {
            return respondError(req, res, 404, "No se encontró el espacio común");
        }

        respondSuccess(req, res, 200, commonSpace);
    } catch (error) {
        handleError(error, "commonSpace.controller -> getCommonSpaceById");
        respondError(req, res, 500, "No se pudo obtener el espacio común");
    }
}

/**
 * Crea un nuevo espacio común.
 */
async function createCommonSpace(req, res) {
    try {
        console.log(req.body);
        const [commonSpace, errorCommonSpace] = await CommonSpaceService.createCommonSpace(req);
        if (errorCommonSpace) return respondError(req, res, 400, errorCommonSpace);

        respondSuccess(req, res, 201, commonSpace);
    } catch (error) {
        handleError(error, "commonSpace.controller -> createCommonSpace");
        respondError(req, res, 500, error.message);
    }
}

/**
 * Actualiza un espacio común.
 */
async function updateCommonSpace(req, res) {
    try {
        const { params } = req;
        const [commonSpace, errorCommonSpace] = await CommonSpaceService.updateCommonSpace(
            params.id,
            req.body,
        );

        if (errorCommonSpace) return respondError(req, res, 400, errorCommonSpace);
        if (!commonSpace) {
            return respondError(req, res, 404, "No se encontró el espacio común");
        }

        respondSuccess(req, res, 200, commonSpace);
    } catch (error) {
        handleError(error, "commonSpace.controller -> updateCommonSpace");
        respondError(req, res, 500, error.message);
    }
}

/**
 * Elimina un espacio común.
 */
async function deleteCommonSpace(req, res) {
    try {
        const { params } = req;
        console.log(req.headers.authorization);
        const [deletedCommonSpace, errorCommonSpace] = await CommonSpaceService.deleteCommonSpace(
            params.id,
            req,
        );

        if (errorCommonSpace) return respondError(req, res, 400, errorCommonSpace);
        if (!deletedCommonSpace) {
            return respondError(req, res, 404, "No se encontró el espacio común");
        }

        respondSuccess(req, res, 200, deletedCommonSpace);
    } catch (error) {
        handleError(error, "commonSpace.controller -> deleteCommonSpace");
        respondError(req, res, 500, error.message);
    }
}

export default {
    getAllCommonSpaces,
    getCommonSpaceById,
    createCommonSpace,
    updateCommonSpace,
    deleteCommonSpace,
};
