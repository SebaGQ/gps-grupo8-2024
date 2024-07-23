"use strict";
import Joi from "joi";

import ORDER_STATUSES from "../constants/orderstatus.constants.js";

/**
 * Esquema de validación para el cuerpo de la solicitud de pedidos.
 */
const orderBodySchema = Joi.object({
    departmentNumber: Joi.number().messages({
        "number.base": "El número del departamento debe ser de tipo number."
    }),
    janitorId: Joi.string().messages({
        "string.base": "El ID del conserje debe ser de tipo string."
    }),
    recipientFirstName: Joi.string().messages({
        "string.base": "El nombre del destinatario debe ser de tipo string."
    }),
    recipientLastName: Joi.string().messages({
        "string.base": "El apellido del destinatario debe ser de tipo string."
    }),
    deliveryTime: Joi.date().messages({
        "date.base": "La hora de entrega debe ser una fecha válida."
    }),
    withdrawnTime: Joi.date().allow(null).messages({
        "date.base": "La hora de retiro debe ser una fecha válida."
    }),
    withdrawnResidentId: Joi.string().messages({
        "string.base": "El ID del residente que retira debe ser de tipo string."
    }),
    withdrawnPersonFirstName: Joi.string().messages({
        "string.base": "El nombre de la persona que retira debe ser de tipo string."
    }),
    withdrawnPersonLastName: Joi.string().messages({
        "string.base": "El apellido de la persona que retira debe ser de tipo string."
    }),
    expectedWithdrawnPersonFirstName: Joi.string().messages({
        "string.base": "El nombre de la persona esperada para retirar debe ser de tipo string."
    }),
    expectedWithdrawnPersonLastName: Joi.string().messages({
        "string.base": "El apellido de la persona esperada para retirar debe ser de tipo string."
    }),
    deliveryPersonName: Joi.string().messages({
        "string.base": "El nombre de la persona de entrega debe ser de tipo string."
    }),
    status: Joi.string().valid(...ORDER_STATUSES).messages({
        "string.base": "El estado debe ser de tipo string.",
        "any.only": `El estado debe ser uno de: ${ORDER_STATUSES.join(', ')}.`
    })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales."
});

// Exportación de los esquemas
export { orderBodySchema };
