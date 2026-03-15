import { Sun, Moon, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useDarkMode } from '../context/DarkModeContext';
import logoBlack from '../assets/logoBlack.png';
import logoWhite from '../assets/logoWhite.png';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useDarkMode();

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-24 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 h-full">
        <div className="h-16 sm:h-20 flex items-center">
          <img 
            src={darkMode ? logoWhite : logoBlack} 
            alt="vocaMster Logo" 
            className="h-full w-auto object-contain"
          />
        </div>
        <span className="font-display font-black text-2xl sm:text-4xl tracking-tighter uppercase text-foreground">
          voca<span className="text-zinc-500">Mster</span>
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-border"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="h-4 w-px bg-border hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm font-bold tracking-tight">
            {user.user_metadata?.display_name || user.email?.split('@')[0]}
          </span>
          <button
            onClick={logout}
            className="p-2 rounded-xl text-zinc-500 hover:text-foreground hover:bg-secondary transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
