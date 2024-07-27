import Joi from "joi";
import CATEGORIES from "../constants/binnaclecategories.constants.js";
import ORDER_STATUSES from "../constants/orderstatus.constants.js";

const commonFields = {
    janitorID: Joi.string().messages({
        "string.empty": "El id del conserje no puede estar vacío.",
        "any.required": "El id del conserje es requerido."
    }),
    activityType: Joi.string().valid(...CATEGORIES).messages({
        "string.empty": "El tipo de actividad no puede estar vacío.",
        "any.required": "El tipo de actividad es requerido.",
        "any.only": `El tipo de actividad debe ser uno de: ${CATEGORIES.join(', ')}.`
    })
};

// Esquema para Visita
const visitaBodySchema = Joi.object({
    ...commonFields,
    name: Joi.string().pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+$/).required().messages({
        "string.empty": "El nombre no puede estar vacío.",
        "any.required": "El nombre es obligatorio.",
        "string.base": "El nombre debe ser de tipo string.",
    }),
    lastName: Joi.string().pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+$/).required().messages({
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
    departmentNumber: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.empty": "El número de departamento no puede estar vacío.",
        "any.required": "El número de departamento es requerido para la visita."
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
    entryDate: Joi.date().optional().messages({
        "date.base": "La fecha de entrada debe ser de tipo fecha.",
    }),
    exitDate: Joi.date().optional().messages({
        "date.base": "La fecha de salida debe ser de tipo fecha.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales en la bitácora de visita."
});

// Esquema para Delivery
const deliverySchema = Joi.object({
    ...commonFields,
    departmentNumber: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.empty": "El número de departamento no puede estar vacío.",
        "any.required": "El número de departamento es requerido para la visita."
    }),
    recipientFirstName: Joi.string().pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+$/).required().messages({
        "string.empty": "El nombre del destinatario no puede estar vacío.",
        "any.required": "El nombre del destinatario es requerido."
    }),
    recipientLastName: Joi.string().pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+$/).required().messages({
        "string.empty": "El apellido del destinatario no puede estar vacío.",
        "any.required": "El apellido del destinatario es requerido."
    }),
    deliveryTime: Joi.date().required().messages({
        "date.base": "El tiempo de entrega debe ser una fecha válida.",
        "any.required": "El tiempo de entrega es requerido."
    }),
    withdrawnTime: Joi.date().allow(null).messages({
        "date.base": "El tiempo de retiro debe ser una fecha válida."
    }),
    deliveryPersonName: Joi.string().pattern(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+$/).messages({
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
    spaceId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.empty": "El id del espacio comunitario no puede estar vacío.",
        "any.required": "El id del espacio comunitario es requerido."
    }),
    userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        "string.base": "El ID del usuario debe ser de tipo string.",
        "any.required": "El ID del usuario es obligatorio.",
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

// Funciones de Validación
const validateVisitaBody = (data) => {
    return visitaBodySchema.validate(data, { abortEarly: false });
};

const validateDeliveryBody = (data) => {
    return deliverySchema.validate(data, { abortEarly: false });
};

const validateEspacioComunitarioBody = (data) => {
    return espacioComunitarioSchema.validate(data, { abortEarly: false });
};

/**
 * Esquema de validación para el id de bitacora
 */
const binnacleIdSchema = Joi.object({
    id: Joi.string().required().pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/).messages({
        "string.empty": "El id no puede estar vacío.",
        "any.required": "El id es obligatorio.",
        "string.pattern.base": "El id proporcionado no es un ObjectId válido."
    })
});

export { validateVisitaBody, validateDeliveryBody, validateEspacioComunitarioBody, binnacleIdSchema };
