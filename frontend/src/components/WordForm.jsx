import { X, Save, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function WordForm({ word, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    word: '',
    meaning_ar: '',
    meaning_fr: '',
    example_sentence: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(false); // Reset when word/isOpen changes
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Universal Term (English)</label>
              <input
                required
                className="input-monochrome font-bold placeholder:text-zinc-500/30"
                placeholder="e.g. Resilience"
                value={formData.word}
                onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Arabic (Meaning)</label>
                <input
                  className="input-monochrome font-bold"
                  dir="rtl"
                  placeholder="المعنى"
                  value={formData.meaning_ar}
                  onChange={(e) => setFormData({ ...formData, meaning_ar: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">French (Meaning)</label>
                <input
                  className="input-monochrome font-bold"
                  placeholder="Signification"
                  value={formData.meaning_fr}
                  onChange={(e) => setFormData({ ...formData, meaning_fr: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Usage Context (Example)</label>
              <textarea
                className="input-monochrome font-medium min-h-[120px] resize-none"
                placeholder="How do you use this word in a sentence?"
                value={formData.example_sentence}
                onChange={(e) => setFormData({ ...formData, example_sentence: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="pt-4">
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
