"use strict";
import express from "express";
import {
    createComment,
    getCommentsByAvisoId,
    getAvisoCommentsById,
    updateComment,
    deleteComment
} from "../controllers/comments.controller.js";
import authMiddleware from "../middlewares/authentication.middleware.js";  // Actualizar esta línea para usar el middleware correcto

const router = express.Router();

// Crear un comentario
router.post("/:avisoId", authMiddleware, createComment);

// Obtener todos los comentarios de un aviso
router.get("/:avisoId", getCommentsByAvisoId);

// Obtener un comentario por ID
router.get("/:avisoId/comment/:id", getAvisoCommentsById);

// Actualizar un comentario por ID
router.put("/:avisoId/comment/:id", authMiddleware, updateComment);

// Eliminar un comentario por ID
router.delete("/:avisoId/comment/:id", authMiddleware, deleteComment);

export default router;
