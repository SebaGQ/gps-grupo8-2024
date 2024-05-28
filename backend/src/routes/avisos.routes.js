
import { Router } from 'express';
import { createAviso, deleteAviso, getAvisos, getAvisoById, updateAviso } from '../controllers/avisos.controller.js';

const router = Router();

// Crear un nuevo aviso
router.post('/', createAviso);

// Obtener todos los avisos
router.get('/', getAvisos);

// Obtener un aviso por su ID
router.get('/:id', getAvisoById);

// Actualizar un aviso por su ID
router.put('/:id', updateAviso);

// Eliminar un aviso por su ID
router.delete('/:id', deleteAviso);

export default router;