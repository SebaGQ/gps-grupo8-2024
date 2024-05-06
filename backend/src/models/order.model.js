"use strict";
// Importaciones necesarias
import mongoose from "mongoose";
import ORDER_STATUSES from "../constants/orderstatus.constants.js";


// Esquema de la colección 'orders'
const orderSchema = new mongoose.Schema({
    //Departamento destino
    departmentNumber: {
        type: Number,
        required: true
    },
    //Id del conserje que registra llegada de paquete
    janitorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    //Nombre y apellido del destinatario del paquete
    recipientFirstName: {
        type: String,
        required: true,
    },
    recipientLastName: {
        type: String,
        required: true
    },
    //Hora a la que llegó la entrega
    deliveryTime: {
        type: Date,
        required: true
    },
    //Hora a la que fue retirado
    withdrawnTime: {
        type: Date,
        required: false 
    },
    //Id en caso que un residente haga el retiro
    withdrawnResidentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    //Nombre y apellido de un tercero que está intentando retirar el pedido
    withdrawnPersonFirstName: {
        type: String,
        required: false
    },
    withdrawnPersonLastName: {
        type: String,
        required: false
    },
    // Nombre del tercero que retirará el pedido
    expectedWithdrawnPersonFirstName: {
        type: String,
        required: false
    },
    expectedWithdrawnPersonLastName: {
        type: String,
        required: false
    },
    //Nombre del repartidor que entregó el pedido
    deliveryPersonName: {
        type: String,
        required: false //El nombre podría ser nulo en caso que no se le indique al conserje
    },
    //Estado del pedido
    status: {
      type: String,
      enum: ORDER_STATUSES,
      required: false
  },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false // Para deshabilitar la propiedad __v en los documentos.
});

// Modelo 'Order'
const Order = mongoose.model("Order", orderSchema);

// Exportación del modelo 'Order'
export default Order;