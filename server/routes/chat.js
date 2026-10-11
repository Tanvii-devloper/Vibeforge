import { Router } from 'express';
import { handleChatMessage } from '../controllers/chatController.js';

const router = Router();

router.post('/', handleChatMessage);

export default router;
