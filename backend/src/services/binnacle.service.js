"use strict";
// Importaciones necesarias
import User from "../models/user.model.js";
import Binnacle from "../models/binnacle.model.js";
import { handleError } from "../utils/errorHandler.js";
import Order from "../models/order.model.js";


/**
 * Obtener todos los registros de la bitácora.
 */
async function getAllBinnacles() {
    try {
        console.log("hola");
        const binnacles = await Order.find().exec();
        if(!binnacles) return [null, "No hay registros en la bitácora."];
        return [binnacles, null];
    } catch (error) {
        handleError(error,"binnacle.service -> getAllBinnacles");
        return [null, error.message];
    }
}

/**
 * Obtener registro por Conserjer
 */
async function getBinnacleByJanitor(janitorId) {
    try {
        const binnacle = await Binnacle.find({ janitorId }).populate("janitorId");
        if(!binnacle) return [null, "No hay registros en la bitácora para este conserje."];
        return [binnacle, null];
    } catch (error) {
        handleError(error,"binnacle.service -> getBinnacleByJanitor");
        return [null, error.message];
    }
}
/**
 * Obtener registro por Actividades
 */
async function getBinnacleByActivity(activityTypes) {
    try {
        const binnacle = await Binnacle.find({ activityType: { $in: activityTypes } }).populate("janitorId");
        if(!binnacle) return [null, "No hay registros en la bitácora para esta actividad."];
        return [binnacle, null];
    } catch (error) {
        handleError(error,"binnacle.service -> getBinnacleByActivity");
        return [null, error.message];
    }
}
/**
 * Obtener registros por fechas
 */
async function getBinnacleByDates(startDate, endDate) {
    try {
        const binnacle = await Binnacle.find({ createdAt: { $gte: startDate, $lte: endDate } }).populate("janitorId");
        if(!binnacle) return [null, "No hay registros en la bitácora para estas fechas."];
        return [binnacle, null];
    } catch (error) {
        handleError(error,"binnacle.service -> getBinnacleByDates");
        return [null, error.message];
    }
}

export default{ 
    getAllBinnacles,
    getBinnacleByJanitor,
    getBinnacleByActivity,
    getBinnacleByDates
 };

