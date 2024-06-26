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
async function createEntry(req, res) {
    try {
        const { janitorID, activityType, description } = req.body;
        const [binnacleEntry, error] = await BinnacleService.createEntry(janitorID, activityType, description);
        if (error) return respondError(req, res, 500, error);

        respondSuccess(req, res, 201, binnacleEntry);
    } catch (error) {
        handleError(error, "binnacle.controller -> createEntry");
        respondError(req, res, 500, "No se pudo crear la entrada en la bitácora");
    }
}

/**
 * Genera la bitácora diaria
 */
// async function generateDailyBinnacle(req, res) {
//     try {
//         const [result, error] = await BinnacleService.generateDailyBinnacle();
//         if (error) return respondError(req, res, 500, error);

//         respondSuccess(req, res, 200, "Daily binnacle generated successfully");
//     } catch (error) {
//         handleError(error, "binnacle.controller -> generateDailyBinnacle");
//         respondError(req, res, 500, "No se pudo generar la bitácora");
//     }
// }

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
 * Obtiene una entrada de la bitácora por su tipo de actividad
 */
async function getBinnacleByActivityType(req, res) {
    try {
        const { params } = req;
        const [binnacle, error] = await BinnacleService.getBinnacleByActivityType(params.activityType);

        if (error) return respondError(req, res, 404, error);
        if (!binnacle) {
            return respondError(req, res, 404, "No se encontró la entrada de la bitácora");
        }

        respondSuccess(req, res, 200, binnacle);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnacleByActivityType");
        respondError(req, res, 500, "No se pudo obtener la entrada de la bitácora");
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
    createEntry,
    // generateDailyBinnacle,
    getBinnacles,
    getBinnacleByJanitorID,
    getBinnacleByActivityType,
    getBinnacleByDate
};

