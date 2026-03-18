// Removed global supabase import to use req.supabase from middleware

// GET /words
export async function getWords(req, res) {
  const userId = req.user.id;
  const { search = '', page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    console.log('--- GET WORDS TRACE ---');
    console.log('User:', userId);
    console.log('Query:', { search, page, limit, offset });

    let query = req.supabase
      .from('vocabulary')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (search) {
      query = query.or(`word.ilike.%${search}%,meaning_ar.ilike.%${search}%,meaning_fr.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error('getWords Error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log('Found words:', data?.length || 0, 'Total:', count);
    
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.json({
      words: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (err) {
    console.error('getWords Critical Error:', err);
    return res.status(500).json({ error: 'Failed to fetch words' });
  }
}

// POST /words
export async function createWord(req, res) {
  const userId = req.user.id;
  const { word, meaning_ar, meaning_fr, example_sentence } = req.body;

  if (!word) return res.status(400).json({ error: 'Word is required' });

  try {
    const { data, error } = await req.supabase
      .from('vocabulary')
      .insert([{ user_id: userId, word, meaning_ar, meaning_fr, example_sentence }])
      .select()
      .single();

    if (error) {
      console.error('Supabase createWord error:', error.message);
      return res.status(400).json({ error: error.message });
    }
    console.log('Word created successfully:', data.word);
    return res.status(201).json({ word: data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create word' });
  }
}

// PUT /words/:id
export async function updateWord(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { word, meaning_ar, meaning_fr, example_sentence } = req.body;

  try {
    // Verify ownership first
    const { data: existing } = await req.supabase
      .from('vocabulary')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existing) return res.status(404).json({ error: 'Word not found' });

    const { data, error } = await req.supabase
      .from('vocabulary')
      .update({ word, meaning_ar, meaning_fr, example_sentence })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ word: data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update word' });
  }
}

// DELETE /words/:id
export async function deleteWord(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const { data: existing } = await req.supabase
      .from('vocabulary')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existing) return res.status(404).json({ error: 'Word not found' });

    const { error } = await req.supabase
      .from('vocabulary')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ message: 'Word deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete word' });
  }
}

// GET /test/random-word
export async function getRandomWord(req, res) {
  const userId = req.user.id;

  try {
    console.log('--- GET RANDOM WORD TRACE ---');
    console.log('User:', userId);

    // Get words that are due for review or have never been reviewed
    const now = new Date().toISOString();
    const { data: dueWords, error } = await req.supabase
      .from('vocabulary')
      .select('*')
      .eq('user_id', userId)
      .or(`next_review_at.lte.${now},next_review_at.is.null`);

    if (error) {
      console.error('getRandomWord Error:', error.message);
      return res.status(400).json({ error: error.message });
    }
    
    // Fallback: If no words are due, just pick any random word to keep the user engaged
    let allWords = dueWords;
    if (!allWords || allWords.length === 0) {
      const { data: fallbackWords } = await req.supabase
        .from('vocabulary')
        .select('*')
        .eq('user_id', userId);
      
      allWords = fallbackWords;
    }

    if (!allWords || allWords.length === 0) {
      return res.status(404).json({ error: 'No vocabulary words found. Please add some words first.' });
    }

    const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.json({ word: randomWord });
  } catch (err) {
    console.error('getRandomWord Critical Error:', err);
    return res.status(500).json({ error: 'Failed to fetch test word' });
  }
}
