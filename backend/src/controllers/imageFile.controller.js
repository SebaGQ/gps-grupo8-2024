// controllers/imageFile.controller.js
"use strict";
import ImageFileService from "../services/imageFile.service.js";
import { handleError } from "../utils/errorHandler.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";

/**
 * Sube una nueva imagen.
 */
async function uploadImage(req, res) {
    try {
        const [image, errorImage] = await ImageFileService.addImage(req.body);
        if (errorImage) return respondError(req, res, 400, errorImage);

        respondSuccess(req, res, 201, image);
    } catch (error) {
        handleError(error, "imageFile.controller -> uploadImage");
        respondError(req, res, 500, error.message);
    }
}

/**
 * Obtiene una imagen por ID.
 */
async function getImageById(req, res) {
    try {
        const { params } = req;
        const [image, errorImage] = await ImageFileService.getImageById(params.id);

        if (errorImage) return respondError(req, res, 404, errorImage);
        if (!image) {
            return respondError(req, res, 404, "No se encontró la imagen");
        }

        respondSuccess(req, res, 200, image);
    } catch (error) {
        handleError(error, "imageFile.controller -> getImageById");
        respondError(req, res, 500, "No se pudo obtener la imagen");
    }
}

/**
 * Actualiza una imagen existente.
 */
async function updateImage(req, res) {
    try {
        const { params } = req;
        const [image, errorImage] = await ImageFileService.updateImage(params.id, req.body);

        if (errorImage) return respondError(req, res, 400, errorImage);
        if (!image) {
            return respondError(req, res, 404, "No se encontró la imagen");
        }

        respondSuccess(req, res, 200, image);
    } catch (error) {
        handleError(error, "imageFile.controller -> updateImage");
        respondError(req, res, 500, error.message);
    }
}

/**
 * Elimina una imagen.
 */
async function deleteImage(req, res) {
    try {
        const { params } = req;
        const [deletedImage, errorImage] = await ImageFileService.deleteImage(params.id);

        if (errorImage) return respondError(req, res, 400, errorImage);
        if (!deletedImage) {
            return respondError(req, res, 404, "No se encontró la imagen para eliminar");
        }

        respondSuccess(req, res, 200, deletedImage);
    } catch (error) {
        handleError(error, "imageFile.controller -> deleteImage");
        respondError(req, res, 500, error.message);
    }
}

export default {
    uploadImage,
    getImageById,
    updateImage,
    deleteImage,
};
