import { useState } from 'react';
import { useCardStore } from '../cards/store';

export default function ReviewPage() {
  const cards = useCardStore((state) => state.cards);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const progress = ((currentIndex + 1) / cards.length) * 100;
  const currentCard = cards[currentIndex];

  const handleNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl rounded-2xl border border-slate-900 bg-slate-900/20 p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Modo Repaso
          </h1>
          <p className="text-slate-400">
            No hay tarjetas disponibles para repasar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-900 bg-slate-900/20 p-8">
        <h1 className="text-2xl font-bold text-white mb-6">
          Modo Repaso
        </h1>
        <div className="w-full h-2 rounded-full bg-slate-800 mb-4">
            <div
                className="h-2 rounded-full bg-violet-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
        <p className="text-slate-400">
          Tarjeta {currentIndex + 1} de {cards.length}
        </p>

        <div className="mt-6">
          <h2 className="text-xl text-white">
            {currentCard.question}
          </h2>
        </div>

        {showAnswer && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
              Respuesta
            </p>
            <p className="text-slate-200 leading-relaxed">
              {currentCard.answer}
            </p>
          </div>
        )}

        {!showAnswer && (
          <button
            onClick={() => setShowAnswer(true)}
            className="mt-8 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Ver respuesta
          </button>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handlePreviousCard}
            disabled={currentIndex === 0}
            className="rounded-xl border border-slate-700 px-4 py-2 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <button
            onClick={handleNextCard}
            disabled={currentIndex === cards.length - 1}
            className="rounded-xl border border-slate-700 px-4 py-2 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}