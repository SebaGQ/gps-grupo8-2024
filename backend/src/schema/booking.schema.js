"use strict";
import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud de Booking.
 */
const bookingSchemaJoi = Joi.object({
    spaceId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.base": "El ID del espacio debe ser de tipo string.",
        "string.pattern.base": "El ID del espacio debe ser un ObjectId válido de Mongoose.",
        "any.required": "El ID del espacio es obligatorio.",
    }),
    startTime: Joi.date().required().messages({
        "date.base": "La hora de inicio debe ser una fecha válida.",
        "any.required": "La hora de inicio es obligatoria.",
        "date.min": "La hora de inicio debe ser mayor a la hora actual.",
    }),
    endTime: Joi.date().required().messages({
        "date.base": "La hora de finalización debe ser una fecha válida.",
        "any.required": "La hora de finalización es obligatoria.",
        "date.min": "La hora de finalización debe ser mayor a la hora de inicio.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

// Exportación del esquema
export { bookingSchemaJoi };
