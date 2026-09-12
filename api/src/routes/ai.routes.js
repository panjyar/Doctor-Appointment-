import { Router } from 'express';
import { createSummary } from '../controllers/ai.controller.js';

const router = Router();
router.post('/summary', createSummary);

export default router;
