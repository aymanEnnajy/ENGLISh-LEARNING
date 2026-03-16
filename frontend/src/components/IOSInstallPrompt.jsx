import { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export default function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if it's iOS and if it's NOT already running in standalone mode (installed)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // Also check if the user has already dismissed it in this session or recently
    const isDismissed = sessionStorage.getItem('ios-prompt-dismissed');

    if (isIOS && !isStandalone && !isDismissed) {
      setShowPrompt(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('ios-prompt-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[60] animate-bounce-in">
      <div className="bg-card border-2 border-primary rounded-2xl p-5 shadow-hard relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4 pr-6">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
            <PlusSquare size={24} className="text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-tight mb-1">Install vocaMster</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Install this app on your iPhone for a better experience and offline access.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <div className="flex items-center gap-2">
            <span>1. Tap</span>
            <div className="p-1 bg-secondary rounded-md">
              <Share size={14} />
            </div>
          </div>
          <span>2. Scroll down</span>
          <div className="flex items-center gap-2">
            <span>3. Tap</span>
            <span className="px-2 py-1 bg-secondary rounded-md text-foreground">Add to Home Screen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
