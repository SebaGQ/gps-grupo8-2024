"use strict";

// Importa el módulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de roles */
import RoleController from "../controllers/role.controller.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Middleware de autorización */
import { isAdmin } from "../middlewares/authorization.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// Define las rutas para los roles
router.get("/", isAdmin, RoleController.getRoles);

// Exporta el enrutador
export default router;
