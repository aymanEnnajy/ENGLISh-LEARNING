import { useEffect, useState } from 'react';
import { useVocabularyStore } from '../stores/vocabularyStore';
import VocabCard from '../components/VocabCard';
import WordForm from '../components/WordForm';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Layout from '../components/Layout';
import ConfirmModal from '../components/ConfirmModal';
import { Plus, LayoutGrid, List, SlidersHorizontal, Info, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const { words, fetchWords, loading, search, setSearch, page, setPage, total, deleteWord, addWord, updateWord } = useVocabularyStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('vocabViewMode') || 'grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    hasAr: false,
    hasFr: false,
    hasExample: false
  });

  const toggleViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('vocabViewMode', mode);
  };

  const filteredWords = words.filter(word => {
    if (activeFilters.hasAr && !word.meaning_ar) return false;
    if (activeFilters.hasFr && !word.meaning_fr) return false;
    if (activeFilters.hasExample && !word.example_sentence) return false;
    return true;
  });

  useEffect(() => {
    fetchWords();
  }, [page, search]);

  const handleDelete = (id) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteConfirm;
    if (!id) return;
    
    try {
      await deleteWord(id);
      toast.success('Word removed from library');
    } catch (err) {
      toast.error('Failed to delete word');
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
        <div className="flex flex-col gap-4 mb-10 pb-8 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`h-12 px-4 border rounded-xl flex items-center gap-2 transition-all ${
                  isFilterOpen || Object.values(activeFilters).some(v => v)
                    ? 'bg-black text-white border-black' 
                    : 'bg-secondary border-border hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="text-sm font-bold">Filters</span>
              </button>
              <div className="h-4 w-px bg-border mx-1" />
              <div className="flex bg-secondary p-1 rounded-xl border border-border">
                <button 
                  onClick={() => toggleViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-background shadow-soft text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => toggleViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-background shadow-soft text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filter Panel */}
          {isFilterOpen && (
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-border rounded-2xl p-4 flex flex-wrap gap-4 animate-scale-in">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-full mb-1 ml-1">Attribute Filtering</div>
              <button
                onClick={() => setActiveFilters(prev => ({ ...prev, hasAr: !prev.hasAr }))}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeFilters.hasAr ? 'bg-black text-white border-black' : 'bg-background border-border text-muted-foreground'}`}
              >
                Has Arabic
              </button>
              <button
                onClick={() => setActiveFilters(prev => ({ ...prev, hasFr: !prev.hasFr }))}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeFilters.hasFr ? 'bg-black text-white border-black' : 'bg-background border-border text-muted-foreground'}`}
              >
                Has French
              </button>
              <button
                onClick={() => setActiveFilters(prev => ({ ...prev, hasExample: !prev.hasExample }))}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeFilters.hasExample ? 'bg-black text-white border-black' : 'bg-background border-border text-muted-foreground'}`}
              >
                Has Example
              </button>
              {Object.values(activeFilters).some(v => v) && (
                <button
                  onClick={() => setActiveFilters({ hasAr: false, hasFr: false, hasExample: false })}
                  className="px-4 py-2 text-xs font-black uppercase text-zinc-400 hover:text-red-500 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-secondary rounded-2xl" />
            ))}
          </div>
        ) : filteredWords.length > 0 ? (
          <>
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 gap-6 scale-in" 
              : "flex flex-col gap-4 scale-in"
            }>
              {filteredWords.map((word) => (
                <VocabCard
                  key={word.id}
                  word={word}
                  viewMode={viewMode}
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

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Extract Word?"
        message="This entry will be permanently removed from your lexical vault."
        confirmText="Remove Entry"
        type="danger"
      />
    </Layout>
  );
}
