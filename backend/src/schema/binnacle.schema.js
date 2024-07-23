"use strict";
import Joi from "joi";
import CATEGORIES from "../constants/binnaclecategories.constants.js";
import ORDER_STATUSES from "../constants/orderstatus.constants.js";

const commonFields = {
    janitorId: Joi.string().messages({
        "string.empty": "El id del conserje no puede estar vacío.",
        "any.required": "El id del conserje es requerido."
    }),
    activityType: Joi.string().required().valid(...CATEGORIES).messages({
        "string.empty": "El tipo de actividad no puede estar vacío.",
        "any.required": "El tipo de actividad es requerido.",
        "any.only": `El tipo de actividad debe ser uno de: ${CATEGORIES.join(', ')}.`
    })
};

// Esquema para Visita
const visitaSchema = Joi.object({
    ...commonFields,
    name: Joi.string().required().messages({
        "string.empty": "El nombre no puede estar vacío.",
        "any.required": "El nombre es requerido para la visita."
    }),
    lastName: Joi.string().required().messages({
        "string.empty": "El apellido no puede estar vacío.",
        "any.required": "El apellido es requerido para la visita."
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
    departmentNumber: Joi.string().required().messages({
        "string.empty": "El número de departamento no puede estar vacío.",
        "any.required": "El número de departamento es requerido para la visita."
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales en la bitácora de visita."
});

// Esquema para Delivery
const deliverySchema = Joi.object({
    ...commonFields,
    departNumber: Joi.number().required().messages({
        "number.base": "El número de departamento debe ser un número.",
        "any.required": "El número de departamento es requerido para la entrega."
    }),
    recipientFirstName: Joi.string().required().messages({
        "string.base": "El nombre del destinatario no puede estar vacío.",
        "any.required": "El nombre del destinatario es requerido."
    }),
    recipientLastName: Joi.string().required().messages({
        "string.base": "El apellido del destinatario no puede estar vacío.",
        "any.required": "El apellido del destinatario es requerido."
    }),
    deliveryTime: Joi.date().required().messages({
        "date.base": "El tiempo de entrega debe ser una fecha válida.",
        "any.required": "El tiempo de entrega es requerido."
    }),
    withdrawnTime: Joi.date().allow(null).messages({
        "date.base": "El tiempo de retiro debe ser una fecha válida.",
    }),
    deliveryPersonName: Joi.string().messages({
        "string.empty": "El nombre de la persona que entrega no puede estar vacío.",
        "any.required": "El nombre de la persona que entrega es requerido."
    }),
    status: Joi.string().valid(...ORDER_STATUSES).messages({
        "string.empty": "El estado no puede estar vacío.",
        "any.required": "El estado es requerido.",
        "any.only": `El estado debe ser uno de: ${ORDER_STATUSES.join(', ')}.`
    })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales en la bitácora de entrega."
});

// Esquema para Espacio Comunitario
const espacioComunitarioSchema = Joi.object({
    ...commonFields,
    spaceId: Joi.string().required().messages({
        "string.empty": "El id del espacio comunitario no puede estar vacío.",
        "any.required": "El id del espacio comunitario es requerido."
    }),
    userId: Joi.string().required().messages({
        "string.empty": "El id del usuario no puede estar vacío.",
        "any.required": "El id del usuario es requerido."
    }),
    startTime: Joi.date().required().messages({
        "date.base": "El tiempo de inicio debe ser una fecha válida.",
        "any.required": "El tiempo de inicio es requerido."
    }),
    endTime: Joi.date().required().messages({
        "date.base": "El tiempo de fin debe ser una fecha válida.",
        "any.required": "El tiempo de fin es requerido."
    })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales en la bitácora de espacio comunitario."
});

// Mapeo de tipos de actividad a sus respectivos esquemas
const schemas = {
    'Visita': visitaSchema,
    'Delivery': deliverySchema,
    'Espacio Comunitario': espacioComunitarioSchema
};

// Función para seleccionar el esquema adecuado
const selectSchema = (activityType) => {
    const schema = schemas[activityType];
    if (!schema) {
        throw new Error('Tipo de actividad desconocido.');
    }
    return schema;
};

// Función para validar el cuerpo de la solicitud
const validateBinnacleBody = (data) => {
    const { activityType } = data;
    const schema = selectSchema(activityType);
    return schema.validate(data, { abortEarly: false });
};

/**
 * Esquema de validación para el id de bitacora
 */
const binnacleIdSchema = Joi.object({
    id: Joi.string().required().pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/).messages({
        "string.empty": "El id no puede estar vacío.",
        "any.required": "El id es obligatorio.",
        "string.base": "El id debe ser de tipo string.",
        "string.pattern.base": "El id proporcionado no es un ObjectId válido.",
    })
});
export { validateBinnacleBody, binnacleIdSchema };
