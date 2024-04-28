"use strict";
// Importaciones necesarias
import mongoose from "mongoose";
import ORDER_STATUSES from "../constants/orderstatus.constants.js";


// Esquema de la colección 'orders'
const orderSchema = new mongoose.Schema({
    departmentNumber: {
        type: Number,
        required: true
    },
    janitorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    recipientFirstName: {
        type: String,
        required: true,
        
    },
    recipientLastName: {
        type: String,
        required: true
    },
    deliveryTime: {
        type: Date,
        required: true
    },
    withdrawnTime: {
        type: Date,
        required: false 
    },
    withdrawnResidentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    withdrawnPersonFirstName: {
        type: String,
        required: false
    },
    withdrawnPersonLastName: {
        type: String,
        required: false
    },
    deliveryPersonName: {
        type: String,
        required: false //El nombre podría ser nulo en caso que no se le indique al conserje
    },
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
