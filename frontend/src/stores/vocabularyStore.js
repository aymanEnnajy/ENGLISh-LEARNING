import { create } from 'zustand';
import api from '../services/api';

export const useVocabularyStore = create((set, get) => ({
  words: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  search: '',
  stats: null,

  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),

  fetchWords: async () => {
    const { page, search } = get();
    set({ loading: true });
    try {
      const { data } = await api.get('/words', { params: { page, search, limit: 10 } });
      set({
        words: data.words,
        total: data.total,
        totalPages: data.totalPages,
        loading: false,
      });
      // Also fetch stats whenever words are fetched to keep them in sync
      get().fetchStats();
    } catch (err) {
      console.error('Failed to fetch words:', err.response?.data?.error || err.message);
      set({ loading: false });
      throw err;
    }
  },

  fetchStats: async () => {
    try {
      const { data } = await api.get('/stats');
      set({ stats: data });
    } catch (err) {
      console.error('Failed to fetch stats:', err.response?.data?.error || err.message);
    }
  },

  addWord: async (wordData) => {
    const tempId = `temp-${Date.now()}`;
    const newWord = { ...wordData, id: tempId, created_at: new Date().toISOString() };
    
    // Optimistic update
    const previousWords = get().words;
    const previousTotal = get().total;
    
    // Only show optimistically if we are on page 1 and no search
    const { page, search } = get();
    if (page === 1 && !search) {
      set((state) => ({
        words: [newWord, ...state.words].slice(0, 10),
        total: state.total + 1,
      }));
    } else {
      set((state) => ({ total: state.total + 1 }));
    }

    try {
      const { data } = await api.post('/words', wordData);
      
      // If we are on page 1, replace temp word. If not, reset to page 1 and refetch
      if (get().page === 1 && !get().search) {
        set((state) => ({
          words: state.words.map(w => w.id === tempId ? data.word : w)
        }));
      } else {
        set({ page: 1, search: '' });
        await get().fetchWords();
      }
      
      // Always refresh stats after successful add
      await get().fetchStats();
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
      // Refetch to fill the gap and refresh stats
      await get().fetchWords();
      await get().fetchStats();
    } catch (err) {
      // Rollback
      set({ words: previousWords, total: previousTotal });
      throw err;
    }
  },
}));
