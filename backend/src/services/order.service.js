"use strict";
import User from "../models/user.model.js";
import Department from "../models/department.model.js";
import Order from "../models/order.model.js";
import Notification from "../models/notification.model.js";

import NotificationService from "../services/notification.service.js";

import { handleError } from "../utils/errorHandler.js";
import ORDER_STATUSES from "../constants/orderstatus.constants.js";

/**
 * Obtiene todas las entregas de la base de datos
 */
async function getOrders() {
    try {
        const orders = await Order.find().exec();
        if (!orders) return [null, "No hay entregas disponibles"];

        return [orders, null];
    } catch (error) {
        handleError(error, "order.service -> getOrders");
        return [null, error.message];
    }
}

async function getOrderById(id) {
  try {
      const order = await Order.findById(id).exec();
      if (!order) return [null, "No se encontró la orden"];

      return [order, null];
  } catch (error) {
      handleError(error, "order.service -> getOrderById");
      return [null, error.message];
  }
}

/**
 * Obtiene todas las entregas por departmentNumber.
 * @param {Number} departmentNumber El número de departamento para filtrar las entregas.
 */
async function getOwnedOrders(departmentNumber) {
  try {
      const orders = await Order.find({ departmentNumber: departmentNumber }).exec();
      if (!orders || orders.length === 0) return [null, "No hay entregas disponibles para este departamento"];

      return [orders, null];
  } catch (error) {
      handleError(error, "order.service -> getOwnedOrders");
      return [null, error.message];
  }
}

/**
 * Obtiene todas las entregas para un departmentNumber específico.
 * @param {Number} departmentNumber El número de departamento para filtrar las entregas.
 */
async function getOrdersByDepartmentNumber(departmentNumber) {
  try {
      const orders = await Order.find({ departmentNumber }).exec();
      if (!orders || orders.length === 0) return [null, "No hay entregas disponibles para este departamento"];

      return [orders, null];
  } catch (error) {
      handleError(error, "order.service -> getOrdersByDepartmentNumber");
      return [null, error.message];
  }
}

/**
 * Crea una nueva orden en la base de datos
 * @param {Object} orderData Datos de la nueva orden
 */
async function createOrder(req) {
    try {
        let email = req.email;
        let orderData = req.body;

        // Se valida el usuario
        let user = await User.findOne({ email: email });
        if (!user) {
            return [null, "No se reconoce al conserje que está haciendo la solicitud"];
        }

        // Se valida el departamento
        let department = await Department.findOne({ departmentNumber: orderData.departmentNumber });
        if (!department) {
          return [null, "No se encontró el departamento indicado"];
        }
        
        let newOrder = new Order({ ...orderData});
        newOrder.janitorId = user._id; //Se asigna el id del usuario que está haciendo la solicitud (Conserje)
        newOrder.status = ORDER_STATUSES[0]; //Se establece como 'Pendiente'
        
        await newOrder.save(); 
        //Aquí ya se guardó correctamente el pedido, se procede a generar la notificación.
        
        const notificationDescription = `Ha llegado a conserjería un pedido a nombre de ${orderData.recipientFirstName}.`;
        const [notification, notificationError] = await NotificationService.createNotificationForDepartment(notificationDescription, orderData.departmentNumber);
        if (notificationError) {
            return [null, notificationError];
        }

        return [newOrder, null];

    } catch (error) {
        handleError(error, "order.service -> createOrder");
        return [null, error.message];
    }
}

/**
 * Actualiza una orden existente en la base de datos por su ID
 * @param {String} id ID de la orden a actualizar
 * @param {Object} orderData Datos nuevos para la orden
 */
async function updateOrder(id, orderData) {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, orderData, { new: true }).exec();
        if (!updatedOrder) return [null, "No se encontró la orden para actualizar"];

        return [updatedOrder, null];
    } catch (error) {
        handleError(error, "order.service -> updateOrder");
        return [null, error.message];
    }
}

/**
 * Elimina una orden de la base de datos por su ID
 * @param {String} id ID de la orden a eliminar
 */
async function deleteOrder(id) {
    try {
        const deletedOrder = await Order.findByIdAndDelete(id).exec();
        if (!deletedOrder) return [null, "No se encontró la orden para eliminar"];

        return [deletedOrder, null];
    } catch (error) {
        handleError(error, "order.service -> deleteOrder");
        return [null, error.message];
    }
}

async function markOrderAsReadyToWithdraw(orderId, withdrawData, departmentNumber) {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return [null, "Orden no encontrada"];
        }

        if (order.departmentNumber !== departmentNumber) {
            return [null, "La orden no pertenece al departamento del solicitante"];
        }

        if (order.status !== ORDER_STATUSES[0]) {
            return [null, "La orden no está en estado pendiente"];
        }

        const updateData = {
            status: ORDER_STATUSES[2], // Se marca como listo para retirar
        };

        if (withdrawData.residentId) {
            updateData.withdrawnResidentId = withdrawData.residentId;
        } else {
            updateData.withdrawnPersonFirstName = withdrawData.firstName;
            updateData.withdrawnPersonLastName = withdrawData.lastName;
        }

        await order.updateOne(updateData);

        return [true, null];
    } catch (error) {
        handleError(error, "order.service -> markOrderAsReadyToWithdraw");
        return [null, error.message];
    }
}

/**
 * Retira una lista de entregas
 * @param {Array} orderIds Lista de IDs de las entregas a retirar.
 */
async function withdrawOrders(orderIds, withdrawData) {
    try {
        const orders = await Order.find({ _id: { $in: orderIds } });
        if (!orders || orders.length !== orderIds.length) {
            return [null, "No se encontraron todas las entregas especificadas."];
        }

        const departmentNumber = orders[0].departmentNumber;
        if (!orders.every(order => order.departmentNumber === departmentNumber)) {
            return [null, "Las entregas especificadas no pertenecen a su departamento."];
        }

        if (!orders.every(order => order.status === ORDER_STATUSES[1])) {
            return [null, "El paquete no se encuentra listo para ser retirado. Por favor, marque las entregas como listas para retirar."];
        }

        await Order.updateMany(
            { _id: { $in: orderIds } },
            { $set: { 
                status: ORDER_STATUSES[2], 
                withdrawnTime: new Date(),
                withdrawnPersonFirstName: withdrawData.firstName,
                withdrawnPersonLastName: withdrawData.lastName
            } }
        );

        const notificationDescription = `Su pedido ha sido retirado por ${withdrawData.firstName} ${withdrawData.lastName}.`;
        const [notification, notificationError] = await NotificationService.createNotificationForDepartment(notificationDescription, departmentNumber);
        if (notificationError) {
            return [null, notificationError];
        }

        return [true, null];
    } catch (error) {
        handleError(error, "order.service -> withdrawOrders");
        return [null, error.message];
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
