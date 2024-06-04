"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de usuarios */
import visitorController from "../controllers/visitor.controller.js";

/** Middlewares de autorización */
import { isAdmin } from "../middlewares/authorization.middleware.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);
// Define las rutas para los usuarios
router.get("/", isAdmin, visitorController.getVisitors);
router.post("/", isAdmin, visitorController.createVisitor);
router.get("/:id", visitorController.getVisitorById);
router.put("/:id", isAdmin, visitorController.updateVisitor);
router.put("/:id/exit-date", isAdmin, visitorController.updateVisitorExitDate);
router.delete("/:id", isAdmin, visitorController.deleteVisitor);

// Exporta el enrutador
export default router;
