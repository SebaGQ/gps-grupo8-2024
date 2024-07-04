// routes/imageFile.routes.js
import express from "express";
import ImageFileController from "../controllers/imageFile.controller.js";

const router = express.Router();

router.post("/", ImageFileController.uploadImage);
router.get("/:id", ImageFileController.getImageById);
router.put("/:id", ImageFileController.updateImage);
router.delete("/:id", ImageFileController.deleteImage);

export default router;
