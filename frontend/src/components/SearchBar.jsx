import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchBar({ value, onChange }) {
  const [innerValue, setInnerValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(innerValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [innerValue]);

  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-3 bg-secondary border border-transparent focus:border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-zinc-500/50 font-bold text-sm"
        placeholder="Search dictionary..."
        value={innerValue}
        onChange={(e) => setInnerValue(e.target.value)}
      />
      {innerValue && (
        <button
          onClick={() => setInnerValue('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-foreground"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
