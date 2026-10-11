import { Router } from 'express';
import { getFields, createField, deleteField } from '../controllers/fieldsController.js';

const router = Router();

router.get('/', getFields);
router.post('/', createField);
router.delete('/:id', deleteField);

export default router;
