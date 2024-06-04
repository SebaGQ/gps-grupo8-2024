import express from "express";
import BookingController from "../controllers/booking.controller.js";

const router = express.Router();

// Listar todas las reservaciones
router.get("/", BookingController.getAllBookings);

// Obtener una reservación específica por ID
router.get("/:id", BookingController.getBookingById);

// Crear una nueva reservación
router.post("/", BookingController.createBooking);

// Actualizar una reservación existente
router.put("/:id", BookingController.updateBooking);

// Cancelar una reservación
router.delete("/:id", BookingController.deleteBooking);

export default router;
