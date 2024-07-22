"use strict";
import Aviso from "../models/avisos.model.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Crear un nuevo aviso
 */
export const createAviso = async (req, res) => {
    try {
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
        const avisos = await Aviso.find().populate('author').populate('comments');
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
        const aviso = await Aviso.findById(req.params.id).populate('author').populate('comments');
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
        const updateData = { ...req.body };

        // Asegurarse de que no se actualice el acampo author de manera incorrecta
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
 * Manejar Like en un aviso
 */
export const likeAviso = async (req, res) => {
    try {
        const { id } = req.params;
        const aviso = await Aviso.findById(id);
        if (!aviso) {
            return respondError(req, res, 404, 'Aviso no encontrado');
        }
        aviso.reactions.likes += 1;
        await aviso.save();
        respondSuccess(req, res, 200, aviso);
    } catch (error) {
        handleError(error, "likeAviso");
        respondError(req, res, 500, error.message);
    }
};


/**
 * Manejar Dislike en un aviso
 */
export const dislikeAviso = async (req, res) => {
    try {
        const { id } = req.params;
        const aviso = await Aviso.findById(id);
        if (!aviso) {
            return respondError(req, res, 404, 'Aviso no encontrado');
        }
        aviso.reactions.dislikes += 1;
        await aviso.save();
        respondSuccess(req, res, 200, aviso);
    } catch (error) {
        handleError(error, "dislikeAviso");
        respondError(req, res, 500, error.message);
    }
};
