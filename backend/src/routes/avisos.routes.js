"use strict";
import { Router } from "express";
import { createAviso, getAvisos, getAvisoById, updateAviso, deleteAviso } from "../controllers/avisos.controller.js";
import { createComment, deleteComment, getAvisoCommentsById, getCommentsByAvisoId, updateComment } from "../controllers/comments.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

// Rutas de avisos
router.post("/", authenticationMiddleware, createAviso);
router.get("/", getAvisos);
router.get("/:id", getAvisoById);
router.put("/:id", authenticationMiddleware, updateAviso);
router.delete("/:id", authenticationMiddleware, deleteAviso);

// Rutas de comentarios dentro de avisos
router.post("/:avisoId/comments", authenticationMiddleware, createComment);
router.get("/:avisoId/comments", getCommentsByAvisoId);
router.get("/:avisoId/comments/:commentId", getAvisoCommentsById);
router.put("/:avisoId/comments/:commentId", authenticationMiddleware, updateComment);
router.delete("/:avisoId/comments/:commentId", authenticationMiddleware, deleteComment);

export default router;
