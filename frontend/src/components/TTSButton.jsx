import { Volume2 } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';

export default function TTSButton({ text, rate = 0.9, className = '' }) {
  const { speak } = useTTS();

  return (
    <button
      onClick={(e) => { e.stopPropagation(); speak(text, rate); }}
      className={`group flex items-center gap-1.5 text-sm transition-colors ${className || 'text-muted-foreground hover:text-foreground'}`}
      title={`Pronounce "${text}" at ${rate}x speed`}
    >
      <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
    </button>
  );
}
