import { useState } from 'react';
import { useCardStore } from '../cards/store';

export default function ReviewPage() {
  const cards = useCardStore((state) => state.cards);
  const [showAnswer, setShowAnswer] = useState(false);


  const currentCard = cards[0];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-900 bg-slate-900/20 p-8">
        <h1 className="text-2xl font-bold text-white mb-6">
          Modo Repaso
        </h1>

        <p className="text-slate-400">
          {cards.length} tarjetas disponibles
        </p>

        <div className="mt-6">
          <h2 className="text-xl text-white">
            {currentCard?.question ?? 'No hay tarjetas para repasar'}
          </h2>
        </div>

        {showAnswer && currentCard && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
              Respuesta
            </p>
            <p className="text-slate-200 leading-relaxed">
              {currentCard.answer}
            </p>
          </div>
        )}

        {currentCard && !showAnswer && (
          <button
            onClick={() => setShowAnswer(true)}
            className="mt-8 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Ver respuesta
          </button>
        )}
      </div>
    </div>
  );
}