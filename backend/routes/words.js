import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getWords, createWord, updateWord, deleteWord, getRandomWord } from '../controllers/wordsController.js';

const router = Router();

router.use(requireAuth);

router.get('/', getWords);
router.post('/', createWord);
router.put('/:id', updateWord);
router.delete('/:id', deleteWord);

// Test route - random word for current user
router.get('/random', getRandomWord);

export default router;
