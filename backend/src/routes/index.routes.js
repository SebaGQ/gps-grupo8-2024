"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Enrutador de usuarios  */
import userRoutes from "./user.routes.js";

/** Enrutador de usuarios  */
import orderRoutes from "./order.routes.js";
/** Enrutador de usuarios  */
import notificationsRoutes from "./notification.routes.js";

/** Enrutador de autenticación */
import authRoutes from "./auth.routes.js";

/** Enrutador de avisos */
import avisosRoutes from "./avisos.routes.js";

/** Enrutador de comentarios */
import commentRoutes from "./comment.routes.js";
import visitorRoutes from "./visitor.routes.js";

import departmentRoutes from "./department.routes.js";

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

// Define las rutas para los avisos /api/avisos
router.use("/avisos", avisosRoutes); // Ruta de avisos

// Define las rutas para los comentarios /api/comments
router.use("/comments", commentRoutes);
//Define las rutas para los visitantes /api/visitors
router.use("/visitor", authenticationMiddleware, visitorRoutes);

//Define las rutas para los departamentos /api/department
router.use("/department", authenticationMiddleware, departmentRoutes);

// Exporta el enrutador
export default router;
