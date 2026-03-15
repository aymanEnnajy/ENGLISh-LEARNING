import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export default function Pagination({ page, total, limit, onPageChange }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={clsx(
              "w-10 h-10 rounded-lg font-black text-sm transition-all border",
              page === p 
                ? "bg-primary text-primary-foreground border-primary" 
                : "border-transparent hover:border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
