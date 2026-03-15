import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getStats, saveTestResult } from '../controllers/statsController.js';

const router = Router();

router.use(requireAuth);

router.get('/', getStats);
router.post('/result', saveTestResult);

export default router;
