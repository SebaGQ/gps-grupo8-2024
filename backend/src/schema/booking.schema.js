"use strict";
import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud de Booking.
 */
const bookingSchemaJoi = Joi.object({
    spaceId: Joi.string().required().messages({
        "string.base": "El ID del espacio debe ser de tipo string.",
        "any.required": "El ID del espacio es obligatorio.",
    }),
    userId: Joi.string().required().messages({
        "string.base": "El ID del usuario debe ser de tipo string.",
        "any.required": "El ID del usuario es obligatorio.",
    }),
    date: Joi.date().required().messages({
        "date.base": "La fecha debe ser una fecha válida.",
        "any.required": "La fecha es obligatoria.",
    }),
    startTime: Joi.date().required().messages({
        "date.base": "La hora de inicio debe ser una fecha válida.",
        "any.required": "La hora de inicio es obligatoria.",
    }),
    endTime: Joi.date().required().messages({
        "date.base": "La hora de finalización debe ser una fecha válida.",
        "any.required": "La hora de finalización es obligatoria.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

// Exportación del esquema
export { bookingSchemaJoi };
