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
        if(!bookings) return [null, "No se encontraron reservaciones"];
        
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
        if(!booking) return [null, "No se encontró la reservación"];

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
        let bookingData = req.body;

        // Verificar si el email ya está registrado
        let userId = await User
            .findOne({ email: email })
            .select("_id")
            .exec();
        if(!userId) return [null, "El email no está registrado"];

        // agregar el id de usuario a la reservación
        bookingData.userId = userId;

        //Realizar validaciones de fechas de reservas
        let bookingDate = new Date(bookingData.bookingDate);
        let currentDate = new Date();
        if(bookingDate < currentDate) return [null, "La fecha de reserva no puede ser anterior a la fecha actual"];

        // Verificar si la fecha de reserva ya está ocupada

        // Crear la reservación
        const booking = new Booking(bookingData);
        await booking.save();

        return [booking, null];
    } catch (error) {
        handleError(error, "booking.service -> createBooking");
        return [null, error.message];
    }
}

/**
 * Actualiza una reservación existente.
 */
async function updateBooking(id, bookingData) {
    try {
        const booking = await Booking.findByIdAndUpdate(id, bookingData, { new: true }).exec();
        if(!booking) return [null, "No se encontró la reservación"];

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
async function deleteBooking(id) {
    try {
        const booking = await Booking.findByIdAndDelete(id).exec();
        if(!booking) return [null, "No se encontró la reservación"];

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
    