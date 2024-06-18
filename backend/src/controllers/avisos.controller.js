"use strict";
import Aviso from "../models/aviso.model.js";
import Comment from "../models/comment.model.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Crear un nuevo aviso
 */
export const createAviso = async (req, res) => {
    try {
        const newAviso = new Aviso(req.body);
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
        const updatedAviso = await Aviso.findByIdAndUpdate(req.params.id, req.body, {
            new: true
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
