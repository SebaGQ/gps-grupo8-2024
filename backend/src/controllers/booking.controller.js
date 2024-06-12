"use strict";

import BookingService from "../services/booking.service.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todas las reservaciones.
 */
async function getAllBookings(req, res) {
    try {
        const [bookings, errorBookings] = await BookingService.getAllBookings();
        if (errorBookings) return respondError(req, res, 404, errorBookings);

        bookings.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, bookings);
    } catch (error) {
        handleError(error, "booking.controller -> getAllBookings");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Obtiene una reservación por ID.
 */
async function getBookingById(req, res) {
    try {
        const { params } = req;
        const [booking, errorBooking] = await BookingService.getBookingById(params.id);

        if (errorBooking) return respondError(req, res, 404, errorBooking);
        if (!booking) {
            return respondError(req, res, 404, "No se encontró la reservación");
        }

        respondSuccess(req, res, 200, booking);
    } catch (error) {
        handleError(error, "booking.controller -> getBookingById");
        respondError(req, res, 500, "No se pudo obtener la reservación");
    }
}

/**
 * Crea una nueva reservación.
 */
async function createBooking(req, res) {
    try {
        const [booking, errorBooking] = await BookingService.createBooking(req);
        if (errorBooking) return respondError(req, res, 400, errorBooking);

        respondSuccess(req, res, 201, booking);
    } catch (error) {
        handleError(error, "booking.controller -> createBooking");
        respondError(req, res, 500, error.message);
    }
}

/**
 * Actualiza una reservación.
 */
async function updateBooking(req, res) {
    try {
        const { params } = req;
        const [booking, errorBooking] = await BookingService.updateBooking(params.id, req);

        if (errorBooking) return respondError(req, res, 400, errorBooking);
        if (!booking) {
            return respondError(req, res, 404, "No se encontró la reservación");
        }

        respondSuccess(req, res, 200, booking);
    } catch (error) {
        handleError(error, "booking.controller -> updateBooking");
        respondError(req, res, 500, "No se pudo actualizar la reservación");
    }
}

/**
 * Elimina una reservación.
 */
async function deleteBooking(req, res) {
    try {
        const { params } = req;
        const [deletedBooking, errorBooking] = await BookingService.deleteBooking(params.id, req);

        if (errorBooking) return respondError(req, res, 400, errorBooking);
        if (!deletedBooking) {
            return respondError(req, res, 404, "No se encontró la reservación");
        }

        respondSuccess(req, res, 200, deletedBooking);
    } catch (error) {
        handleError(error, "booking.controller -> deleteBooking");
        respondError(req, res, 500, "No se pudo eliminar la reservación");
    }
}

/**
 * Obtiene  reservación por usuario.
 */
async function getBookingByUser(req, res) {
    try {
        const { params } = req;
        const [bookings, errorBookings] = await BookingService.getBookingsByUser(params.id);

        if (errorBookings) return respondError(req, res, 404, errorBookings);
        if (!bookings) {
            return respondError(req, res, 404, "No se encontraron reservaciones");
        }

        respondSuccess(req, res, 200, bookings);
    } catch (error) {
        handleError(error, "booking.controller -> getBookingByUser");
        respondError(req, res, 500, "No se pudo obtener la reservación");
    }
}

/**
 * Obtiene reservación por espacio común.
 */
async function getBookingBySpace(req, res) {
    try {
        const { params } = req;
        const [bookings, errorBookings] = await BookingService.getBookingsBySpace(params.id);

        if (errorBookings) return respondError(req, res, 404, errorBookings);
        if (!bookings) {
            return respondError(req, res, 404, "No se encontraron reservaciones");
        }

        respondSuccess(req, res, 200, bookings);
    } catch (error) {
        handleError(error, "booking.controller -> getBookingBySpace");
        respondError(req, res, 500, "No se pudo obtener la reservación");
    }
}

/**
 * Obtiene reservación por fecha.
 */
async function getBookingByDate(req, res) {
    try {
        const { params } = req;
        const [bookings, errorBookings] = await BookingService.getBookingsByDate(params.date);

        if (errorBookings) return respondError(req, res, 404, errorBookings);
        if (!bookings) {
            return respondError(req, res, 404, "No se encontraron reservaciones");
        }

        respondSuccess(req, res, 200, bookings);
    } catch (error) {
        handleError(error, "booking.controller -> getBookingByDate");
        respondError(req, res, 500, "No se pudo obtener la reservación");
    }
}

export default {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingByUser,
    getBookingBySpace,
    getBookingByDate,
};
