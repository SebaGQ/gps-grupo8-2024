"use strict";

// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

import departmentController from "../controllers/department.controller.js";

/** Middlewares de autorización */
import { isAdmin } from "../middlewares/authorization.middleware.js";
/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();
// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);
// Define las rutas para los departamentos
router.get("/", departmentController.getDepartments);
router.post("/", isAdmin, departmentController.createDepartment);
router.get("/:id", departmentController.getDepartmentById);
router.put("/:id", isAdmin, departmentController.updateDepartment);
router.delete("/:id", isAdmin, departmentController.deleteDepartment);

export default router;
