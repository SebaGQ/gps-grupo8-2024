"use strict";
import Comment from "../models/comment.model.js";
import Aviso from "../models/avisos.model.js";
import { commentSchemaJoi } from "../schema/comment.schema.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

// Crear un nuevo comentario
export const createComment = async (req, res) => {
    try {
        const { error } = commentSchemaJoi.validate(req.body);
        if (error) {
            return respondError(req, res, 400, error.details[0].message);
        }

        const comment = new Comment({
            aviso: req.params.avisoId,
            author: req.user._id,
            content: req.body.content
        });
        await comment.save();

        // Agregar comentario al aviso
        await Aviso.findByIdAndUpdate(req.params.avisoId, { $push: { comments: comment._id } });

        // Realizar populate del autor
        const populatedComment = await comment.populate('author', 'firstName lastName email roles');

        respondSuccess(req, res, 201, populatedComment);
    } catch (error) {
        handleError(error, "createComment");
        respondError(req, res, 500, error.message);
    }
};

// Obtener todos los comentarios de un aviso
export const getCommentsByAvisoId = async (req, res) => {
    try {
        const comments = await Comment.find({ aviso: req.params.avisoId })
            .populate('author', 'firstName lastName email roles');
        respondSuccess(req, res, 200, comments);
    } catch (error) {
        handleError(error, "getCommentsByAvisoId");
        respondError(req, res, 500, error.message);
    }
};

// Obtener comentario por la ID del comentario y la ID del aviso
export const getAvisoCommentsById = async (req, res) => {
    try {
        const comment = await Comment.findOne({ _id: req.params.commentId, aviso: req.params.avisoId }).populate('author', 'name');
        if (!comment) {
            return respondError(req, res, 404, 'Comentario no encontrado');
        }
        respondSuccess(req, res, 200, comment);
    } catch (error) {
        handleError(error, "getAvisoCommentsById");
        respondError(req, res, 500, error.message);
    }
};

// Actualizar un comentario por ID y la ID del aviso
export const updateComment = async (req, res) => {
    try {
        const { error } = commentSchemaJoi.validate(req.body);
        if (error) {
            return respondError(req, res, 400, error.details[0].message);
        }

        const updatedComment = await Comment.findOneAndUpdate({ _id: req.params.commentId, aviso: req.params.avisoId }, req.body, {
            new: true
        }).populate('author', 'firstName lastName email roles');
        if (!updatedComment) {
            return respondError(req, res, 404, 'Comentario no encontrado');
        }
        respondSuccess(req, res, 200, updatedComment);
    } catch (error) {
        handleError(error, "updateComment");
        respondError(req, res, 500, error.message);
    }
};

// Eliminar un comentario por ID y la ID del aviso
export const deleteComment = async (req, res) => {
    try {
        const { avisoId, commentId } = req.params;

        const comment = await Comment.findByIdAndDelete(commentId);

        if (!comment) {
            return respondError(req, res, 404, 'Comentario no encontrado');
        }

        await Aviso.findByIdAndUpdate(avisoId, {
            $pull: { comments: commentId }
        });

        respondSuccess(req, res, 200, comment);
    } catch (error) {
        handleError(error, "deleteComment");
        respondError(req, res, 500, error.message);
    }
};
