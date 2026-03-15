import { useEffect, useState } from 'react';
import { useVocabularyStore } from '../stores/vocabularyStore';
import VocabCard from '../components/VocabCard';
import WordForm from '../components/WordForm';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Layout from '../components/Layout';
import { Plus, LayoutGrid, List, SlidersHorizontal, Info, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const { words, fetchWords, loading, search, setSearch, page, setPage, total, deleteWord, addWord, updateWord } = useVocabularyStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWord, setEditingWord] = useState(null);

  useEffect(() => {
    fetchWords();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      try {
        await deleteWord(id);
        toast.success('Word removed from library');
      } catch (err) {
        toast.error('Failed to delete word');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingWord) {
        await updateWord(editingWord.id, formData);
        toast.success('Word updated successfully');
      } else {
        await addWord(formData);
        toast.success('New word added');
      }
      setIsFormOpen(false);
      setEditingWord(null);
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (word) => {
    setEditingWord(word);
    setIsFormOpen(true);
  };

  return (
    <Layout>
      <div className="py-6 sm:py-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter uppercase mb-3">
              Lexicon <span className="text-muted-foreground">Library</span>
            </h1>
            <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
              <span className="bg-secondary px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-foreground">
                {total} Items
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Info size={14} className="text-zinc-400" />
                Showing 10 per page
              </span>
            </div>
          </div>

          <button
            onClick={() => { setEditingWord(null); setIsFormOpen(true); }}
            className="btn-monochrome flex items-center justify-center gap-2 shadow-hard hover:translate-y-[-2px] active:translate-y-0"
          >
            <Plus size={20} />
            <span className="uppercase tracking-widest text-[12px] font-black">Add Vocabulary</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-8 border-b border-border">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            <button className="h-12 px-4 bg-secondary border border-border rounded-xl flex items-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
              <SlidersHorizontal size={16} />
              <span className="text-sm font-bold">Filters</span>
            </button>
            <div className="h-4 w-px bg-border mx-1" />
            <div className="flex bg-secondary p-1 rounded-xl border border-border">
              <button className="p-2 bg-background shadow-soft rounded-lg text-foreground"><LayoutGrid size={18} /></button>
              <button className="p-2 text-muted-foreground hover:text-foreground"><List size={18} /></button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-secondary rounded-2xl" />
            ))}
          </div>
        ) : words.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 scale-in">
              {words.map((word) => (
                <VocabCard
                  key={word.id}
                  word={word}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            
            <Pagination
              page={page}
              total={total}
              limit={10}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-3xl group hover:border-zinc-400 transition-colors">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6 text-muted-foreground group-hover:scale-110 transition-transform">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-display font-black uppercase tracking-tight mb-2">Vault Empty</h3>
            <p className="text-muted-foreground font-medium max-w-xs mx-auto mb-8">
              Your library is currently vacant. Begin by colonizing it with new terms.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Initiate First Entry</span>
            </button>
          </div>
        )}
      </div>

      <WordForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        word={editingWord}
        onSave={handleSave}
      />
    </Layout>
  );
}
