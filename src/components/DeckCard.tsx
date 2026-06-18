import { Link, useNavigate } from 'react-router-dom';
import { Play, Eye, Trash2, Calendar, FileText } from 'lucide-react';
import type { Deck, Card } from '../types';
import { isCardDue } from '../utils/leitner';

interface DeckCardProps {
  deck: Deck;
  cards: Card[];
  onDelete: (id: string) => void;
}

export default function DeckCard({ deck, cards, onDelete }: DeckCardProps) {
  const navigate = useNavigate();
  
  // Calculate deck metrics
  const deckCards = cards.filter((c) => c.deckId === deck.id);
  const totalCards = deckCards.length;
  const dueCardsCount = deckCards.filter(isCardDue).length;

  const handleStudy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (totalCards > 0) {
      navigate(`/study/${deck.id}`);
    }
  };

  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 hover:bg-slate-900/60 overflow-hidden shadow-lg hover:shadow-2xl">
      {/* Decorative gradient blur background on card hover */}
      <div className={`absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br ${deck.color} opacity-0 group-hover:opacity-[0.07] rounded-full blur-2xl transition-opacity duration-300`} />

      <div>
        {/* Color stripe & title */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-2 rounded-full bg-gradient-to-b ${deck.color}`} />
            <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-violet-400 transition-colors">
              {deck.name}
            </h3>
          </div>
          <button
            onClick={() => onDelete(deck.id)}
            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors"
            title="Delete Deck"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-6">
          {deck.description || 'No description provided.'}
        </p>
      </div>

      <div>
        {/* Status stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 border-t border-slate-850 pt-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-800/60 text-slate-400">
              <FileText size={16} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total</div>
              <div className="text-sm font-bold text-slate-200">{totalCards} cards</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${dueCardsCount > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800/60 text-slate-400'}`}>
              <Calendar size={16} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Due</div>
              <div className={`text-sm font-bold ${dueCardsCount > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                {dueCardsCount} due
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/deck/${deck.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-[0.98]"
          >
            <Eye size={14} />
            Details
          </Link>
          <button
            onClick={handleStudy}
            disabled={totalCards === 0}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-[0.98] ${
              totalCards === 0
                ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-transparent'
                : dueCardsCount > 0
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500'
                : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-850'
            }`}
          >
            <Play size={14} fill={totalCards > 0 ? 'currentColor' : 'none'} />
            {dueCardsCount > 0 ? 'Study Due' : totalCards === 0 ? 'Empty' : 'Practice'}
          </button>
        </div>
      </div>
    </div>
  );
}
