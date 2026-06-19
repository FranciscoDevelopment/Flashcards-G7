import { useState } from 'react';
import { useCardStore } from '../cards/store';

export default function ReviewPage() {
  const cards = useCardStore((state) => state.cards);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const topics = Array.from(
    new Set(cards.map((card) => card.topic))
  ).filter(Boolean);

  const orderedCards = cards;

  const deckOptions = [
  {
    id: 'all',
    title: 'Todas las tarjetas',
    count: orderedCards.length,
  },
  ...topics.map((topic) => ({
    id: topic,
    title: topic,
    count: orderedCards.filter((card) => card.topic === topic).length,
  })),
];

  const reviewCards =
    selectedTopic === 'all'
        ? orderedCards
        : orderedCards.filter((card) => card.topic === selectedTopic);

  const currentCard = reviewCards[currentIndex];
  const progress = ((currentIndex + 1) / reviewCards.length) * 100;

  const handleNextCard = () => {
    if (currentIndex < reviewCards.length - 1) {
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

  if (selectedTopic === null) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-900 bg-slate-900/20 p-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Modo Repaso
        </h1>

        <p className="text-slate-400 mb-8">
          Elegí qué mazo querés repasar.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deckOptions.map((deck) => (
            <button
              key={deck.id}
              onClick={() => {
                setSelectedTopic(deck.id);
                setCurrentIndex(0);
                setShowAnswer(false);
              }}
              className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-left hover:border-violet-500/50 hover:bg-slate-900 transition-all"
            >
              <h2 className="text-lg font-bold text-white group-hover:text-violet-300">
                {deck.title}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {deck.count} {deck.count === 1 ? 'tarjeta' : 'tarjetas'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

  if (reviewCards.length === 0) {
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

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
                Mazo actual
            </p>

            <p className="text-lg font-semibold text-white">
                {selectedTopic === 'all'
                    ? 'Todas las tarjetas'
                    : selectedTopic}
            </p>
          </div>

            <button
              onClick={() => {
                setSelectedTopic(null);
                setCurrentIndex(0);
                setShowAnswer(false);
              }}
            className="mb-6 text-sm text-slate-400 hover:text-violet-300 transition-colors"
            >
                ← Cambiar mazo
            </button>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-800 mb-4">
            <div
                className="h-2 rounded-full bg-violet-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
        <p className="text-slate-400">
          Tarjeta {currentIndex + 1} de {reviewCards.length}
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
            disabled={currentIndex === reviewCards.length - 1}
            className="rounded-xl border border-slate-700 px-4 py-2 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}