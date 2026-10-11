import { Router } from 'express';
import { getEpidemicAnalytics } from '../controllers/analyticsController.js';

const router = Router();

router.get('/epidemic', getEpidemicAnalytics);

export default router;
