import { Link } from 'react-router-dom';
import { Layers, Brain, HelpCircle, BarChart3, ArrowRight } from 'lucide-react';
import HomeSummary from '../features/progress/components/HomeSummary';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Sección de Bienvenida */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">¡Bienvenido!</h2>
        <p className="text-lg text-slate-400">¿Qué te gustaría hacer hoy?</p>
      </div>

      {/* Grilla de Tarjetas / Modos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

        <Link
          to="/cards"
          className="relative group bg-slate-900/40 border-2 border-slate-900 hover:border-violet-500/30 rounded-2xl p-6 flex flex-col justify-between min-h-[250px] transition-all hover:shadow-lg hover:shadow-violet-600/5 hover:-translate-y-0.5"
        >
          <div className="flex flex-col items-center text-center mt-4">
            <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400 mb-4 group-hover:scale-105 transition-transform">
              <Layers size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mis tarjetas</h3>
            <p className="text-sm text-slate-400 px-2">Crea, edita y organiza tus tarjetas de estudio.</p>
          </div>
          <div className="flex justify-end mt-4">
            <div className="p-2 bg-slate-800 text-slate-300 rounded-full group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>

        <Link
          to="/study/review"
          className="relative group bg-slate-900/40 border-2 border-slate-900 hover:border-violet-500/30 rounded-2xl p-6 flex flex-col justify-between min-h-[250px] transition-all hover:shadow-lg hover:shadow-violet-600/5 hover:-translate-y-0.5"
        >
          <div className="flex flex-col items-center text-center mt-4">
            <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400 mb-4 group-hover:scale-105 transition-transform">
              <Brain size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Modo Repaso</h3>
            <p className="text-sm text-slate-400 px-2">Repasa las tarjetas y refuerza tu memoria.</p>
          </div>
          <div className="flex justify-end mt-4">
            <div className="p-2 bg-slate-800 text-slate-300 rounded-full group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>

        <Link
          to="/study/quiz"
          className="relative group bg-slate-900/40 border-2 border-slate-900 hover:border-violet-500/30 rounded-2xl p-6 flex flex-col justify-between min-h-[250px] transition-all hover:shadow-lg hover:shadow-violet-600/5 hover:-translate-y-0.5"
        >
          <div className="flex flex-col items-center text-center mt-4">
            <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400 mb-4 group-hover:scale-105 transition-transform">
              <HelpCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Modo Quiz</h3>
            <p className="text-sm text-slate-400 px-2">Poné a prueba tus conocimientos.</p>
          </div>
          <div className="flex justify-end mt-4">
            <div className="p-2 bg-slate-800 text-slate-300 rounded-full group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>

        {/* Card 4: Progreso — D5 */}
        <Link
          to="/progress"
          className="relative group bg-slate-900/40 border-2 border-slate-900 hover:border-violet-500/30 rounded-2xl p-6 flex flex-col justify-between min-h-[250px] transition-all hover:shadow-lg hover:shadow-violet-600/5 hover:-translate-y-0.5"
        >
          <div className="flex flex-col items-center text-center mt-4">
            <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400 mb-4 group-hover:scale-105 transition-transform">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Progreso</h3>
            <p className="text-sm text-slate-400 px-2">Mirá tus estadísticas y rachas.</p>
          </div>
          <div className="flex justify-end mt-4">
            <div className="p-2 bg-slate-800 text-slate-300 rounded-full group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>

      </div>

      {/* Sección Inferior: Mini Dashboard de Progreso General — D5 */}
      <HomeSummary />

    </div>
  );
}