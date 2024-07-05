"use strict";
import ImageFile from "../models/ImageFile.model.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Añade una nueva imagen.
 */
async function addImage(imageData) {
    try {
        const { name, imageData: base64Data } = imageData;
        const image = new ImageFile({
            name,
            imageData: base64Data,
        });
        await image.save();
        return [image, null];
    } catch (error) {
        handleError(error, "imageFile.service -> addImage");
        return [null, error.message];
    }
}

/**
 * Obtiene una imagen por ID.
 */
async function getImageById(id) {
    try {
        const image = await ImageFile.findById(id).exec();
        if (!image) return [null, "No se encontró la imagen"];
        return [image, null];
    } catch (error) {
        handleError(error, "imageFile.service -> getImageById");
        return [null, error.message];
    }
}

/**
 * Actualiza una imagen existente.
 */
async function updateImage(id, imageData) {
    try {
        const updatedImage = await ImageFile.findByIdAndUpdate(id, imageData, { new: true }).exec();
        if (!updatedImage) return [null, "No se encontró la imagen para actualizar"];
        return [updatedImage, null];
    } catch (error) {
        handleError(error, "imageFile.service -> updateImage");
        return [null, error.message];
    }
}

/**
 * Elimina una imagen.
 */
async function deleteImage(id) {
    try {
        const deletedImage = await ImageFile.findByIdAndDelete(id).exec();
        if (!deletedImage) return [null, "No se encontró la imagen para eliminar"];
        return [deletedImage, null];
    } catch (error) {
        handleError(error, "imageFile.service -> deleteImage");
        return [null, error.message];
    }
}

export default {
    addImage,
    getImageById,
    updateImage,
    deleteImage,
};
