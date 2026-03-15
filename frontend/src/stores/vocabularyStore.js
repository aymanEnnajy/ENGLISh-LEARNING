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
    const { data } = await api.post('/words', wordData);
    // Reset to first page and refetch
    set({ page: 1 });
    await get().fetchWords();
    return data.word;
  },

  updateWord: async (id, wordData) => {
    const { data } = await api.put(`/words/${id}`, wordData);
    await get().fetchWords();
    return data.word;
  },

  deleteWord: async (id) => {
    await api.delete(`/words/${id}`);
    await get().fetchWords();
  },
}));
