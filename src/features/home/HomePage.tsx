import { Link } from 'react-router-dom';
import { Layers, Brain, HelpCircle, BarChart3, ArrowRight, Lock, TrendingUp, CheckCircle2, XCircle, Flame } from 'lucide-react';

export default function HomePage() {
  // Estos datos simulan lo que vas a mostrar en el dashboard más adelante
  const stats = {
    streak: 0,
    progress: 0,
    hits: 0,
    misses: 0
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Sección de Bienvenida */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">¡Bienvenido!</h2>
        <p className="text-lg text-slate-400">¿Qué te gustaría hacer hoy?</p>
      </div>

      {/* Grilla de Tarjetas / Modos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        
        {/* Card 1: Mis Tarjetas (Activa - Tu Desafío D1) */}
        <Link 
          to="/cards" 
          className="relative group bg-slate-900/40 border-2 border-slate-900 hover:border-violet-500/30 rounded-2xl p-6 flex flex-col justify-between min-h-[250px] transition-all hover:shadow-lg hover:shadow-violet-600/5 hover:-translate-y-0.5"
        >
          <div className="flex flex-col items-center text-center mt-4">
            <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400 mb-4 group-hover:scale-105 transition-transform">
              <Layers size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mis tarjetas</h3>
            <p className="text-sm text-slate-450 px-2">Crea, edita y organiza tus tarjetas de estudio.</p>
          </div>
          <div className="flex justify-end mt-4">
            <div className="p-2 bg-slate-800 text-slate-300 rounded-full group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>

        {/* Card 2: Modo Repaso (Bloqueada - Placeholder para D2) */}
        <div className="relative border-2 border-dashed border-slate-900 bg-slate-900/10 rounded-2xl p-6 flex flex-col justify-between min-h-[250px] opacity-60">
          <div className="flex flex-col items-center text-center mt-4">
            <div className="p-3 bg-slate-950 rounded-xl text-slate-600 mb-4">
              <Brain size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-500 mb-2">Modo repaso</h3>
            <p className="text-sm text-slate-500 px-2">Repasa las tarjetas y refuerza tu memoria.</p>
          </div>
          <div className="flex justify-end mt-4 text-slate-600">
            <Lock size={16} />
          </div>
        </div>

        {/* Card 3: Modo Quiz (Bloqueada - Placeholder para D2) */}
        <div className="relative border-2 border-dashed border-slate-900 bg-slate-900/10 rounded-2xl p-6 flex flex-col justify-between min-h-[250px] opacity-60">
          <div className="flex flex-col items-center text-center mt-4">
            <div className="p-3 bg-slate-950 rounded-xl text-slate-600 mb-4">
              <HelpCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-500 mb-2">Modo quiz</h3>
            <p className="text-sm text-slate-500 px-2">Poné a prueba tus conocimientos.</p>
          </div>
          <div className="flex justify-end mt-4 text-slate-600">
            <Lock size={16} />
          </div>
        </div>

        {/* Card 4: Progreso (Bloqueada - Placeholder para D5) */}
        <div className="relative border-2 border-dashed border-slate-900 bg-slate-900/10 rounded-2xl p-6 flex flex-col justify-between min-h-[250px] opacity-60">
          <div className="flex flex-col items-center text-center mt-4">
            <div className="p-3 bg-slate-950 rounded-xl text-slate-600 mb-4">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-500 mb-2">Progreso</h3>
            <p className="text-sm text-slate-500 px-2">Mirá tus estadísticas y rachas.</p>
          </div>
          <div className="flex justify-end mt-4 text-slate-600">
            <Lock size={16} />
          </div>
        </div>

      </div>

      {/* Sección Inferior: Mini Dashboard de Progreso General */}
      <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 opacity-50 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-slate-800/10 blur-3xl" />
        
        {/* Estadísticas simuladas difuminadas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-slate-500" size={24} />
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tu progreso general</p>
              <div className="h-4 w-16 bg-slate-800 rounded animate-pulse mt-1"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-slate-500" size={24} />
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Aciertos</p>
              <div className="h-4 w-12 bg-slate-800 rounded animate-pulse mt-1"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <XCircle className="text-slate-500" size={24} />
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Errores</p>
              <div className="h-4 w-12 bg-slate-800 rounded animate-pulse mt-1"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Flame className="text-slate-500" size={24} />
            <div>
              <p className="text-xs text-slate-550 font-semibold uppercase tracking-wider">Racha actual</p>
              <p className="text-sm font-bold text-slate-400">{stats.streak} días</p>
            </div>
          </div>
        </div>

        {/* Candado absoluto para el panel de progreso */}
        <div className="absolute right-6 text-slate-500">
          <Lock size={18} />
        </div>
      </div>
    </div>
  );
}
