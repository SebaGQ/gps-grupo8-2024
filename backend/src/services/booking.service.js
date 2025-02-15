/* eslint-disable max-len */
"use strict";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import CommonSpace from "../models/commonSpace.model.js";
import { handleError } from "../utils/errorHandler.js";
import Role from "../models/role.model.js";

import BinnacleService from "./binnacle.service.js";

/**
 * Obtiene todas las reservaciones.
 */
async function getAllBookings(req, res) {
    try {
        const bookings = await Booking.find().populate("userId").exec();
        if (!bookings) return [null, "No se encontraron reservaciones"];
        return [bookings, null];
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
        const email = req.email;
        const { spaceId, startTime, endTime } = req.body;

        // Verificar si el email ya está registrado
        const userId = await User
            .findOne({ email: email })
            .select("_id")
            .exec();
        if (!userId) return [null, "El email no está registrado"];

        // Verificar si el espacio existe
        const spaceExists = await CommonSpace.findById(spaceId);
        console.log(spaceExists);
        if (!spaceExists) return [null, "El espacio no existe"];

        // Validaciones adicionales
        const now = new Date();
        if (new Date(startTime) < now) return [null, "No se puede reservar en una fecha anterior a la actual"];
        if (new Date(endTime) <= new Date(startTime)) return [null, "La fecha de finalización debe ser posterior a la fecha de inicio"];

        // Verificar si la fecha de reserva está dentro de los días permitidos
        const dayOfWeek = new Date(startTime).toLocaleString("en-US", { weekday: "long" }).toLowerCase();
        if (!spaceExists.allowedDays.includes(dayOfWeek)) {
            return [null, "El espacio no está disponible para reservas en este día"];
        }

        // Verificar si la fecha de reserva ya está ocupada
        const bookings = await Booking.find({
            spaceId: spaceId,
            $or: [
                { startTime: { $lt: startTime }, endTime: { $gt: startTime } },
                { startTime: { $lt: endTime }, endTime: { $gt: endTime } },
                { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
            ],
        }).exec();

        // Verificar si la hora de inicio y fin de la reserva está dentro de las horas permitidas
        const startHour = new Date(startTime).getHours();
        const endHour = new Date(endTime).getHours();

        const openingHour = parseInt(spaceExists.openingHour.split(":")[0]);
        const closingHour = parseInt(spaceExists.closingHour.split(":")[0]);

        if (startHour < openingHour || endHour > closingHour) {
            return [null, "El espacio no está disponible para reservas en este horario"];
        }


        if (bookings.length > 0) return [null, "El espacio ya está reservado"];

        // Crear la reserva
        const newBooking = new Booking({ userId, spaceId, startTime, endTime });
        await newBooking.save();

        // Crear entrada en bitácora
        await BinnacleService.createEntryBooking(req);
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
        const email = req.email;
        const { spaceId, startTime, endTime } = req.body;
        const bookingUser = await Booking.findById(id).exec();
        // Verificar si el email ya está registrado
        const userId = await User
            .findOne({ email: email })
            .exec();
        const roles = await Role.find({ _id: { $in: userId.roles } });
        const nameRole = roles.map((role) => role.name);
        let notEqual = false;

        if (userId._id.toString() != bookingUser.userId.toString()) {
            notEqual = true;
            console.log("no son iguales");
        }
        let noAdminOrJanitor = false;
        if (nameRole[0] != "admin" && nameRole[0] != "janitor") {
            noAdminOrJanitor = true;
            console.log("no es admin ni janitor");
        }
        if (notEqual == true || noAdminOrJanitor == true) {
            return [null, "El email no coincide con el usuario de la reservación"];
        }

        // Verificar si el espacio existe
        const spaceExists = await CommonSpace.findById(spaceId).exec();
        if (!spaceExists) return [null, "El espacio no existe"];

        // Validaciones adicionales
        const now = new Date();
        if (new Date(startTime) < now) return [null, "No se puede reservar en una fecha anterior a la actual"];
        if (new Date(endTime) <= new Date(startTime)) return [null, "La fecha de finalización debe ser posterior a la fecha de inicio"];

        // Verificar si la fecha de reserva está dentro de los días permitidos
        const dayOfWeek = new Date(startTime).toLocaleString("en-US", { weekday: "long" }).toLowerCase();
        if (!spaceExists.allowedDays.includes(dayOfWeek)) {
            return [null, "El espacio no está disponible para reservas en este día"];
        }

        // Verificar si la fecha de reserva ya está ocupada, excluyendo la reserva actual
        const bookings = await Booking.find({
            spaceId: spaceId,
            _id: { $ne: id }, // Excluir la reserva actual
            $or: [
                { startTime: { $lt: startTime }, endTime: { $gt: startTime } },
                { startTime: { $lt: endTime }, endTime: { $gt: endTime } },
                { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
            ],
        }).exec();

        if (bookings.length > 0) return [null, "El espacio ya está reservado"];

        const updatedBooking = await Booking.findByIdAndUpdate(id, { spaceId, startTime, endTime }, { new: true }).exec();
        if (!updatedBooking) {
            return [null, "No se encontró la reservación"];
        }

        return [updatedBooking, null];
    } catch (error) {
        handleError(error, "booking.service -> updateBooking");
        return [null, error.message];
    }
}

/**
 * Elimina una reservación.
 */
async function deleteBooking(id, req) {
    try {
        const email = req.email;
        const bookingUser = await Booking.findById(id).exec();
        // Verificar si el email ya está registrado
        const userId = await User
            .findOne({ email: email })
            .exec();
        const roles = await Role.find({ _id: { $in: userId.roles } });
        const nameRole = roles.map((role) => role.name);
        const notEqual = false;

        if (userId._id.toString() != bookingUser.userId.toString()) {
            notEqual = true;
            console.log("no son iguales");
        }
        const noAdminOrJanitor = false;
        if (nameRole[0] != "admin" && nameRole[0] != "janitor") {
            noAdminOrJanitor = true;
            console.log("no es admin ni janitor");
        }
        if (notEqual == true || noAdminOrJanitor == true) {
            return [null, "El email no coincide con el usuario de la reservación"];
        }

        const booking = await Booking.findByIdAndDelete(id).exec();
        if (!booking) {
            return [null, "No se encontró la reservación"];
        }

        return [booking, null];
    } catch (error) {
        handleError(error, "booking.service -> deleteBooking");
        return [null, error.message];
    }
}

/**
 * get all bookings by user
 * @param {string} email
 * @returns {Array} bookings
 */
async function getBookingsByUser(email) {
    try {
        const userId = await User.findOne({ email }).select("_id").exec();
        if (!userId) return [null, "El email no está registrado"];
        const bookings = await Booking.find({ userId: userId }).exec();
        if (!bookings) return [null, "No se encontraron reservaciones"];
        return [bookings, null];
    } catch (error) {
        handleError(error, "booking.service -> getBookingsByUser");
        return [null, error.message];
    }
}

/**
 * get all bookings by space
 * @param {string} spaceId
 * @returns {Array} bookings
 */
async function getBookingsBySpace(spaceId) {
    try {
        const bookings = await Booking.find({ spaceId: spaceId }).exec();
        if (!bookings) return [null, "No se encontraron reservaciones"];
        return [bookings, null];
    } catch (error) {
        handleError(error, "booking.service -> getBookingsBySpace");
        return [bookings, null];
    }
}

/**
 * get all bookings by date
 * @param {string} date
 * @returns {Array} bookings
 */
async function getBookingsByDate(date) {
    try {
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);

        const bookings = await Booking.find({
            startTime: { $gte: startDate, $lt: endDate },
        }).exec();

        if (!bookings || bookings.length === 0) return [null, "No se encontraron reservaciones"];
        return [bookings, null];
    } catch (error) {
        handleError(error, "booking.service -> getBookingsByDate");
        return [null, error.message];
    }
}

export default {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingsByUser,
    getBookingsBySpace,
    getBookingsByDate,
};
