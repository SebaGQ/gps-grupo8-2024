"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de usuarios */
import visitorController from "../controllers/visitor.controller.js";

/** Middlewares de autorización */
import { isAdmin, isJanitorOrAdmin } from "../middlewares/authorization.middleware.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);
// Define las rutas para los usuarios
router.get("/", isJanitorOrAdmin, visitorController.getVisitors);
router.get("/active", isJanitorOrAdmin, visitorController.getActiveVisitors);
router.get("/frequent", isJanitorOrAdmin, visitorController.getFrequentVisitors);
router.post("/", isJanitorOrAdmin, visitorController.createVisitor);
router.get("/:id", isJanitorOrAdmin, visitorController.getVisitorById);
router.put("/:id", isJanitorOrAdmin, visitorController.updateVisitor);
router.put("/:id/exit-date", isJanitorOrAdmin, visitorController.updateVisitorExitDate);
router.delete("/:id", isAdmin, visitorController.deleteVisitor);

// Exporta el enrutador
export default router;
