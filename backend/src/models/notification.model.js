"use strict";

// Importaciones necesarias
import mongoose from "mongoose";

// Esquema de la colección 'notifications'
const notificationSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        required: true,
        default: false // Cuando se crea una notificación no ha sido vista aún
    },
    departmentNumber: {
        type: Number,
        required: true
    },
    //TODO: Path al que redireccionará la notificación al hacer clic en el front
    link: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false // Para deshabilitar la propiedad __v en los documentos.
});

// Modelo 'Notification'
const Notification = mongoose.model("Notification", notificationSchema);

// Exportación del modelo 'Notification'
export default Notification;
