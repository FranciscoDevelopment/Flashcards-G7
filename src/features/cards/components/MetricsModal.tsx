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

  const handleReset = () => {
    if (window.confirm('¿Resetear las métricas de esta tarjeta? Esta acción no se puede deshacer.')) {
      resetCardMetrics(card.id);
      onClose();
    }
  };

  // Color del porcentaje según rendimiento
  const percentageColor =
    percentage >= 70
      ? 'text-emerald-400'
      : percentage >= 40
        ? 'text-amber-400'
        : 'text-rose-400';

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-5"
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

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-emerald-400">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Aciertos</span>
            </div>
            <p className="text-2xl font-extrabold text-emerald-400">{card.hits}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-rose-400">
              <XCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Errores</span>
            </div>
            <p className="text-2xl font-extrabold text-rose-400">{card.misses}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Precisión</span>
            </div>
            <p className={`text-2xl font-extrabold ${percentageColor}`}>
              {total === 0 ? '—' : `${percentage}%`}
            </p>
          </div>
        </div>

        {/* Total responses */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Total de respuestas</span>
          <span className="text-sm font-bold text-white">{total}</span>
        </div>

        {/* Last reviewed */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Último repaso</span>
          <span className="text-sm font-bold text-white">
            {card.lastReviewedAt
              ? new Date(card.lastReviewedAt).toLocaleDateString()
              : 'Sin repasos aún'}
          </span>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Errores</span>
              <span>Aciertos</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-rose-500/30">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-1 border-t border-slate-800/60">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <RotateCcw size={13} />
            Resetear métricas
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