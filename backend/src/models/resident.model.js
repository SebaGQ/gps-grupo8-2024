"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
import { Schema, model } from "mongoose";

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
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
                default: "user"
            },
        ],
    },
    {
        versionKey: false,
    },
);

// Crea el modelo de datos 'Role' a partir del esquema 'roleSchema'
const Visitor = model("Visitor", VisitorSchema);

export default Visitor;