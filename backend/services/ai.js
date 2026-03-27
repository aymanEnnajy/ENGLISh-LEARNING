import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = process.env.AI_API_KEY;

/**
 * Generate MCQ options for a vocabulary word using Groq AI.
 * Returns: { correct, options: [string] }
 */
export async function generateMCQ(word, meaning) {
  if (!API_KEY) {
    console.error('Groq API Key is missing');
    return getFallbackOptions(word);
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a vocabulary quiz generator. Given a word and its meaning, generate 3 distractor words (wrong answers) that are plausible but incorrect. Return ONLY a valid JSON object: {"correct": "word", "distractors": ["wrong1", "wrong2", "wrong3"]}. No formatting, no extra text.'
          },
          {
            role: 'user',
            content: `Word: "${word}", Meaning: "${meaning}"`
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    
    const allOptions = [parsed.correct, ...parsed.distractors]
      .sort(() => Math.random() - 0.5);

    return {
      correct: parsed.correct,
      options: allOptions,
    };
  } catch (err) {
    console.error('Groq MCQ generation error:', err.message);
    return getFallbackOptions(word);
  }
}

/**
 * Generate a practice sentence for a vocabulary word using Groq AI.
 * Returns: { sentence }
 */
export async function generateSentence(word, meaning) {
  if (!API_KEY) {
    return { sentence: `Could you please define the word "${word}" in a short sentence?` };
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Using smaller model for speed
        messages: [
          {
            role: 'system',
            content: 'You are an English teacher. Given a word and its meaning, generate ONE short, simple, and natural practice sentence (max 10 words) using that word. Return ONLY the sentence text, no quotes, no extra text.'
          },
          {
            role: 'user',
            content: `Word: "${word}", Meaning: "${meaning}"`
          }
        ]
      })
    });

    if (!response.ok) throw new Error(`Groq API error: ${response.statusText}`);

    const data = await response.json();
    const sentence = data.choices[0].message.content.trim().replace(/^"|"$/g, '');

    return { sentence };
  } catch (err) {
    console.error('Groq Sentence generation error:', err.message);
    return { sentence: `I am currently studying the word "${word}".` };
  }
}

function getFallbackOptions(word) {
  return {
    correct: word,
    options: [word, 'Option B', 'Option C', 'Option D'].sort(() => Math.random() - 0.5),
  };
}

/**
 * Generate vocabulary details (Arabic, French meanings and example sentence) using Groq AI.
 */
export async function generateVocabDetails(word) {
  if (!API_KEY) {
    throw new Error('Groq API Key is missing');
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a vocabulary assistant. Given an English word, return a JSON object with: "meaning_ar" (its Arabic translation), "meaning_fr" (its French translation), and "example_sentence" (a short, simple English sentence using the word). Return ONLY a valid JSON object. No formatting, no extra text.'
          },
          {
            role: 'user',
            content: `Word: "${word}"`
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (err) {
    console.error('Groq Vocab Details generation error:', err.message);
    throw err;
  }
}
