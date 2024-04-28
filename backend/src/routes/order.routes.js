"use strict";

// Importa el módulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de entregas */
import orderController from "../controllers/order.controller.js";

/** Middlewares de autorización */
import { isAdmin, isJanitorOrAdmin } from "../middlewares/authorization.middleware.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// Define las rutas para las entregas
router.get("/", isJanitorOrAdmin, orderController.getOrders);

//Obtiene todas las entregas asociadas al usuario que realiza la solicitud.
router.get("/owned", orderController.getOwnedOrders);

//Obtiene entregas por número de departamento, pensado para el conserje.
router.get("/by-department/:departmentNumber", isJanitorOrAdmin,
            orderController.getOrdersByDepartmentNumber);

//Obtiene todas las entregas asociadas a un departamento.
router.get("/:id", isJanitorOrAdmin, orderController.getOrderById);

router.post("/", isJanitorOrAdmin, orderController.createOrder);
router.post("/withdraw", isJanitorOrAdmin, orderController.withdrawOrders);
router.post("/:orderId/ready-to-withdraw", isJanitorOrAdmin,
             orderController.markOrderAsReadyToWithdraw);

router.put("/:id", isJanitorOrAdmin, orderController.updateOrder);

router.delete("/:id", isJanitorOrAdmin, orderController.deleteOrder);

// Exporta el enrutador
export default router;
