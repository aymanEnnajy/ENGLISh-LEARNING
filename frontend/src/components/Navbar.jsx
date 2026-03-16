import { Sun, Moon, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useDarkMode } from '../context/DarkModeContext';
import { Link } from 'react-router-dom';
import logoBlack from '../assets/logoBlack.png';
import logoWhite from '../assets/logoWhite.png';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useDarkMode();

  if (!user) return null;

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-24 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 h-full">
        <Link to="/dashboard" className="h-16 sm:h-20 flex items-center hover:opacity-80 transition-opacity">
          <img 
            src={darkMode ? logoWhite : logoBlack} 
            alt="vocaMster Logo" 
            className="h-full w-auto object-contain"
          />
        </Link>
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link 
            to="/settings" 
            className="flex items-center gap-2 hover:bg-secondary p-1.5 sm:p-2 rounded-xl transition-all group"
            title="Settings"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-zinc-500 group-hover:text-foreground group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
              <User size={18} />
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-tight max-w-[80px] sm:max-w-none truncate">
              {displayName}
            </span>
          </Link>
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
