"use strict";
// Importaciones necesarias
import mongoose from "mongoose";

// Esquema de la colección 'departments'
const departmentSchema = new mongoose.Schema({
    departmentNumber: {
        type: Number,
        required: true
    },
    residentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false  //El departamento puede no tener usuario asociado al momento de registrarse
    }
}, {
    versionKey: false // Para deshabilitar la propiedad __v en los documentos.
});

// Modelo 'Department'
const Department = mongoose.model("Department", departmentSchema);

// Exportación del modelo 'Department'
export default Department;
