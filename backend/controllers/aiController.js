import { generateMCQ, generateSentence } from '../services/ai.js';

// POST /ai/generate-mcq
export async function generateMCQHandler(req, res) {
  const { word, meaning } = req.body;

  if (!word || !meaning) {
    return res.status(400).json({ error: 'word and meaning are required' });
  }

  try {
    const result = await generateMCQ(word, meaning);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate MCQ options' });
  }
}

// POST /ai/generate-sentence
export async function generateSentenceHandler(req, res) {
  const { word, meaning } = req.body;

  if (!word || !meaning) {
    return res.status(400).json({ error: 'word and meaning are required' });
  }

  try {
    const result = await generateSentence(word, meaning);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate AI sentence' });
  }
}
