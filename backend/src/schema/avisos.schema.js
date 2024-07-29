"use strict";
import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud de Aviso.
 */
const avisoSchemaJoi = Joi.object({
    title: Joi.string().required().messages({
        "string.base": "El título debe ser de tipo string.",
        "any.required": "El título es obligatorio.",
    }),
    description: Joi.string().required().messages({
        "string.base": "La descripción debe ser de tipo string.",
        "any.required": "La descripción es obligatoria.",
    }),
    author: Joi.string().pattern(/^[a-f\d]{24}$/i).messages({
        "string.base": "El autor debe ser de tipo string.",
        "string.pattern.base": "El autor debe ser un ID válido de MongoDB.",
        "any.required": "El autor es obligatorio.",
    }),
    comments: Joi.array().items(Joi.string().pattern(/^[a-f\d]{24}$/i)).optional().messages({
        "array.base": "Los comentarios deben ser un arreglo de IDs de MongoDB.",
        "string.pattern.base": "Cada comentario debe ser un ID válido de MongoDB.",
    }),
    reactions: Joi.object({
        likes: Joi.number().default(0).messages({
            "number.base": "Los likes deben ser de tipo number.",
        }),
        dislikes: Joi.number().default(0).messages({
            "number.base": "Los dislikes deben ser de tipo number.",
        }),
        likedBy: Joi.array().items(Joi.string().pattern(/^[a-f\d]{24}$/i)).messages({
            "array.base": "Los usuarios que han dado like deben ser un arreglo de IDs de MongoDB.",
            "string.pattern.base": "Cada usuario que ha dado like debe ser un ID válido de MongoDB.",
        }),
        dislikedBy: Joi.array().items(Joi.string().pattern(/^[a-f\d]{24}$/i)).messages({
            "array.base": "Los usuarios que han dado dislike deben ser un arreglo de IDs de MongoDB.",
            "string.pattern.base": "Cada usuario que ha dado dislike debe ser un ID válido de MongoDB.",
        }),
    }).optional().messages({
        "object.base": "Las reacciones deben ser un objeto.",
    }),
    createdAt: Joi.date().optional().messages({
        "date.base": "La fecha de creación debe ser de tipo date.",
    }),
    updatedAt: Joi.date().optional().messages({
        "date.base": "La fecha de actualización debe ser de tipo date.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

// Exportación del esquema
export { avisoSchemaJoi };
