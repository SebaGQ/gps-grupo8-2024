"use strict";
import CommonSpace from "../models/commonSpace.model.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los espacios comunes.
 */
async function getAllCommonSpaces() {
    try {
        const commonSpaces = await CommonSpace.find().exec();
        if (!commonSpaces) return [null, "No se encontraron espacios comunes"];
        return [commonSpaces, null];
    } catch (error) {
        handleError(error, "commonSpace.service -> getAllCommonSpaces");
        return [null, error.message];
    }
}

/**
 * Obtiene un espacio común por ID.
 */
async function getCommonSpaceById(id) {
    try {
        const commonSpace = await CommonSpace.findById(id).exec();
        if (!commonSpace) return [null, "No se encontró el espacio común"];
        return [commonSpace, null];
    } catch (error) {
        handleError(error, "commonSpace.service -> getCommonSpaceById");
        return [null, error.message];
    }
}

/**
 * Crea un nuevo espacio común.
 */
async function createCommonSpace(req) {
    try {
        const {
            type,
            avaibility,
            location,
            openingHour,
            closingHour,
            allowedDays,
            capacity,
        } = req.body;
        const newCommonSpace = new CommonSpace({
            type,
            avaibility,
            location,
            openingHour,
            closingHour,
            allowedDays,
            capacity,
        });
        await newCommonSpace.save();
        return [newCommonSpace, null];
    } catch (error) {
        handleError(error, "commonSpace.service -> createCommonSpace");
        return [null, error.message];
    }
}

/**
 * Actualiza un espacio común.
 */
async function updateCommonSpace(id, body) {
    try {
        const updatedCommonSpace = await CommonSpace.findByIdAndUpdate(id, body, {
            new: true,
        }).exec();
        if (!updatedCommonSpace) return [null, "No se encontró el espacio común"];
        return [updatedCommonSpace, null];
    } catch (error) {
        handleError(error, "commonSpace.service -> updateCommonSpace");
        return [null, error.message];
    }
}

/**
 * Elimina un espacio común.
 */
async function deleteCommonSpace(id) {
    try {
        const deletedCommonSpace = await CommonSpace.findByIdAndDelete(id).exec();
        if (!deletedCommonSpace) return [null, "No se encontró el espacio común"];
        return [deletedCommonSpace, null];
    } catch (error) {
        handleError(error, "commonSpace.service -> deleteCommonSpace");
        return [null, error.message];
    }
}

export default {
    getAllCommonSpaces,
    getCommonSpaceById,
    createCommonSpace,
    updateCommonSpace,
    deleteCommonSpace,
};

