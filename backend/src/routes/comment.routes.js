// "use strict";
// import express from "express";
// import {
//     createComment,
//     getCommentsByAvisoId,
//     getAvisoCommentsById,
//     updateComment,
//     deleteComment
// } from "../controllers/comments.controller.js";
// import authMiddleware from "../middlewares/authentication.middleware.js";

// const router = express.Router();

// // Crear un comentario
// router.post("/:avisoId", authMiddleware, createComment);

// // Obtener todos los comentarios de un aviso
// router.get("/:avisoId", authMiddleware, getCommentsByAvisoId);

// // Obtener un comentario por ID
// router.get("/:avisoId/comments/:commentId", authMiddleware, getAvisoCommentsById);

// // Actualizar un comentario por ID
// router.put("/:avisoId/comments/:commentId", authMiddleware, updateComment);

// // Eliminar un comentario por ID
// router.delete("/:avisoId/comments/:commentId", authMiddleware, deleteComment);

// export default router;
