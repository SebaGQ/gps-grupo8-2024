"use strict";

import { Router } from "express";
import notificationController from "../controllers/notification.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isJanitorOrAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

// Middleware de autenticación aplicado a todas las rutas de notificaciones
router.use(authenticationMiddleware);

// Define las rutas para las notificaciones
router.post("/mark-seen", isJanitorOrAdmin, notificationController.markNotificationsSeen);
router.get("/owned", notificationController.getOwnedNotificationsByDepartmentNumber);
router.delete("/", isJanitorOrAdmin, notificationController.deleteNotifications);

export default router;
