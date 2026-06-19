import { NavLink } from 'react-router-dom';
import { BookOpen, PlusCircle, RefreshCw, HelpCircle, Home } from 'lucide-react';

export default function Navbar() {
  const navItems = [
    { to: '/', name: 'Inicio', icon: Home, exact: true },
    { to: '/cards', name: 'Tarjetas', icon: BookOpen, exact: false },
    { to: '/new', name: 'Nueva Tarjeta', icon: PlusCircle, exact: false },
    { to: '/review', name: 'Repaso (I2)', icon: RefreshCw, exact: false },
    { to: '/quiz', name: 'Quiz (I2)', icon: HelpCircle, exact: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="text-white h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-md font-bold text-white tracking-tight leading-none">SmartFlash</h1>
            <span className="text-[10px] text-slate-500 font-medium">Módulo de Tarjetas</span>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-inner'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`
              }
            >
              <item.icon size={15} />
              <span className="hidden xs:inline">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
