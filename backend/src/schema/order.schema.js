"use strict";
import Joi from "joi";

import ORDER_STATUSES from "../constants/orderstatus.constants.js";

/**
 * Esquema de validación para el cuerpo de la solicitud de pedidos.
 */
const orderBodySchema = Joi.object({
    departmentNumber: Joi.number().required().messages({
        "number.base": "El número del departamento debe ser de tipo number.",
        "any.required": "El número del departamento es obligatorio."
    }),
    janitorId: Joi.string().messages({
        "string.base": "El ID del conserje debe ser de tipo string.",
        "any.required": "El ID del conserje es obligatorio."
    }),
    recipientFirstName: Joi.string().required().messages({
        "string.base": "El nombre del destinatario debe ser de tipo string.",
        "any.required": "El nombre del destinatario es obligatorio."
    }),
    recipientLastName: Joi.string().required().messages({
        "string.base": "El apellido del destinatario debe ser de tipo string.",
        "any.required": "El apellido del destinatario es obligatorio."
    }),
    deliveryTime: Joi.date().required().messages({
        "date.base": "La hora de entrega debe ser una fecha válida.",
        "any.required": "La hora de entrega es obligatoria."
    }),
    withdrawnTime: Joi.date().allow(null).messages({
        "date.base": "La hora de retiro debe ser una fecha válida."
    }),
    deliveryPersonName: Joi.string().messages({
        "string.base": "El nombre de la persona de entrega debe ser de tipo string.",
        "any.required": "El nombre de la persona de entrega es obligatorio."
    }),
    status: Joi.string().valid(...ORDER_STATUSES).messages({
        "string.base": "El estado debe ser de tipo string.",
        "any.required": "El estado es obligatorio.",
        "any.only": `El estado debe ser uno de: ${ORDER_STATUSES.join(', ')}.`
    })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales."
});

// Exportación de los esquemas
export { orderBodySchema };
