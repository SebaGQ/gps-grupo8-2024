"use strict"
import Joi from "joi";
import ACTIVITY_TYPES from "../constants/activitytypes.constants.js";
/* Esquema de validacion Bitacora */

const binnacleBodySchema = Joi.object({
    janitorId: Joi.string().required().messages({
        "string.empty": "El id del conserje no puede estar vacío.",
        "any.required": "El id del conserje es requerido."
    }),
    activityType: Joi.string().required().valid(...ACTIVITY_TYPES).messages({
        "string.empty": "El tipo de actividad no puede estar vacío.",
        "any.required": "El tipo de actividad es requerido.",
        "any.only": `El tipo de actividad debe ser uno de: ${ACTIVITY_TYPES.join(", ")}.`
    }),
    description: Joi.string().required().messages({
        "string.empty": "La descripción no puede estar vacía.",
        "any.required": "La descripción es requerida."
    }),
    timestamp: Joi.date().required().messages({
        "date.base": "El timestamp debe ser una fecha.",
        "any.required": "El timestamp es requerido."
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales en la bitácora."
});

// Exportación de los esquemas
export { binnacleBodySchema };