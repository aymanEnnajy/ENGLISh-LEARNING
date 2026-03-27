import { X, Save, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function WordForm({ word, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    word: '',
    meaning_ar: '',
    meaning_fr: '',
    example_sentence: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  useEffect(() => {
    if (word) {
      setFormData({
        word: word.word || '',
        meaning_ar: word.meaning_ar || '',
        meaning_fr: word.meaning_fr || '',
        example_sentence: word.example_sentence || ''
      });
    } else {
      setFormData({ word: '', meaning_ar: '', meaning_fr: '', example_sentence: '' });
    }
    setIsSubmitting(false);
    setGenerateError('');
  }, [word, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoFill = async () => {
    const trimmed = formData.word.trim();
    if (!trimmed || isGenerating) return;
    setIsGenerating(true);
    setGenerateError('');
    try {
      const { data } = await api.post('/ai/generate-vocab-details', { word: trimmed });
      setFormData(prev => ({
        ...prev,
        meaning_ar: data.meaning_ar || prev.meaning_ar,
        meaning_fr: data.meaning_fr || prev.meaning_fr,
        example_sentence: data.example_sentence || prev.example_sentence
      }));
    } catch (err) {
      console.error('Auto-fill failed:', err);
      if (err.response?.status === 404) {
        setGenerateError('Route not found — restart your backend server.');
      } else if (err.response?.data?.error) {
        setGenerateError(err.response.data.error);
      } else {
        setGenerateError(err.message || 'AI generation failed. Try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const aiBtnDisabled = isGenerating || !formData.word.trim();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-display font-black tracking-tight uppercase">
              {word ? 'Update Entry' : 'New Vocabulary'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                Universal Term (English)
              </label>
              <input
                required
                className="input-monochrome font-bold placeholder:text-zinc-500/30"
                placeholder="e.g. Resilience"
                value={formData.word}
                onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                disabled={isSubmitting || isGenerating}
              />
              <button
                type="button"
                onClick={handleAutoFill}
                disabled={aiBtnDisabled}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 border-2 ${
                  aiBtnDisabled
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700 cursor-not-allowed'
                    : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900 cursor-pointer'
                }`}
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-emerald-300 border-t-emerald-700 rounded-full animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                {isGenerating ? 'Generating translations...' : 'Auto-fill with AI ✨'}
              </button>
              {generateError && (
                <p className="text-xs text-red-500 font-bold">{generateError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Arabic (Meaning)
                </label>
                <input
                  className="input-monochrome font-bold"
                  dir="rtl"
                  placeholder="المعنى"
                  value={formData.meaning_ar}
                  onChange={(e) => setFormData({ ...formData, meaning_ar: e.target.value })}
                  disabled={isSubmitting || isGenerating}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  French (Meaning)
                </label>
                <input
                  className="input-monochrome font-bold"
                  placeholder="Signification"
                  value={formData.meaning_fr}
                  onChange={(e) => setFormData({ ...formData, meaning_fr: e.target.value })}
                  disabled={isSubmitting || isGenerating}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                Usage Context (Example)
              </label>
              <textarea
                className="input-monochrome font-medium min-h-[100px] resize-none"
                placeholder="How do you use this word in a sentence?"
                value={formData.example_sentence}
                onChange={(e) => setFormData({ ...formData, example_sentence: e.target.value })}
                disabled={isSubmitting || isGenerating}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-monochrome h-14 flex items-center justify-center gap-2 group disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={18} className="group-hover:translate-y-[-1px] transition-transform" />
                )}
                <span>{isSubmitting ? 'Processing...' : (word ? 'Confirm Changes' : 'Create Entry')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
