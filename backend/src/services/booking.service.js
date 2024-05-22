"use strict";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import { handleError } from "../utils/errorHandler.js";


/**
 * Obtiene todas las reservaciones.
 */
async function getAllBookings(req, res) {
    try {
        const bookings = await Booking.find().exec();
        if (!bookings) return [null, "No se encontraron reservaciones"];

    } catch (error) {
        handleError(error, "booking.service -> getAllBookings");
        return [null, error.message];
    }
}

/**
 * Obtiene una reservación por ID.
 */
async function getBookingById(id) {
    try {
        const booking = await Booking.findById(id).exec();
        if (!booking) return [null, "No se encontró la reservación"];

        return [booking, null];
    } catch (error) {
        handleError(error, "booking.service -> getBookingById");
        return [null, error.message];
    }
}

/**
 * Crea una nueva reservación.
 */
async function createBooking(req) {
    try {
        let email = req.body.email;
        const { spaceId, date, startTime, endTime } = req.body;

        // Verificar si el email ya está registrado
        let userId = await User
            .findOne({ email: email })
            .select("_id")
            .exec();
        if (!userId) return [null, "El email no está registrado"];

        // Verificar si el espacio existe
        const spaceExists = await CommonSpace.findById(spaceId);
        if (!spaceExists) return [null, "El espacio no existe"];
        // Verificar si la fecha de reserva ya está ocupada

        const bookings = await Booking.find({
            spaceId: spaceId,
            date: date,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } }
            ]
        });

        if (bookings.length > 0) return [null, "El espacio ya está reservado"];

        // Crear la reserva
        const newBooking = new Booking({ userId, spaceId, date, startTime, endTime });
        await newBooking.save();

        return [newBooking, null];
    } catch (error) {
        handleError(error, "booking.service -> createBooking");
        return [null, error.message];
    }
}

/**
 * Actualiza una reservación existente.
 */
async function updateBooking(id, req) {
    try {
        let email = req.body.email;
        // Verificar si el email ya está registrado
        let userId = await User
            .findOne({ email: email })
            .select("_id")
            .exec();
        if (!userId) return [null, "El email no está registrado"];

        //validacion el userId con el id de usuario de la reservacion
        const bookingUser = await Booking.findById(id).select("userId").exec();
        if (userId != bookingUser.userId || userId.roles != "admin") return [null, "El email no coincide con el usuario de la reservación"];

        const { spaceId, date, startTime, endTime } = req.body;
        const bookingData = { spaceId, date, startTime, endTime };
        const booking = await Booking.findByIdAndUpdate(id, bookingData, { new: true }).exec();
        if (!booking) return [null, "No se encontró la reservación"];

        return [booking, null];
    }
    catch (error) {
        handleError(error, "booking.service -> updateBooking");
        return [null, error.message];
    }
}

/**
 * Elimina una reservación.
 */
async function deleteBooking(id, req) {
    try {
        let email = req.body.email;
        // Verificar si el email ya está registrado
        let userId = await User
            .findOne({ email: email })
            .select("_id")
            .exec();
        if (!userId) return [null, "El email no está registrado"];

        //validacion el userId con el id de usuario de la reservacion 
        const bookingUser = await Booking.findById(id).select("userId").exec();
        if (userId != bookingUser.userId || userId.roles != "admin") return [null, "El email no coincide con el usuario de la reservación"];

        const booking = await Booking.findByIdAndDelete(id).exec();
        if (!booking) return [null, "No se encontró la reservación"];

        return [booking, null];
    } catch (error) {
        handleError(error, "booking.service -> deleteBooking");
        return [null, error.message];
    }
}

export default {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
};
