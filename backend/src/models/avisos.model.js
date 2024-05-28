"use strict";
import mongoose from "mongoose";

const avisosSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: false //El aviso puede no tener comentarios
    }],
    reactions: {
        likes: {
            type: Number,
            default: 0
        },
        dislikes: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Modelo 'Aviso'
const Aviso = mongoose.model("Aviso", avisosSchema);
// Exportación del modelo 'Aviso'
export default Aviso;
