import { create } from 'zustand';
import api from '../services/api';

export const useTestStore = create((set, get) => ({
  mode: null, // 'write' | 'mcq'
  currentWord: null,
  mcqOptions: [],
  correctAnswers: 0,
  wrongAnswers: 0,
  totalQuestions: 0,
  feedback: null, // 'correct' | 'incorrect' | null
  isFinished: false,
  loading: false,

  setMode: (mode) => set({ mode }),

  startTest: async () => {
    set({
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestions: 0,
      isFinished: false,
      feedback: null,
      currentWord: null,
      mcqOptions: [],
    });
    await get().nextQuestion();
  },

  nextQuestion: async () => {
    set({ loading: true, feedback: null });
    try {
      const { data } = await api.get('/words/random');
      const word = data.word;

      if (get().mode === 'mcq') {
        const meaning = word.meaning_ar || word.meaning_fr || word.word;
        try {
          const { data: mcqData } = await api.post('/ai/generate-mcq', {
            word: word.word,
            meaning: meaning,
          });
          set({ currentWord: word, mcqOptions: mcqData.options, loading: false });
        } catch {
          // Fallback if AI fails
          set({ currentWord: word, mcqOptions: [word.word, 'option2', 'option3', 'option4'], loading: false });
        }
      } else {
        set({ currentWord: word, mcqOptions: [], loading: false });
      }
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  submitAnswer: async (answer) => {
    const { currentWord, correctAnswers, wrongAnswers, totalQuestions, mode } = get();
    if (!currentWord) return;

    const isCorrect = answer.trim().toLowerCase() === currentWord.word.trim().toLowerCase();
    const feedback = isCorrect ? 'correct' : 'incorrect';

    // Save test result
    try {
      await api.post('/stats/result', {
        word_id: currentWord.id,
        is_correct: isCorrect,
        test_type: mode,
      });
    } catch (e) {
      // Non-blocking — don't fail the test
    }

    set({
      feedback,
      correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
      wrongAnswers: isCorrect ? wrongAnswers : wrongAnswers + 1,
      totalQuestions: totalQuestions + 1,
    });

    return isCorrect;
  },

  finishTest: () => set({ isFinished: true }),
  resetTest: () => set({
    mode: null,
    currentWord: null,
    mcqOptions: [],
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 0,
    feedback: null,
    isFinished: false,
  }),
}));
