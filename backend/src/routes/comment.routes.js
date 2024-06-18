"use strict";
import express from "express";
import {
    createComment,
    getComments,
    getAvisoCommentsById,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Crear un comentario
router.post("/", authMiddleware, createComment);

// Obtener todos los comentarios de un aviso
router.get("/:avisoId", getComments);

// Obtener un comentario por ID
router.get("/comment/:id", getAvisoCommentsById);

// Actualizar un comentario por ID
router.put("/comment/:id", authMiddleware, updateComment);

// Eliminar un comentario por ID
router.delete("/comment/:id", authMiddleware, deleteComment);

export default router;