"use strict";
import mongoose from "mongoose";
import CATEGORIES from "../constants/binnaclecategories.constants.js";

const binnacleSchema = new mongoose.Schema({
    janitorID: {
        type: String,
        required: true,
        ref: "Janitor"
    },
    activityType: {
        type: String,
        enum: CATEGORIES,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
});

const Binnacle = mongoose.model("Binnacle", binnacleSchema);

export default Binnacle;
