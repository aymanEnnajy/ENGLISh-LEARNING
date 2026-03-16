import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Are you sure?', 
  message = 'This action cannot be undone.', 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'danger' 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              type === 'danger' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100' : 'bg-secondary text-foreground'
            }`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-display font-black uppercase tracking-tight">{title}</h3>
              <p className="text-muted-foreground text-sm font-medium">{message}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary text-sm"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 btn-monochrome text-sm ${
                type === 'danger' 
                  ? 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200' 
                  : ''
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
