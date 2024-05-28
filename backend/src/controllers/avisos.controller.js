import Aviso from "../models/avisos.model.js";

// Crear un nuevo aviso
export const createAviso = async (req, res) => {
    try {
        const aviso = new Aviso(req.body);
        await aviso.save();
        res.status(201).json(aviso);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

// Obtener todos los avisos
export const getAvisos = async (req, res) => {
    try {
        const avisos = await Aviso.find().populate("author").populate("comments");
        res.status(200).json(avisos);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

// Obtener un aviso por su ID
export const getAvisoById = async (req, res) => {
    try {
        const { id } = req.params;
        const aviso = await Aviso.findById(req.params.id).populate("author").populate("comments");
        if (!aviso) return res.status(404).json({ message: "Aviso no encontrado" });
        res.status(200).json(aviso);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

// Actualizar un aviso por su ID
export const updateAviso = async (req, res) => {
    try {
        const aviso = await Aviso.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!aviso) return res.status(404).json({ message: "Aviso no encontrado" });
        res.status(200).json(aviso);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

// Eliminar un aviso por su ID
export const deleteAviso = async (req, res) => {
    try {
        const { id } = req.params;
        const aviso = await Aviso.findByIdAndDelete(id);
        if (!aviso) return res.status(404).json({ message: "Aviso no encontrado" });
        res.status(200).json({ message: "Aviso eliminado correctamente" });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}
