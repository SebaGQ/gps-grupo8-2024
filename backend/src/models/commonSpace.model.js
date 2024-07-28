"use strict";
import mongoose from "mongoose";
import CommonSpaceConstants from "../constants/commonSpaces.constants.js";

const commonSpaceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: false,
    },
    availability: {
        type: Boolean,
        required: true,
        default: true,
    },
    location: {
        type: String,
        required: true,
    },
    openingHour: {
        type: String,
        required: true,
    },
    closingHour: {
        type: String,
        required: true,
    },
    allowedDays: {
        type: [String], 
        required: function() { 
            return this.type === "barbecue";
        }, // Solo requerido para 'barbecue'
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ImageFile",
        required: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});

const CommonSpace = mongoose.model("CommonSpace", commonSpaceSchema);

export default CommonSpace;
