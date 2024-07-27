"use strict";

import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud de departamento.
 * @constant {Object}
 */
const departmentBodySchema = Joi.object({
  departmentNumber: Joi.number().required().messages({
    "number.base": "El número de departamento debe ser de tipo número.",
    "any.required": "El número de departamento es obligatorio.",
  }),
  residentId: Joi.string().pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/).messages({
    "string.pattern.base": "El ID del residente proporcionado no es un ObjectId válido.",
  })
}).messages({
  "object.unknown": "No se permiten propiedades adicionales para departamento.",
});

/**
 * Esquema de validación para el id de departamento.
 * @constant {Object}
 */
const departmentIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id no puede estar vacío.",
      "any.required": "El id es obligatorio.",
      "string.base": "El id debe ser de tipo string.",
      "string.pattern.base": "El id proporcionado no es un ObjectId válido.",
    }),
});

export { departmentBodySchema, departmentIdSchema };
