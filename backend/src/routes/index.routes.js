"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Enrutador de usuarios  */
import userRoutes from "./user.routes.js";

/** Enrutador de usuarios  */
import orderRoutes from "./order.routes.js";
/** Enrutador de usuarios  */
import notificationsRoutes from "./notification.routes.js";

/** Enrutador de Reservas */
import bookingRoutes from "./booking.routes.js";

/** Enrutador de Espacio comun */
import commonSpaceRoutes from "./commonSpace.routes.js";

/** Enrutador de autenticación */
import authRoutes from "./auth.routes.js";

/** Enrutador de Imagenes */
import imageFileRoutes from "./imageFile.routes.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);

// Define las rutas para los pedidos /api/notifications
router.use("/notifications", authenticationMiddleware, notificationsRoutes);

// Define las rutas para los pedidos /api/orders
router.use("/orders", authenticationMiddleware, orderRoutes);

// Define las rutas para las reservaciones /api/bookings
router.use("/bookings", authenticationMiddleware, bookingRoutes);

// Define las rutas para los espacios comunes /api/commonSpaces
router.use("/commonSpaces", commonSpaceRoutes);

// Define las rutas para las imagenes /api/images
router.use("/images", imageFileRoutes);

// Exporta el enrutador
export default router;
