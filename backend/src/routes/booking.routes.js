import express from 'express';
import BookingController from '../controllers/booking.controller.js';

const router = express.Router();

// Listar todas las reservaciones
router.get('/bookings', BookingController.getAllBookings);

// Obtener una reservación específica por ID
router.get('/bookings/:id', BookingController.getBookingById);

// Crear una nueva reservación
router.post('/bookings', BookingController.createBooking);

// Actualizar una reservación existente
router.put('/bookings/:id', BookingController.updateBooking);

// Cancelar una reservación
router.delete('/bookings/:id', BookingController.deleteBooking);

export default router;
