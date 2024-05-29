"use strict";

import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud de visitante.
 * @constant {Object}
 */
const visitorBodySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
    "string.base": "El nombre debe ser de tipo string.",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "El apellido no puede estar vacío.",
    "any.required": "El apellido es obligatorio.",
    "string.base": "El apellido debe ser de tipo string.",
  }),
  rut: Joi.string()
    .required()
    .min(9)
    .max(10)
    .pattern(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/)
    .messages({
      "string.empty": "El RUT no puede estar vacío.",
      "any.required": "El RUT es obligatorio.",
      "string.base": "El RUT debe ser de tipo string.",
      "string.min": "El RUT debe tener al menos 9 caracteres.",
      "string.max": "El RUT debe tener al menos 10 caracteres.",
      "string.pattern.base":
        "El RUT tiene el formato XXXXXXXX-X, ejemplo: 12345678-9.",
    }),
  roles: Joi.array()
    .items(
      Joi.string().messages({
        "string.base": "El rol debe ser de tipo string.",
      }),
    )
    .messages({
      "array.base": "El rol debe ser de tipo array.",
      "any.required": "El rol es obligatorio.",
    }),
  departmentNumber: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El número de departamento no puede estar vacío.",
      "any.required": "El número de departamento es obligatorio.",
      "string.base": "El número de departamento debe ser de tipo string.",
      "string.pattern.base":
        "El número de departamento proporcionado no es un ObjectId válido.",
    }),
  exitDate: Joi.date().optional().messages({
    "date.base": "La fecha de salida debe ser de tipo fecha.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

/**
 * Esquema de validación para el id de visitante.
 * @constant {Object}
 */
const visitorIdSchema = Joi.object({
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

/**
 * Esquema de validación para la fecha de salida del visitante.
 * @constant {Object}
 */
const visitorExitDateSchema = Joi.object({
  exitDate: Joi.date().required().messages({
    "date.empty": "La fecha de salida no puede estar vacía.",
    "any.required": "La fecha de salida es obligatoria.",
    "date.base": "La fecha de salida debe ser de tipo fecha.",
  }),
});

export { visitorBodySchema, visitorIdSchema, visitorExitDateSchema };
