"use strict"
import Joi from "joi";
import ACTIVITY_TYPES from "../constants/activitytypes.constants.js";
/* Esquema de validacion Bitacora */

const binnacleBodySchema = Joi.object({
    janitorId: Joi.string().required().messages({
        "string.empty": "El id del conserje no puede estar vacío.",
        "any.required": "El id del conserje es requerido."
    }),
    activityType: Joi.string().required().valid(...ACTIVITY_TYPES).messages({
        "string.empty": "El tipo de actividad no puede estar vacío.",
        "any.required": "El tipo de actividad es requerido.",
        "any.only": `El tipo de actividad debe ser uno de: ${ACTIVITY_TYPES.join(", ")}.`
    }),
    visitorName: Joi.string().allow("").messages({
        "string.empty": "El nombre del visitante no puede estar vacío."
    }),
    visitorLastName: Joi.string().allow("").messages({
        "string.empty": "El apellido del visitante no puede estar vacío."
    }),
    apartmentVisited: Joi.number().allow("").messages({
        "number.empty": "El número del departamento no puede estar vacío."
    }),
    timeEntered: Joi.date().allow("").messages({
        "date.empty": "La hora de entrada no puede estar vacía."
    }),
    timeExited: Joi.date().allow("").messages({
        "date.empty": "La hora de salida no puede estar vacía."
    }),
    spaceName: Joi.string().allow("").messages({
        "string.empty": "El nombre del espacio comunitario no puede estar vacío."
    }),
    usageStartTime: Joi.date().allow("").messages({
        "date.empty": "La hora de inicio de uso no puede estar vacía."
    }),
    usageEndTime: Joi.date().allow("").messages({
        "date.empty": "La hora de fin de uso no puede estar vacía."
    })
}).messages({
    "object.unknown": "No se permiten propiedades adicionales en la bitácora."
});

// Exportación de los esquemas
export { binnacleBodySchema };