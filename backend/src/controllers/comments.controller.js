"use strict";
import Comment from "../models/comment.model.js";
import Aviso from "../models/avisos.model.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

// Crear un nuevo comentario
export const createComment = async (req, res) => {
    try {
        const comment = new Comment({
            aviso: req.params.avisoId,  // Usar req.params.avisoId en lugar de req.body.aviso
            author: req.user._id,  // Asegurarse de que req.user._id está presente
            content: req.body.content
        });
        await comment.save();

        // Agregar comentario al aviso
        await Aviso.findByIdAndUpdate(req.params.avisoId, { $push: { comments: comment._id } });
        respondSuccess(req, res, 201, comment);
    } catch (error) {
        handleError(error, "createComment");
        respondError(req, res, 500, error.message);
    }
};

// Obtener todos los comentarios de un aviso
export const getCommentsByAvisoId = async (req, res) => {
    try {
        const comments = await Comment.find({ aviso: req.params.avisoId }).populate('author', 'name');
        respondSuccess(req, res, 200, comments);
    } catch (error) {
        handleError(error, "getCommentsByAvisoId");
        respondError(req, res, 500, error.message);
    }
};

// Obtener comentario por la ID del comentario
export const getAvisoCommentsById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('author', 'name');
        if (!comment) {
            return respondError(req, res, 404, 'Comentario no encontrado');
        }
        respondSuccess(req, res, 200, comment);
    } catch (error) {
        handleError(error, "getAvisoCommentsById");
        respondError(req, res, 500, error.message);
    }
};

// Actualizar un comentario por ID
export const updateComment = async (req, res) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!updatedComment) {
            return respondError(req, res, 404, 'Comentario no encontrado');
        }
        respondSuccess(req, res, 200, updatedComment);
    } catch (error) {
        handleError(error, "updateComment");
        respondError(req, res, 500, error.message);
    }
};

// Eliminar un comentario por ID
export const deleteComment = async (req, res) => {
    try {
        const deleteComment = await Comment.findByIdAndDelete(req.params.id);
        if (!deleteComment) {
            return respondError(req, res, 404, 'Comentario no encontrado');
        }
        const aviso = await Aviso.findById(deleteComment.aviso);
        aviso.comments = aviso.comments.pull(deleteComment._id);
        await aviso.save();

        respondSuccess(req, res, 200, deleteComment);
    } catch (error) {
        handleError(error, "deleteComment");
        respondError(req, res, 500, error.message);
    }
};
