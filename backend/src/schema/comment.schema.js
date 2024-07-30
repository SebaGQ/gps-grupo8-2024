"use strict";
import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud de Comentario.
 */
const commentSchemaJoi = Joi.object({
    aviso: Joi.string().pattern(/^[a-f\d]{24}$/i).messages({
        "string.base": "El aviso debe ser de tipo string.",
        "string.pattern.base": "El aviso debe ser un ID válido de MongoDB.",
        "any.required": "El aviso es obligatorio.",
    }),
    author: Joi.string().pattern(/^[a-f\d]{24}$/i).messages({
        "string.base": "El autor debe ser de tipo string.",
        "string.pattern.base": "El autor debe ser un ID válido de MongoDB.",
        "any.required": "El autor es obligatorio.",
    }),
    content: Joi.string().required().messages({
        "string.base": "El contenido debe ser de tipo string.",
        "any.required": "El contenido es obligatorio.",
    }),
    createdAt: Joi.date().optional().messages({
        "date.base": "La fecha de creación debe ser de tipo date.",
    })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

// Exportación del esquema
export { commentSchemaJoi };
