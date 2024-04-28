"use strict";

// Importa el módulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de órdenes */
import orderController from "../controllers/order.controller.js";

/** Middlewares de autorización */
import { isAdmin, isJanitorOrAdmin } from "../middlewares/authorization.middleware.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// Define las rutas para las órdenes
router.get("/", isJanitorOrAdmin, orderController.getOrders);
router.get("/owned", orderController.getOwnedOrders);
router.get("/by-department/:departmentNumber", isJanitorOrAdmin, orderController.getOrdersByDepartmentNumber);
router.get("/:id", isJanitorOrAdmin, orderController.getOrderById);

router.post("/", isJanitorOrAdmin, orderController.createOrder);
router.post("/withdraw", isJanitorOrAdmin, orderController.withdrawOrders);

router.put("/:id", isJanitorOrAdmin, orderController.updateOrder);

router.delete("/:id", isJanitorOrAdmin, orderController.deleteOrder);

// Exporta el enrutador
export default router;
