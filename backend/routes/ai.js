import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { generateMCQHandler, generateSentenceHandler } from '../controllers/aiController.js';
import { aiLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/generate-mcq', requireAuth, aiLimiter, generateMCQHandler);
router.post('/generate-sentence', requireAuth, aiLimiter, generateSentenceHandler);

export default router;
