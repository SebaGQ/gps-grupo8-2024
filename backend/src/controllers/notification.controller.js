"use strict";

import NotificationService from "../services/notification.service.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Marca como vistas una lista de notificaciones.
 */
async function markNotificationsSeen(req, res) {
    try {
        const notificationIds = req.body.notificationIds;
        if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
            return respondError(req, res, 400, "No se proporcionaron IDs válidos de notificaciones.");
        }
        const [result, error] = await NotificationService.markNotificationsSeen(notificationIds);
        if (error) return respondError(req, res, 500, error);
        respondSuccess(req, res, 200, "Notificaciones marcadas como vistas.");
    } catch (error) {
        handleError(error, "notification.controller -> markNotificationsSeen");
        respondError(req, res, 500, error.message);
    }
}

/**
 * Obtiene notificaciones por número de departamento.
 */
async function getOwnedNotificationsByDepartmentNumber(req, res) {
    try {
        const [notifications, error] = await NotificationService.getOwnedNotificationsByDepartmentNumber(req);
        if (error) return respondError(req, res, 500, error);
        respondSuccess(req, res, 200, notifications);
    } catch (error) {
        handleError(error, "notification.controller -> getOwnedNotificationsByDepartmentNumber");
        respondError(req, res, 500, error.message);
    }
}

/**
 * Elimina una lista de notificaciones.
 */
async function deleteNotifications(req, res) {
    try {
        const notificationIds = req.body.notificationIds;
        if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
            return respondError(req, res, 400, "No se proporcionaron IDs válidos de notificaciones.");
        }
        const [result, error] = await NotificationService.deleteNotifications(notificationIds);
        if (error) return respondError(req, res, 500, error);
        respondSuccess(req, res, 200, "Notificaciones eliminadas correctamente.");
    } catch (error) {
        handleError(error, "notification.controller -> deleteNotifications");
        respondError(req, res, 500, error.message);
    }
}

export default {
    markNotificationsSeen,
    getOwnedNotificationsByDepartmentNumber,
    deleteNotifications
};
