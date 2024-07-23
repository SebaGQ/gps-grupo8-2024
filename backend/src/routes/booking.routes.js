import express from "express";
import BookingController from "../controllers/booking.controller.js";

const router = express.Router();

// Listar todas las reservaciones
router.get("/", BookingController.getAllBookings);

// Obtener mis reservas
router.get("/my-bookings", BookingController.getMyBookings);

// Obtener una reservación específica por ID
router.get("/:id", BookingController.getBookingById);

// Crear una nueva reservación
router.post("/", BookingController.createBooking);

// Actualizar una reservación existente
router.put("/:id", BookingController.updateBooking);

// Cancelar una reservación
router.delete("/:id", BookingController.deleteBooking);

// Obtener una reservación por usuario
router.get("/user/:id", BookingController.getBookingByUser);

// Obtener una reservación por espacio común
router.get("/space/:id", BookingController.getBookingBySpace);

// Obtener reservación por fecha
router.get("/date/:date", BookingController.getBookingByDate);


export default router;
