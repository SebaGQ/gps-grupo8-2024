"use strict";

import express from "express";
import commonSpaceController from "../controllers/commonSpace.controller.js";
import { isJanitorOrAdmin } from "../middlewares/authorization.middleware.js";
const router = express.Router();

// Listar todos los espacios comunes
router.get("/", commonSpaceController.getAllCommonSpaces);

// Obtener un espacio común específico por ID
router.get("/:id", commonSpaceController.getCommonSpaceById);

// Crear un nuevo espacio común
router.post("/", /* isJanitorOrAdmin, */ commonSpaceController.createCommonSpace);

// Actualizar un espacio común existente
router.put("/:id", isJanitorOrAdmin, commonSpaceController.updateCommonSpace);

// Eliminar un espacio común
router.delete("/:id", isJanitorOrAdmin, commonSpaceController.deleteCommonSpace);

export default router;
