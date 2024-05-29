"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import binnacleServices from "../services/binnacle.service.js";
import orderService from "../services/order.service.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los registros de la bitácora
 */
async function getAllBinnacles(req, res) {
    try {
        console.log("controller");
        const [binnacles, error] = await orderService.getOrders();
        if (error) return respondError(req, res, 404, error);

        binnacles.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, binnacles);
    } catch (error) {
        handleError(error, "binnacle.controller -> getAllBinnacles");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Obtiene registros de la bitácora por conserje
 */
async function getBinnacleByJanitor(req, res) {
    try {
        const { janitorId } = req.params;
        const [binnacles, error] = await binnacleServices.getBinnacleByJanitor(janitorId);
        if (error) return respondError(req, res, 404, error);

        binnacles.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, binnacles);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnacleByJanitor");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Obtiene registros de la bitácora por tipos de actividad
 */
async function getBinnacleByActivity(req, res) {
    try {
        const { activityTypes } = req.query;
        const parsedActivityTypes = activityTypes ? activityTypes.split(",") : [];
        const [binnacles, error] = await binnacleServices.getBinnacleByActivity(parsedActivityTypes);
        if (error) return respondError(req, res, 404, error);

        binnacles.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, binnacles);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnacleByActivity");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Obtiene registros de la bitácora por rango de fechas
 */
async function getBinnacleByDates(req, res) {
    try {
        const { startDate, endDate } = req.query;
        const [binnacles, error] = await binnacleServices.getBinnacleByDates(new Date(startDate), new Date(endDate));
        if (error) return respondError(req, res, 404, error);

        binnacles.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, binnacles);
    } catch (error) {
        handleError(error, "binnacle.controller -> getBinnacleByDates");
        respondError(req, res, 400, error.message);
    }
}

export default {
    getAllBinnacles,
    getBinnacleByJanitor,
    getBinnacleByActivity,
    getBinnacleByDates
};