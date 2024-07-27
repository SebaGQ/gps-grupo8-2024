import { commonSpaceSchemaJoi } from "../schema/commonSpace.schema.js";
import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/** Valida el body de las peticiones según las reglas establecidas en el schema */
function validateCommonSpaceBody(req, res, next) {
  try {
    const { error } = commonSpaceSchemaJoi.validate(req.body);
    if (error) {
      return respondError(req, res, 400, error.details[0].message);
    }
    next();
  } catch (error) {
    handleError(error, "validateCommmonSpace.middleware -> validateCommmonSpaceBody");
    respondError(req, res, 500, "Error interno del servidor");
  }
}

export {
    validateCommonSpaceBody,
};
