"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import OrderService from "../services/order.service.js";
import { orderBodySchema } from "../schema/order.schema.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todas las entregas
 */
async function getOrders(req, res) {
    try {
        const [orders, errorOrders] = await OrderService.getOrders();
        if (errorOrders) return respondError(req, res, 404, errorOrders);

        orders.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, orders);
    } catch (error) {
        handleError(error, "order.controller -> getOrders");
        respondError(req, res, 400, error.message);
    }
}

async function getOrderById(req, res) {
  try {
      const { params } = req;
      const [order, errorOrder] = await OrderService.getOrderById(params.id);

      if (errorOrder) return respondError(req, res, 404, errorOrder);
      if (!order) {
          return respondError(req, res, 404, "No se encontró la orden");
      }

      respondSuccess(req, res, 200, order);
  } catch (error) {
      handleError(error, "order.controller -> getOrderById");
      respondError(req, res, 500, "No se pudo obtener la orden");
  }
}

/**
 * Obtiene todas las entregas asociadas al departmentNumber del usuario que realiza la solicitud.
 */
async function getOwnedOrders(req, res) {
    try {
        const departmentNumber = req.departmentNumber;
        const [orders, errorOrders] = await OrderService.getOwnedOrders(departmentNumber);
        if (errorOrders) return respondError(req, res, 404, errorOrders);

        orders.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, orders);
    } catch (error) {
        handleError(error, "order.controller -> getOwnedOrders");
        respondError(req, res, 500, error.message);
    }
}

/**
 * Obtiene todas las entregas asociadas a un departmentNumber específico.
 */
async function getOrdersByDepartmentNumber(req, res) {
    try {
        const departmentNumber = parseInt(req.params.departmentNumber); // Obteniendo el departmentNumber de los parámetros de la URL
        if (isNaN(departmentNumber)) {
            return respondError(req, res, 400, "El número de departamento debe ser un número válido.");
        }

        const [orders, errorOrders] = await OrderService.getOrdersByDepartmentNumber(departmentNumber);
        if (errorOrders) return respondError(req, res, 404, errorOrders);

        orders.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, orders);
    } catch (error) {
        handleError(error, "order.controller -> getOrdersByDepartmentNumber");
        respondError(req, res, 500, error.message);
    }
}


/**
 * Crea una nueva orden
 */
async function createOrder(req, res) {
    try {
        const { body } = req;
        const { error: bodyError } = orderBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
       
        const [newOrder, orderError] = await OrderService.createOrder(req);

        if (orderError) return respondError(req, res, 400, orderError);
        if (!newOrder) {
            return respondError(req, res, 400, "No se creó la orden");
        }

        respondSuccess(req, res, 201, newOrder);
    } catch (error) {
        handleError(error, "order.controller -> createOrder");
        respondError(req, res, 500, "No se pudo crear la orden");
    }
}

/**
 * Actualiza una orden por su ID
 */
async function updateOrder(req, res) {
    try {
        const { params, body } = req;
        const { error: bodyError } = orderBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [updatedOrder, updateError] = await OrderService.updateOrder(params.id, body);

        if (updateError) return respondError(req, res, 400, updateError);
        if (!updatedOrder) {
            return respondError(req, res, 404, "No se encontró la orden");
        }

        respondSuccess(req, res, 200, updatedOrder);
    } catch (error) {
        handleError(error, "order.controller -> updateOrder");
        respondError(req, res, 500, "No se pudo actualizar la orden");
    }
}

/**
 * Elimina una orden por su ID
 */
async function deleteOrder(req, res) {
    try {
        const { params } = req;
        const [deletedOrder, deleteError] = await OrderService.deleteOrder(params.id);

        if (deleteError) return respondError(req, res, 400, deleteError);
        if (!deletedOrder) {
            return respondError(req, res, 404, "No se encontró la orden para eliminar");
        }

        respondSuccess(req, res, 200, "Orden eliminada correctamente");
    } catch (error) {
        handleError(error, "order.controller -> deleteOrder");
        respondError(req, res, 500, "No se pudo eliminar la orden");
    }
}

async function markOrderAsReadyToWithdraw(req, res) {
    try {
        const orderId = req.params.orderId;
        const departmentNumber = req.departmentNumber;
        console.log("controller department"+departmentNumber);
        let withdrawData = {};

        if (req.body.withdrawnResidentId) {
            withdrawData.residentId = req.body.withdrawnResidentId;
        } else {
            withdrawData.expectedWithdrawnPersonFirstName = req.body.expectedWithdrawnPersonFirstName;
            withdrawData.expectedWithdrawnPersonLastName = req.body.expectedWithdrawnPersonLastName;
        }

        const [success, error] = await OrderService.markOrderAsReadyToWithdraw(orderId, withdrawData, departmentNumber);

        if (error) return respondError(req, res, 400, error);

        respondSuccess(req, res, 200, "La orden está lista para ser retirada.");
    } catch (error) {
        handleError(error, "order.controller -> markOrderAsReadyToWithdraw");
        respondError(req, res, 500, error.message);
    }
}


/**
 * Retira múltiples entregas, actualizando su estado y hora de retiro.
 * Está pensada para ser utilizada por el conserje.
 */
async function withdrawOrders(req, res) {
    try {
        const orderIds = req.body.orderIds;
        const withdrawData = {
            withdrawnPersonFirstName: req.body.withdrawnPersonFirstName,
            withdrawnPersonLastName: req.body.withdrawnPersonLastName
        };

        console.log("controller firstname: "+withdrawData.withdrawnPersonFirstName);
        console.log("controller lastname: "+withdrawData.withdrawnPersonLastName);
        const [success, error] = await OrderService.withdrawOrders(orderIds, withdrawData);

        if (error) return respondError(req, res, 400, error);

        respondSuccess(req, res, 200, "Retiro de entregas registrado correctamente");
    } catch (error) {
        handleError(error, "order.controller -> withdrawOrders");
        respondError(req, res, 500, error.message);
    }
}

export default {
    getOrders,
    getOrderById,
    getOwnedOrders,
    getOrdersByDepartmentNumber,
    createOrder,
    updateOrder,
    deleteOrder,
    markOrderAsReadyToWithdraw,
    withdrawOrders
};
