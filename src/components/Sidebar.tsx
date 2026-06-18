import { NavLink } from 'react-router-dom';
import { BookOpen, Settings, Layers } from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';
import { isCardDue } from '../utils/leitner';

export default function Sidebar() {
  const cards = useDeckStore((state) => state.cards);
  
  // Calculate stats
  const totalCards = cards.length;
  const dueCards = cards.filter(isCardDue).length;

  const navItems = [
    { to: '/', name: 'Dashboard', icon: BookOpen },
    { to: '/leitner', name: 'Leitner Progress', icon: Layers },
    { to: '/settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 flex flex-col shrink-0">
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
          <BookOpen className="text-white h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight leading-none">AethelFlash</h1>
          <span className="text-xs text-slate-500 font-medium">Spaced Repetition</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1.5 flex flex-row md:flex-col justify-around md:justify-start overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
              }`
            }
          >
            <item.icon size={18} />
            <span className="hidden md:inline">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Stat Panel Footer */}
      <div className="hidden md:block p-4 m-4 rounded-xl bg-slate-900 border border-slate-800/60">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Your Progress</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Total Cards</span>
            <span className="text-sm font-bold text-slate-300">{totalCards}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Due Reviews</span>
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${dueCards > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-sm font-bold text-slate-300">{dueCards}</span>
            </span>
          </div>
        </div>

        {dueCards > 0 && (
          <div className="mt-4 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-300 leading-normal">
            You have <strong>{dueCards}</strong> cards due. Time to do some reviews!
          </div>
        )}
      </div>
    </aside>
  );
}
