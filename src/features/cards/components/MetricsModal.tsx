import { X, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { useCardStore } from '../store';
import type { Card } from '../types';

interface MetricsModalProps {
  card: Card;
  onClose: () => void;
}

export default function MetricsModal({ card, onClose }: MetricsModalProps) {
  const resetCardMetrics = useCardStore((state) => state.resetCardMetrics);

  const total = card.hits + card.misses;
  const percentage = total === 0 ? 0 : Math.round((card.hits / total) * 100);

  // Últimas 10 respuestas en orden cronológico
  const recentHistory = (card.history ?? []).slice(-10);

  const handleReset = () => {
    if (window.confirm('¿Resetear las métricas de esta tarjeta? Esta acción no se puede deshacer.')) {
      resetCardMetrics(card.id);
      onClose();
    }
  };

  const percentageColor =
    percentage >= 70
      ? 'text-emerald-400'
      : percentage >= 40
        ? 'text-amber-400'
        : 'text-rose-400';

  const ringColor =
    percentage >= 70
      ? '#34d399'
      : percentage >= 40
        ? '#fbbf24'
        : '#f87171';

  // SVG circular progress
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Métricas de
            </p>
            <h3 className="text-base font-semibold text-white leading-snug line-clamp-2">
              {card.question}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-slate-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats Grid — 4 columnas como en el diseño */}
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Aciertos (hits)
            </p>
            <p className="text-2xl font-extrabold text-emerald-400">{card.hits}</p>
          </div>

          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-center space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
              Errores (misses)
            </p>
            <p className="text-2xl font-extrabold text-rose-400">{card.misses}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-center space-y-1 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total respuestas
            </p>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{total}</p>
          </div>

          {/* Circular progress */}
          <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-center space-y-1 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Porcentaje de aciertos
            </p>
            <div className="relative flex items-center justify-center mt-1">
              <svg width="70" height="70" className="-rotate-90">
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="6"
                />
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  fill="none"
                  stroke={total === 0 ? '#1e293b' : ringColor}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <span className={`absolute text-sm font-extrabold ${percentageColor}`}>
                {total === 0 ? '—' : `${percentage}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Historial reciente */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-300">
            Historial reciente{' '}
            <span className="text-slate-500 font-normal">(últimas 10 respuestas)</span>
          </p>

          {recentHistory.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              Todavía no hay respuestas registradas para esta tarjeta.
            </p>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {recentHistory.map((entry, index) =>
                entry === 'hit' ? (
                  <CheckCircle2
                    key={index}
                    size={22}
                    className="text-emerald-400"
                  />
                ) : (
                  <XCircle
                    key={index}
                    size={22}
                    className="text-rose-400"
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* Sección informativa */}
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 space-y-1">
          <p className="text-xs font-bold text-violet-300">¿Qué significa?</p>
          <ul className="text-xs text-slate-400 space-y-0.5 list-disc list-inside">
            <li>HIT (acierto): el usuario eligió "Lo sabía".</li>
            <li>MISS (error): el usuario eligió "No lo sabía".</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-1 border-t border-slate-800/60">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-500/30 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all"
          >
            <RotateCcw size={13} />
            Resetear métricas de esta tarjeta
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}