"use strict";
import mongoose from "mongoose";

const commonSpaceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['parking', 'barbecue']
    },
    capacity: {
        type: Number,
        required: false
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    },
    location: {
        type: String,
        required: true
    },
    openingHour: {
        type: String,
        required: true
    },
    closingHour: {
        type: String,
        required: true
    },
    allowedDays: {
        type: [String], // Lista de días permitidos para reservar, especialmente útil para el quincho
        required: function() { return this.type === 'barbecue'; } // Solo requerido para 'barbecue'
    }
}, {
    timestamps: true,
    versionKey: false
});

const CommonSpace = mongoose.model("CommonSpace", commonSpaceSchema);

export default CommonSpace;
