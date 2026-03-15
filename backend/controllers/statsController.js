// Removed global supabase import to use req.supabase from middleware

// POST /test/result - Save a test result
export async function saveTestResult(req, res) {
  const userId = req.user.id;
  const { word_id, is_correct, test_type } = req.body;

  if (!word_id || is_correct === undefined || !test_type) {
    return res.status(400).json({ error: 'word_id, is_correct, and test_type are required' });
  }

  try {
    // 1. Save the test result for stats
    const { data: resultData, error: insertError } = await req.supabase
      .from('test_results')
      .insert([{ user_id: userId, word_id, is_correct, test_type }])
      .select()
      .single();

    if (insertError) return res.status(400).json({ error: insertError.message });

    // 2. Schedule the next review based on logic:
    // If correct: Now + 15 days
    // If wrong: Now + 1 day
    const nextReview = new Date();
    if (is_correct) {
      nextReview.setDate(nextReview.getDate() + 15);
    } else {
      nextReview.setDate(nextReview.getDate() + 1);
    }

    const { error: updateError } = await req.supabase
      .from('vocabulary')
      .update({ next_review_at: nextReview.toISOString() })
      .eq('id', word_id)
      .eq('user_id', userId);

    if (updateError) console.error('SRS Update Error:', updateError.message);

    return res.status(201).json({ result: resultData });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process test result' });
  }
}

// GET /stats - Return aggregated stats
export async function getStats(req, res) {
  const userId = req.user.id;
  try {
    console.log('--- STATS TRACE START ---');
    console.log('Fetching stats for user:', userId);

    // Total words
    const { count: totalWords, error: wordsError } = await req.supabase
      .from('vocabulary')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (wordsError) console.error('Words Fetch Error:', wordsError.message);
    console.log('Total words found:', totalWords);

    // All test results
    const { data: results, error: resultsError } = await req.supabase
      .from('test_results')
      .select('is_correct, word_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (resultsError) console.error('Results Fetch Error:', resultsError.message);
    console.log('Test results found:', results?.length || 0);

    const correctAnswers = results?.filter(r => r.is_correct).length || 0;
    const wrongAnswers = results?.filter(r => !r.is_correct).length || 0;

    // Words with at least 1 correct answer = "mastered"
    const masteredWordIds = new Set(
      results?.filter(r => r.is_correct).map(r => r.word_id) || []
    );

    // Daily streak: count consecutive days with test activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    const activityDays = new Set(
      results?.map(r => new Date(r.created_at).toDateString()) || []
    );
    for (let i = 0; i < 365; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      if (activityDays.has(day.toDateString())) {
        streak++;
      } else {
        break;
      }
    }

    // Daily activity for the last 7 days
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dayStr = day.toDateString();
      const dayResults = results?.filter(r => new Date(r.created_at).toDateString() === dayStr) || [];
      dailyActivity.push({
        date: day.toISOString().split('T')[0],
        total: dayResults.length,
        correct: dayResults.filter(r => r.is_correct).length,
      });
    }

    const accuracyRate = results?.length > 0 
      ? Math.round((correctAnswers / results.length) * 100) 
      : 0;

    // Words due for review (SRS)
    let wordsDue = 0;
    try {
      const now = new Date().toISOString();
      const { count: dueCount, error: dueError } = await req.supabase
        .from('vocabulary')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .or(`next_review_at.lte.${now},next_review_at.is.null`);
      
      if (dueError) {
        console.error('SRS Query Error:', dueError.message);
      } else {
        wordsDue = dueCount || 0;
      }
    } catch (srsErr) {
      console.error('Failed to fetch wordsDue:', srsErr.message);
    }

    const responseData = {
      total_words: totalWords || 0,
      words_due: wordsDue,
      mastered: masteredWordIds.size,
      accuracy_rate: accuracyRate,
      correct_answers: correctAnswers,
      wrong_answers: wrongAnswers,
      total_tests: (results?.length) || 0,
      streak,
      activity_data: dailyActivity.map(day => ({
        name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: day.total
      })),
    };

    console.log('Dashboard Data:', JSON.stringify(responseData));
    console.log('--- STATS TRACE END ---');
    return res.json(responseData);
  } catch (err) {
    console.error('CRITICAL Stats error:', err);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}
