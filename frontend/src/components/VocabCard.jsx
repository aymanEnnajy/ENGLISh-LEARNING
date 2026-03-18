import { Trash2, Edit2, Volume2 } from 'lucide-react';
import TTSButton from './TTSButton';

export default function VocabCard({ word, onEdit, onDelete, viewMode = 'grid' }) {
  const isList = viewMode === 'list';

  return (
    <div className={`card-monochrome group flex hover:border-zinc-400 dark:hover:border-zinc-600 transition-all ${
      isList ? 'flex-row items-center gap-6 py-4' : 'flex-col h-full'
    }`}>
      {/* Word and Primary Translation */}
      <div className={`flex flex-col ${isList ? 'w-1/4 min-w-[150px]' : 'mb-4'}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1 overflow-hidden">
            <h3 className={`font-display font-black text-foreground group-hover:underline underline-offset-4 decoration-2 truncate ${isList ? 'text-lg' : 'text-xl'}`}>
              {word.word}
            </h3>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
              Vocabulary
            </p>
          </div>
          {!isList && <TTSButton text={word.word} />}
        </div>
      </div>

      {/* Translations and Meanings */}
      <div className={`flex-1 ${isList ? 'flex flex-row items-center gap-8' : 'space-y-4'}`}>
        <div className={`flex ${isList ? 'flex-row gap-6' : 'flex-col gap-2'}`}>
          {word.meaning_ar && (
            <div className="flex items-start gap-3 border-l-2 border-primary/20 pl-3">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase mt-1">AR</span>
              <span className={`font-bold leading-tight ${isList ? 'text-base' : 'text-lg'}`} dir="rtl">{word.meaning_ar}</span>
            </div>
          )}
          {word.meaning_fr && (
            <div className="flex items-start gap-3 border-l-2 border-muted pl-3">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase mt-1">FR</span>
              <span className={`font-bold text-zinc-600 dark:text-zinc-400 ${isList ? 'text-sm' : 'text-base'}`}>{word.meaning_fr}</span>
            </div>
          )}
        </div>

        {word.example_sentence && !isList && (
          <div className="bg-secondary p-4 rounded-xl border border-transparent group-hover:border-border transition-colors">
            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
              "{word.example_sentence}"
            </p>
          </div>
        )}
        
        {word.example_sentence && isList && (
          <p className="text-xs font-medium text-muted-foreground italic truncate max-w-md hidden lg:block">
            "{word.example_sentence}"
          </p>
        )}
      </div>

      {/* Actions */}
      <div className={`flex items-center gap-2 ${isList ? 'ml-auto' : 'mt-6 pt-4 border-t border-border'}`}>
        {isList && <TTSButton text={word.word} />}
        <button
          onClick={() => onEdit(word)}
          className={`${isList ? 'w-10 h-10' : 'flex-1 h-10 py-0'} btn-secondary text-xs flex items-center justify-center gap-2`}
          title="Edit"
        >
          <Edit2 size={14} />
          {!isList && <span>Edit</span>}
        </button>
        <button
          onClick={() => onDelete(word.id)}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
