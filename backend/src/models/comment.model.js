"use strict";
import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    aviso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Aviso",
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Modelo 'Comment'
const Comment = mongoose.model("Comment", commentSchema);
// Exportación del modelo 'Comment'
export default Comment;
