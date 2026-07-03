import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Tag, BarChart2 } from 'lucide-react';
import type { Card } from '../types';
import MetricsModal from './MetricsModal';
import { getCardPriorityScore} from  '../../study/utils/getOrderedCards';


interface CardItemProps {
  card: Card;
  onDelete: (id: string) => void;
}

export default function CardItem({ card, onDelete }: CardItemProps) {
  const [showMetrics, setShowMetrics] = useState(false);
  const score = getCardPriorityScore(card);
  const needsReview = score > 60;

  const difficultyColors = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <>
      <div className="group relative rounded-2xl border border-slate-900 bg-slate-900/10 p-5 md:p-6 space-y-4 hover:border-slate-800/80 hover:bg-slate-900/20 transition-all duration-300">
        {/* Background glow animation on hover */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-tr from-violet-600/0 via-indigo-600/0 to-violet-600/0 group-hover:from-violet-600/2 group-hover:to-indigo-600/2 opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* Header Info: Topic, Difficulty, Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
              <Tag size={10} />
              {card.topic}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${difficultyColors[card.difficulty]}`}>
              {card.difficulty}
            </span>
          </div>
        </div>

        {/* Main Text Content: Question & Answer side-by-side or stacked */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pregunta</div>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">{card.question}</p>
          </div>
          <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-900/60 pt-3 md:pt-0 md:pl-4">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Respuesta</div>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">{card.answer}</p>
          </div>
        </div>

        {/* Footer Row: Modification date + Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-900/30">
          <span
            className="text-[10px] font-mono text-slate-600"
            title={card.createdAt ? `Creada el: ${new Date(card.createdAt).toLocaleString()}` : 'Sin fecha'}
          >
            Creada: {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : 'N/A'}
          </span>

          {needsReview && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md">
           <span aria-hidden="true">⚠️</span> Necesita repaso
          </span>
          )}
          
          <div className="flex items-center gap-2">
            {/* D3: Botón de métricas habilitado */}
            <button
              onClick={() => setShowMetrics(true)}
              aria-label={`Ver métricas de la tarjeta: ${card.question}`}
              className="flex items-center justify-center gap-1 border border-slate-800 text-slate-400 hover:text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              title="Ver métricas de esta tarjeta"
            >
              <BarChart2 size={12} aria-hidden="true" />
              <span>Métricas</span>
            </button>

            <Link
              to={`/edit/${card.id}`}
              aria-label={`Editar tarjeta: ${card.question}`}
              className="flex items-center justify-center gap-1 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/80 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              title="Editar tarjeta"
            >
              <Edit2 size={12} aria-hidden="true" />
              <span>Editar</span>
            </Link>
            <button
              onClick={() => onDelete(card.id)}
              aria-label={`Eliminar tarjeta: ${card.question}`}
              className="flex items-center justify-center gap-1 border border-slate-800 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              title="Eliminar tarjeta"
            >
              <Trash2 size={12} aria-hidden="true" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>

      {/* D3: Modal de métricas */}
      {showMetrics && (
        <MetricsModal
          card={card}
          onClose={() => setShowMetrics(false)}
        />
      )}
    </>
  );
}