import { LayoutDashboard, GraduationCap, BarChart3, Settings, BookOpen, Mic } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Library', path: '/library' },
  { icon: GraduationCap, label: 'Practice', path: '/test' },
  { icon: Mic, label: 'Oral Optimizer', path: '/oral' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar - Minimalist Monochrome */}
      <aside className="fixed left-0 top-24 bottom-0 w-20 desktop:w-64 hidden lg:flex flex-col border-r border-border bg-background z-40">
        <div className="p-4 flex flex-col gap-2 h-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-4 p-4 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon size={20} />
                <span className="font-bold tracking-tight hidden desktop:block">{item.label}</span>
              </Link>
            );
          })}
          
          <div className="mt-auto pt-4 border-t border-border">
            <Link
              to="/settings"
              className={clsx(
                "flex items-center gap-4 p-4 rounded-xl transition-all duration-200",
                location.pathname === '/settings'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Settings size={20} />
              <span className="font-bold tracking-tight hidden desktop:block">Settings</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav - Monochrome */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border lg:hidden z-50 px-4 py-2">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px]",
                  isActive ? "text-primary bg-secondary" : "text-muted-foreground"
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
