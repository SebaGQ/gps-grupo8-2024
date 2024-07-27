"use strict";
import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud de CommonSpace.
 */
const commonSpaceSchemaJoi = Joi.object({
    type: Joi.string().pattern(/^[A-Za-z\s]+$/).required().messages({
        "string.base": "El tipo debe ser de tipo string.",
        "string.pattern.base": "El tipo solo puede contener letras y espacios.",
        "any.required": "El tipo es obligatorio.",
    }),
    capacity: Joi.number().min(1).optional().messages({
        "number.base": "La capacidad debe ser de tipo number.",
        "number.min": "La capacidad no puede ser menor a 1.",
    }),
    availability: Joi.boolean().required().default(true).messages({
        "boolean.base": "La disponibilidad debe ser de tipo boolean.",
        "any.required": "La disponibilidad es obligatoria.",
    }),
    location: Joi.string().pattern(/^[A-Za-z\s]+$/).required().messages({
        "string.base": "La ubicación debe ser de tipo string.",
        "string.pattern.base": "La ubicación solo puede contener letras y espacios.",
        "any.required": "La ubicación es obligatoria.",
    }),
    openingHour: Joi.string().pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/).required().messages({
        "string.base": "La hora de apertura debe ser de tipo string.",
        "string.pattern.base": "La hora de apertura debe tener el formato HH:mm.",
        "any.required": "La hora de apertura es obligatoria.",
    }),
    closingHour: Joi.string().pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/).required().messages({
        "string.base": "La hora de cierre debe ser de tipo string.",
        "string.pattern.base": "La hora de cierre debe tener el formato HH:mm.",
        "any.required": "La hora de cierre es obligatoria.",
    }),
    allowedDays: Joi.array().items(Joi.string()).when("type", {
        is: "barbecue",
        then: Joi.required(),
        otherwise: Joi.optional(),
    }).messages({
        "array.base": "Los días permitidos deben ser un arreglo de strings.",
        "any.required": "Los días permitidos son obligatorios para el tipo 'barbecue'.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

// Exportación del esquema
export { commonSpaceSchemaJoi };
