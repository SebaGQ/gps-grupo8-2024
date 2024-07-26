"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import BinnacleService from "../services/binnacle.service.js";
import { handleError } from "../utils/errorHandler.js";
import { validateVisitaBody, validateDeliveryBody, validateEspacioComunitarioBody, binnacleIdSchema } from '../schema/binnacle.schema.js';



/**
 * Exporta datos a un archivo Excel
 */
async function exportToExcel(req, res) {
    try {
        const [filePath, error] = await BinnacleService.exportDataToExcel();
        if (error) return respondError(req, res, 500, error);

        res.download(filePath, "data_export.xlsx", (err) => {
            if (err) {
                handleError(err, "excelExport.controller -> exportToExcel");
                respondError(req, res, 500, "No se pudo descargar el archivo");
            }
        });
    } catch (error) {
        handleError(error, "excelExport.controller -> exportToExcel");
        respondError(req, res, 500, "No se pudo exportar los datos a Excel");
    }
}
/**
 * Generar una entrada en la bitácora
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createEntryVisitor(req, res) {
    try {
        const body = req.body;
        const { error: bodyError } = validateVisitaBody(body);
        console.log("bodyerror", bodyError);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
        const [binnacleEntry, binnacleError] = await BinnacleService.createEntryVisitor(req);
        if (binnacleError) return respondError(req, res, 400, binnacleError);
        respondSuccess(req, res, 201, binnacleEntry);
    } catch (error) {
        handleError(error, "binnacle.controller -> createEntryVisitor");
        respondError(req, res, 500, "No se creó la bitácora");
    }
}

async function createEntryBooking(req, res) {
    try {
        const body = req.body;
        const { error: bodyError } = validateEspacioComunitarioBody(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
        const [binnacleEntry, binnacleError] = await BinnacleService.createEntryBooking(req);
        if (binnacleError) return respondError(req, res, 400, binnacleError);
        if (!binnacleEntry) {
            return respondError(req, res, 400, "No se creó la bitacora Booking");
        }
        respondSuccess(req, res, 201, binnacleEntry);
    } catch (error) {
        handleError(error, "binnacle.controller -> createEntryBooking");
        respondError(req, res, 500, "No se creó la bitacora");
    }
}

async function createEntryDelivery(req, res) {
    try {
        const body = req.body;
        const { error: bodyError } = validateDeliveryBody(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
        const [binnacleEntry, binnacleError] = await BinnacleService.createEntryDelivery(req);
        if (binnacleError) return respondError(req, res, 400, binnacleError);
        if (!binnacleEntry) {
            return respondError(req, res, 400, "No se creó la bitacora Delivery");
        }
        respondSuccess(req, res, 201, binnacleEntry);
    } catch (error) {
        handleError(error, "binnacle.controller -> createEntryDelivery");
        respondError(req, res, 500, "No se creó la bitacora");
    }
}

/**
 * Obtener todas las entradas de la bitácora por Delivery
 */
async function getBinnacleDelivery(req, res) {
    try {
        const [binnacle, error] = await BinnacleService.getBinnaclesDelivery();
        if (error) return respondError(req, res, 404, error);

        binnacle.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, binnacle);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnacleByDelivery");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Obtener todas las entradas de la bitácora por el nombre del conserje
 */
async function getBinnacleByJanitorName(req, res) {
    try {
        const { name } = req.params; // Extraer el parámetro name de req.params
        console.log("FIRST NAME", name); // Para debug
        const [binnacles, error] = await BinnacleService.getBinnacleByJanitorName(name);

        if (error) return respondError(req, res, 404, error);
        if (!binnacles || binnacles.length === 0) {
            return respondError(req, res, 404, "No se encontraron entradas de bitácora para el conserje con ese nombre");
        }

        respondSuccess(req, res, 200, binnacles);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnacleByJanitorName");
        respondError(req, res, 500, "No se pudo obtener la entrada de la bitácora");
    }
}


/**
 * Obtiene una entrada de la bitácora por Visita
 */
async function getBinnaclesVisitor(req, res) {
    try {
        const [binnacle, error] = await BinnacleService.getBinnaclesVisitor();
        if (error) return respondError(req, res, 404, error);

        binnacle.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, binnacle);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnaclesVisitor");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Obtiene una entrada de la bitácora por Espacio comunitarios
 */
async function getBinnaclesBooking(req, res) {
    try {
        const [binnacle, error] = await BinnacleService.getBinnaclesBooking();
        if (error) return respondError(req, res, 404, error);

        binnacle.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, binnacle);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnaclesBooking");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Obtiene bitacora por dia
 */
async function getBinnacleByDate(req, res) {
    try {
        const { params } = req;
        const [binnacle, error] = await BinnacleService.getBinnacleByDate(params.date);

        if (error) return respondError(req, res, 404, error);
        if (!binnacle || binnacle.length === 0) {
            return respondError(req, res, 404, "No se encontró la entrada de la bitácora");
        }

        respondSuccess(req, res, 200, binnacle);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnacleByDate");
        respondError(req, res, 500, "No se pudo obtener la entrada de la bitácora");
    }
}

/**
 * Obtener todas las entradas de la bitácora
 */
async function getBinnacles(req, res) {
    try {
        const [binnacles, error] = await BinnacleService.getBinnacles();
        if (error) return respondError(req, res, 500, error);

        respondSuccess(req, res, 200, binnacles);
    } catch (error) {
        handleError(error, "binnacle.controller -> getAllBinnacles");
        respondError(req, res, 500, "No se pudo obtener las entradas de la bitácora");
    }
}

/**
 * Eliminar una entrada por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteBinnacleId(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = binnacleIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, error);
        const deletedBinnacle = await BinnacleService.deleteBinnacleId(params.id);
        if (!deletedBinnacle) {
            return respondError(req, res, 404, "No se encontró la bitácora");
        }
        respondSuccess(req, res, 200, deletedBinnacle);        
    } catch (error) {
        handleError(error, "binnacle.controller -> deleteBinnacleId");
        respondError(req, res, 500, "No se pudo eliminar la bitácora");
    }
}

/**
 * Actualiza una entrada en la bitácora.
 */
async function updateBinnacle(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const [updatedBinnacle, error] = await BinnacleService.updateBinnacle(id, updateData);
        if (error) return respondError(req, res, 400, error);
        respondSuccess(req, res, 200, updatedBinnacle);
    } catch (error) {
        handleError(error, "binnacle.controller -> updateBinnacle");
        respondError(req, res, 500, "No se pudo actualizar la bitácora");
    }
}

/**
 * Obtiene una entrada de la bitácora por id
 */
async function getBinnacleById(req, res) {
    try {
        const { id } = req.params;
        console.log("ID", id);
        const [binnacle, error] = await BinnacleService.getBinnacleById(id);
        if (error) return respondError(req, res, 404, error);
        if (!binnacle) {
            return respondError(req, res, 404, "No se encontró la bitácora");
        }
        respondSuccess(req, res, 200, binnacle);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnacleById");
        respondError(req, res, 500, "No se pudo obtener la bitácora");
    }
}

export default {
    exportToExcel,
    createEntryVisitor,
    createEntryBooking,
    createEntryDelivery,
    getBinnaclesBooking,
    getBinnacleDelivery,
    getBinnacles,
    getBinnacleById,
    getBinnacleByJanitorName,
    getBinnaclesVisitor,
    getBinnacleByDate,
    deleteBinnacleId,
    updateBinnacle
};

