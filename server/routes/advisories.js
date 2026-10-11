import { Router } from 'express';
import { getAdvisories, getAdvisoryById } from '../controllers/advisoriesController.js';

const router = Router();

router.get('/', getAdvisories);
router.get('/:id', getAdvisoryById);

export default router;
