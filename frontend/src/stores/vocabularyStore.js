import { create } from 'zustand';
import api from '../services/api';

export const useVocabularyStore = create((set, get) => ({
  words: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  search: '',

  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),

  fetchWords: async () => {
    const { page, search } = get();
    console.log(`Fetching words (page: ${page}, search: "${search}")...`);
    set({ loading: true });
    try {
      const { data } = await api.get('/words', { params: { page, search, limit: 10 } });
      console.log('Words fetched successfully:', data.words.length, 'items found.');
      set({
        words: data.words,
        total: data.total,
        totalPages: data.totalPages,
        loading: false,
      });
    } catch (err) {
      console.error('Failed to fetch words:', err.response?.data?.error || err.message);
      set({ loading: false });
      throw err;
    }
  },

  addWord: async (wordData) => {
    const tempId = `temp-${Date.now()}`;
    const newWord = { ...wordData, id: tempId, created_at: new Date().toISOString() };
    
    // Optimistic update
    const previousWords = get().words;
    const previousTotal = get().total;
    
    set((state) => ({
      words: [newWord, ...state.words].slice(0, 10), // Keep it within limit
      total: state.total + 1,
    }));

    try {
      const { data } = await api.post('/words', wordData);
      // Replace temp word with actual data
      set((state) => ({
        words: state.words.map(w => w.id === tempId ? data.word : w)
      }));
      return data.word;
    } catch (err) {
      // Rollback
      set({ words: previousWords, total: previousTotal });
      throw err;
    }
  },

  updateWord: async (id, wordData) => {
    const previousWords = get().words;
    
    // Optimistic update
    set((state) => ({
      words: state.words.map(w => w.id === id ? { ...w, ...wordData } : w)
    }));

    try {
      const { data } = await api.put(`/words/${id}`, wordData);
      // Ensure state is synced with server data (e.g. if server modified something)
      set((state) => ({
        words: state.words.map(w => w.id === id ? data.word : w)
      }));
      return data.word;
    } catch (err) {
      // Rollback
      set({ words: previousWords });
      throw err;
    }
  },

  deleteWord: async (id) => {
    const previousWords = get().words;
    const previousTotal = get().total;

    // Optimistic update
    set((state) => ({
      words: state.words.filter(w => w.id !== id),
      total: state.total - 1
    }));

    try {
      await api.delete(`/words/${id}`);
      // If we're now on an empty page but there are more items, refetch
      if (get().words.length === 0 && get().total > 0) {
        await get().fetchWords();
      }
    } catch (err) {
      // Rollback
      set({ words: previousWords, total: previousTotal });
      throw err;
    }
  },
}));
