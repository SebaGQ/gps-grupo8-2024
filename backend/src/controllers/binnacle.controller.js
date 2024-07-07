"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import BinnacleService from "../services/binnacle.service.js";
import { handleError } from "../utils/errorHandler.js";



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
 */
async function createEntryVisitor(req, res) {
    try {
        const { body } = req.body;
        const { error: bodyError } = binnacleBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
        const [binnacleEntry, binnacleError] = await BinnacleService.createEntryVisitor(req);
        respondSuccess(req, res, 201, binnacleEntry);
        if (visitorError) return respondError(req, res, 400, binnacleError);
        if (!binnacleEntry) {
          return respondError(req, res, 400, "No se creó la bitacora");
        }
    
        respondSuccess(req, res, 201, newVisitor);
      } catch (error) {
        handleError(error, "binnacle.controller -> createEntry");
        respondError(req, res, 500, "No se creó la bitacora");
      }
}

async function createEntryBooking(req, res) {
    try {
        const { body } = req.body;
        const { error: bodyError } = binnacleBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
        const [binnacleEntry, binnacleError] = await BinnacleService.createEntryBooking(req);
        respondSuccess(req, res, 201, binnacleEntry);
        if (visitorError) return respondError(req, res, 400, binnacleError);
        if (!binnacleEntry) {
          return respondError(req, res, 400, "No se creó la bitacora");
        }
    
        respondSuccess(req, res, 201, newVisitor);
      } catch (error) {
        handleError(error, "binnacle.controller -> createEntry");
        respondError(req, res, 500, "No se creó la bitacora");
      }
}

/**
 * Obtiene todas las entradas de la bitácora
 */
async function getBinnacles(req, res) {
    try {
        const [binnacles, error] = await BinnacleService.getBinnacles();
        if (error) return respondError(req, res, 404, error);

        binnacles.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, binnacles);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnacles");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Obtiene una entrada de la bitácora por su ID
 */
async function getBinnacleByJanitorID(req, res) {
    try {
        const { params } = req;
        const [binnacle, error] = await BinnacleService.getBinnacleByJanitorID(params.id);

        if (error) return respondError(req, res, 404, error);
        if (!binnacle) {
            return respondError(req, res, 404, "No se encontró la entrada de la bitácora");
        }

        respondSuccess(req, res, 200, binnacle);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnacleById");
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
export default {
    exportToExcel,
    createEntryVisitor,
    createEntryBooking,
    getBinnaclesBooking,
    getBinnacles,
    getBinnacleByJanitorID,
    getBinnaclesVisitor,
    getBinnacleByDate
};

