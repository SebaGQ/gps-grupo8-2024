"use strict";
import { Router } from "express";
import { createAviso, getAvisos, getAvisoById, updateAviso, deleteAviso } from "../controllers/avisos.controller.js";
import { createComment, getCommentsByAvisoId } from "../controllers/comments.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.post("/", authenticationMiddleware, createAviso);
router.get("/", getAvisos);
router.get("/:id", getAvisoById);
router.put("/:id", authenticationMiddleware, updateAviso);
router.delete("/:id", authenticationMiddleware, deleteAviso);

// Rutas de comentarios
router.post("/:avisoId/comments", authenticationMiddleware, createComment);
router.get("/:avisoId/comments", getCommentsByAvisoId);

export default router;
