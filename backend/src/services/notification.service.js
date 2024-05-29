"use strict";

import Notification from "../models/notification.model.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Crea una nueva notificación en la base de datos.
 */
async function createNotificationForDepartment(description, departmentNumber) {
    try {
        let newNotification = new Notification({
            description: description,
            departmentNumber: departmentNumber
        });
        await newNotification.save();
        return [newNotification, null];
    } catch (error) {
        handleError(error, "notification.service -> createNotification");
        return [null, error.message];
    }
}

/**
 * Marca una lista de notificaciones como vistas.
 */
async function markNotificationsSeen(notificationIds) {
    try {
        const result = await Notification.updateMany(
            { _id: { $in: notificationIds } },
            { $set: { seen: true } }
        );
        return [result, null];
    } catch (error) {
        handleError(error, "notification.service -> markNotificationsSeen");
        return [null, error.message];
    }
}

/**
 * Obtiene notificaciones propiedad de un departamento específico.
 */
async function getOwnedNotificationsByDepartmentNumber(req) {
    try {
        const departmentNumber = req.departmentNumber;
        const notifications = await Notification.find({ departmentNumber });
        return [notifications, null];
    } catch (error) {
        handleError(error, "notification.service -> getOwnedNotificationsByDepartmentNumber");
        return [null, error.message];
    }
}

/**
 * Elimina una lista de notificaciones.
 */
async function deleteNotifications(notificationIds) {
    try {
        const result = await Notification.deleteMany({ _id: { $in: notificationIds } });
        return [result, null];
    } catch (error) {
        handleError(error, "notification.service -> deleteNotifications");
        return [null, error.message];
    }
}

export default {
  createNotificationForDepartment,
    markNotificationsSeen,
    getOwnedNotificationsByDepartmentNumber,
    deleteNotifications
};
