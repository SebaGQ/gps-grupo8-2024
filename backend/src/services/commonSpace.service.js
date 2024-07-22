"use strict";
import CommonSpace from "../models/commonSpace.model.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los espacios comunes.
 */
async function getAllCommonSpaces() {
    try {
        const commonSpaces = await CommonSpace.find().populate("image").exec();
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
        const commonSpace = await CommonSpace.findById(id).populate("image").exec();
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
            availability,
            location,
            openingHour,
            closingHour,
            allowedDays,
            capacity,
            image,
        } = req.body;
        // validar los dias permitidos
        if (allowedDays.length === 0) {
            return [null, "Debe seleccionar al menos un día permitido"];
        }

        // validar el nombre de los dias
        const validDays = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];
        // lowercase a los dias permitidos
        for (let i = 0; i < allowedDays.length; i++) {
            allowedDays[i] = allowedDays[i].toLowerCase();
        }
        // comparar los dias permitidos con los dias validos
        for (let i = 0; i < allowedDays.length; i++) {
            if (!validDays.includes(allowedDays[i])) {
                return [null, "Día no válido"];
            }
        }
        const newCommonSpace = new CommonSpace({
            type,
            availability,
            location,
            openingHour,
            closingHour,
            allowedDays,
            capacity,
            image,
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

