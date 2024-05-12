"use strict";

import BookingService from "../services/booking.service.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todas las reservaciones.
 */