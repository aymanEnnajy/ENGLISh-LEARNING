import { generateMCQ, generateSentence, generateVocabDetails } from '../services/ai.js';

// POST /ai/generate-mcq
export async function generateMCQHandler(req, res) {
  const { word, meaning } = req.body;
  const userId = req.user.id;

  if (!word || !meaning) {
    return res.status(400).json({ error: 'word and meaning are required' });
  }

  let result;
  try {
    result = await generateMCQ(word, meaning);
    
    // Check if the result is the hardcoded fallback ['Option B', 'Option C', 'Option D']
    const hasPlaceholders = result.options.some(opt => 
      opt === 'Option B' || opt === 'Option C' || opt === 'Option D'
    );

    if (!hasPlaceholders) {
      return res.json(result);
    }
    
    console.log('AI returned placeholders, fetching distractors from database...');
  } catch (err) {
    console.error('AI generateMCQ failed:', err.message);
  }

  // Fallback: Fetch random words from the user's own vocabulary
  try {
    const { data: distractorsData, error } = await req.supabase
      .from('vocabulary')
      .select('word')
      .eq('user_id', userId)
      .neq('word', word) // Don't pick the correct word
      .limit(10); // Get a small pool to pick from randomly

    if (error) throw error;

    let distractors = [];
    if (distractorsData && distractorsData.length > 0) {
      // Pick 3 random words from the pool
      distractors = distractorsData
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(d => d.word);
    }

    // Fill up if we don't have enough words
    const standardFallbacks = ['Apple', 'Book', 'Computer', 'Distance', 'Elegance', 'Freedom'];
    while (distractors.length < 3) {
      const fallback = standardFallbacks[Math.floor(Math.random() * standardFallbacks.length)];
      if (!distractors.includes(fallback) && fallback !== word) {
        distractors.push(fallback);
      }
    }

    const allOptions = [word, ...distractors].sort(() => Math.random() - 0.5);

    return res.json({
      correct: word,
      options: allOptions
    });
  } catch (dbErr) {
    console.error('Database fallback failed:', dbErr.message);
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

// POST /ai/generate-vocab-details
export async function generateVocabDetailsHandler(req, res) {
  const { word } = req.body;

  if (!word) {
    return res.status(400).json({ error: 'word is required' });
  }

  try {
    const result = await generateVocabDetails(word);
    return res.json(result);
  } catch (err) {
    console.error('generateVocabDetailsHandler ERROR:', err);
    return res.status(500).json({ error: `Failed to generate vocabulary details: ${err.message}` });
  }
}
