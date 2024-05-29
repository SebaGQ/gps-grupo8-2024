"use strict";
// Importaciones necesarias
import mongoose from "mongoose";
import CATEGORIES from "../constants/binnaclecategories.constats.js";

// Esquema de la colección 'binnacles'
const binnacleSchema = new mongoose.Schema({
    // Id del conserje que realiza la acción
    janitorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // Tipo de actividad
    activityType: {
        type: String,
        enum: CATEGORIES,
        required: true
    },
    //Nombre y apellido del visitante
    visitorName: {
        type: String,
        required: false
    },
    visitorLastName: {
        type: String,
        required: false
    },
    //Número del departamento visitado
    apartmentVisited: {
        type: Number,
        required: false
    },
    //Hora de entrada
    timeEntered: {
        type: Date,
        required: false
    },
    //Hora de salida
    timeExited: {
        type: Date,
        required: false
    },
    //Nombre del espacio comunitario
    spaceName: {
        type: String,
        required: false
    },
    //Hora de inicio de uso
    usageStartTime: {
        type: Date,
        required: false
    },
    //Hora de fin de uso
    usageEndTime: {
        type: Date,
        required: false
    },
    
}, {
    versionKey: false // Para deshabilitar la propiedad __v en los documentos.
});

// Modelo 'Binnacle'
const Binnacle = mongoose.model("Binnacle", binnacleSchema);

// Exportación del modelo 'Binnacle'
export default Binnacle;