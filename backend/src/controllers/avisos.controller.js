"use strict";
import Aviso from "../models/avisos.model.js";
import { avisoSchemaJoi } from "../schema/avisos.schema.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Crear un nuevo aviso
 */
export const createAviso = async (req, res) => {
    try {
        const { error } = avisoSchemaJoi.validate(req.body);
        if (error) {
            return respondError(req, res, 400, error.details[0].message);
        }

        const newAviso = new Aviso({
            ...req.body,
            author: req.user._id
        });
        const avisoSaved = await newAviso.save();
        respondSuccess(req, res, 201, avisoSaved);
    } catch (error) {
        handleError(error, "createAviso");
        respondError(req, res, 500, error.message);
    }
};

/**
 * Obtener todos los avisos
 */
export const getAvisos = async (req, res) => {
    try {
        const avisos = await Aviso.find()
            .populate('author')
            .populate({
                path: 'comments',
                populate: { path: 'author' }
            });
        respondSuccess(req, res, 200, avisos);
    } catch (error) {
        handleError(error, "getAvisos");
        respondError(req, res, 500, error.message);
    }
};

/**
 * Obtener un aviso por ID
 */
export const getAvisoById = async (req, res) => {
    try {
        const aviso = await Aviso.findById(req.params.id)
            .populate('author')
            .populate({
                path: 'comments',
                populate: { path: 'author' }
            });
        if (!aviso) {
            return respondError(req, res, 404, 'Aviso no encontrado');
        }
        respondSuccess(req, res, 200, aviso);
    } catch (error) {
        handleError(error, "getAvisoById");
        respondError(req, res, 500, error.message);
    }
};

/**
 * Actualizar un aviso por ID
 */
export const updateAviso = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = avisoSchemaJoi.validate(req.body);
        if (error) {
            return respondError(req, res, 400, error.details[0].message);
        }

        const updateData = { ...req.body };

        // Asegurarse de que no se actualice el campo author de manera incorrecta
        if (updateData.author) {
            delete updateData.author;
        }

        const updatedAviso = await Aviso.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedAviso) {
            return respondError(req, res, 404, 'Aviso no encontrado');
        }
        respondSuccess(req, res, 200, updatedAviso);
    } catch (error) {
        handleError(error, "updateAviso");
        respondError(req, res, 500, error.message);
    }
};

/**
 * Eliminar un aviso por ID
 */
export const deleteAviso = async (req, res) => {
    try {
        const deletedAviso = await Aviso.findByIdAndDelete(req.params.id);
        if (!deletedAviso) {
            return respondError(req, res, 404, 'Aviso no encontrado');
        }
        respondSuccess(req, res, 200, deletedAviso);
    } catch (error) {
        handleError(error, "deleteAviso");
        respondError(req, res, 500, error.message);
    }
};

/**
 * Manejar Like y Dislike en un aviso
 */
export const reactToAviso = async (req, res) => {
    try {
        const { avisoId } = req.params;
        const { reactionType } = req.body;
        const userId = req.user._id;

        const aviso = await Aviso.findById(avisoId);
        if (!aviso) {
            return respondError(req, res, 404, 'Aviso no encontrado');
        }

        if (!aviso.reactions) {
            aviso.reactions = { likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] };
        }

        const oppositeReaction = reactionType === 'like' ? 'dislike' : 'like';
        const reactionField = `${reactionType}s`;
        const oppositeField = `${oppositeReaction}s`;
        const reactionByField = `${reactionType}dBy`;
        const oppositeByField = `${oppositeReaction}dBy`;

        if (aviso.reactions[reactionByField].includes(userId)) {
            // Eliminar la reacción si ya existe
            aviso.reactions[reactionField] -= 1;
            aviso.reactions[reactionByField] = aviso.reactions[reactionByField].filter(id => id.toString() !== userId.toString());
        } else {
            // Agregar la nueva reacción
            aviso.reactions[reactionField] += 1;
            aviso.reactions[reactionByField].push(userId);

            // Eliminar la reacción opuesta si existe
            if (aviso.reactions[oppositeByField].includes(userId)) {
                aviso.reactions[oppositeField] -= 1;
                aviso.reactions[oppositeByField] = aviso.reactions[oppositeByField].filter(id => id.toString() !== userId.toString());
            }
        }

        await aviso.save();

        // Populate all necessary fields
        const populatedAviso = await Aviso.findById(avisoId)
            .populate('author')
            .populate({
                path: 'comments',
                populate: { path: 'author' }
            })
            .lean(); // Using lean() for better performance

        respondSuccess(req, res, 200, populatedAviso);
    } catch (error) {
        handleError(error, "reactToAviso");
        respondError(req, res, 500, error.message);
    }
};
