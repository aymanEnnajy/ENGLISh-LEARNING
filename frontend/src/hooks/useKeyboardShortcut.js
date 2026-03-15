import { useEffect } from 'react';

export function useKeyboardShortcut(key, callback, deps = []) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Don't fire when typing in inputs
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
        e.preventDefault();
        callback(e);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, deps);
}
