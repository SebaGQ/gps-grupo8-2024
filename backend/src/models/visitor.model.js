"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
import { Schema, model, mongoose } from "mongoose";

// Crea el esquema de la coleccion 'roles'
const VisitorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        rut: {
            type: String,
            required: true,
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
                default: "visitor"
            },
        ],
        departmentNumber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },
        entryDate: {
            type: Date,
            default: Date.now
        },
        exitDate: {
            type: Date,
            default: new Date("9999-12-31")
        }
    },
    {
        versionKey: false,
    },
);

// Crea el modelo de datos 'Role' a partir del esquema 'roleSchema'
const Visitor = model("Visitor", VisitorSchema);

export default Visitor;