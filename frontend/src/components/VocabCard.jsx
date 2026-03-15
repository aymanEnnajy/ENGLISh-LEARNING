import { Trash2, Edit2, Volume2 } from 'lucide-react';
import TTSButton from './TTSButton';

export default function VocabCard({ word, onEdit, onDelete }) {
  return (
    <div className="card-monochrome group flex flex-col h-full hover:border-zinc-400 dark:hover:border-zinc-600">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-display font-black text-foreground group-hover:underline underline-offset-4 decoration-2">
            {word.word}
          </h3>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
            Vocabulary
          </p>
        </div>
        <TTSButton text={word.word} />
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex flex-col gap-2">
          {word.meaning_ar && (
            <div className="flex items-start gap-3 border-l-2 border-primary/20 pl-3">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase mt-1">AR</span>
              <span className="font-bold text-lg leading-tight" dir="rtl">{word.meaning_ar}</span>
            </div>
          )}
          {word.meaning_fr && (
            <div className="flex items-start gap-3 border-l-2 border-muted pl-3">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase mt-1">FR</span>
              <span className="font-bold text-base text-zinc-600 dark:text-zinc-400">{word.meaning_fr}</span>
            </div>
          )}
        </div>

        {word.example_sentence && (
          <div className="bg-secondary p-4 rounded-xl border border-transparent group-hover:border-border transition-colors">
            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
              "{word.example_sentence}"
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 pt-4 border-t border-border">
        <button
          onClick={() => onEdit(word)}
          className="flex-1 btn-secondary text-xs h-10 py-0 flex items-center justify-center gap-2"
        >
          <Edit2 size={14} />
          <span>Edit</span>
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
