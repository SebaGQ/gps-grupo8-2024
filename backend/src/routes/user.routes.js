"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de usuarios */
import usuarioController from "../controllers/user.controller.js";

/** Middlewares de autorización */
import { isAdmin, isJanitorOrAdmin } from "../middlewares/authorization.middleware.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);
// Define las rutas para los usuarios
router.get("/department", usuarioController.getUsersByDepartmentNumber);
router.get("/department/:departmentNumber", isJanitorOrAdmin, usuarioController.getUsersByDepartmentNumberInput);
router.get("/", isAdmin, usuarioController.getUsers);
router.post("/", isAdmin, usuarioController.createUser);
router.get("/:id", usuarioController.getUserById);
router.put("/:id", isAdmin, usuarioController.updateUser);
router.delete("/:id", isAdmin, usuarioController.deleteUser);

// Exporta el enrutador
export default router;
