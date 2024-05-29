"use strict";

import express from "express";
import commonSpaceController from "../controllers/commonSpace.controller.js";

const router = express.Router();

// Listar todos los espacios comunes
router.get("/", commonSpaceController.getAllCommonSpaces);

// Obtener un espacio común específico por ID
router.get("/:id", commonSpaceController.getCommonSpaceById);

// Crear un nuevo espacio común
router.post("/", commonSpaceController.createCommonSpace);

// Actualizar un espacio común existente
router.put("/:id", commonSpaceController.updateCommonSpace);

// Eliminar un espacio común
router.delete("/:id", commonSpaceController.deleteCommonSpace);

export default router;
