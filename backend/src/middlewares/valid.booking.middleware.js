import { bookingSchemaJoi } from "../schema/booking.schema.js";
import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/** Valida el body de las peticiones según las reglas establecidas en el schema */
function validateBookingBody(req, res, next) {
  try {
    const { error } = bookingSchemaJoi.validate(req.body);
    if (error) {
      return respondError(req, res, 400, error.details[0].message);
    }
    next();
  } catch (error) {
    handleError(error, "validateBooking.middleware -> validateBookingBody");
    respondError(req, res, 500, "Error interno del servidor");
  }
}

export {
    validateBookingBody,
};
