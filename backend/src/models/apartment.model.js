"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
import { Schema, model } from "mongoose";

// Crea el esquema de la coleccion 'roles'
const ApartmentSchema = new Schema(
    {
        number: {
            type: Number,
            required: true,
        },
        RutOwner: {
            type: String,
            required: true,
        },
        resident: {
            type: String,
            ref: 'Residente.rut'
        }
    },
    {
        versionKey: false,
    },
);

// Crea el modelo de datos 'Role' a partir del esquema 'roleSchema'
const Apartment = model("Apartment", ApartmentSchema);

export default Apartment;