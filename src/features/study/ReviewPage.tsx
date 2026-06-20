import { useState } from 'react';
import { useCardStore } from '../cards/store';
import ReviewLayout from './components/ReviewLayout';

export default function ReviewPage() {
  const cards = useCardStore((state) => state.cards);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  
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
    } else {
    setIsSessionFinished(true);
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
    <ReviewLayout>
      <div className="mt-10 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-900 dark:bg-slate-900/20">
        <p className="text-slate-600 dark:text-slate-400 mb-8">
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
                setIsSessionFinished(false);
              }}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-violet-500/50 dark:hover:bg-slate-900"
            >
              <h2 className="text-lg font-bold text-slate-950 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-300">
                {deck.title}
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {deck.count} {deck.count === 1 ? 'tarjeta' : 'tarjetas'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </ReviewLayout>
  );
}

  if (reviewCards.length === 0) {
  return (
    <ReviewLayout>
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-900 dark:bg-slate-900/20">
        <p className="text-slate-600 dark:text-slate-400">
          No hay tarjetas disponibles para repasar.
        </p>
      </div>
    </ReviewLayout>
  );
}

  if (isSessionFinished) {
  return (
    <ReviewLayout>
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-900 dark:bg-slate-900/20">
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-4">
          🎉 Terminaste el mazo
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Repasaste {reviewCards.length} {reviewCards.length === 1 ? 'tarjeta' : 'tarjetas'}.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setShowAnswer(false);
              setIsSessionFinished(false);
            }}
            className="rounded-xl bg-violet-600 px-4 py-2 font-semibold !text-white hover:bg-violet-500 transition-colors"
          >
            Repasar nuevamente
          </button>

          <button
            onClick={() => {
              setSelectedTopic(null);
              setCurrentIndex(0);
              setShowAnswer(false);
              setIsSessionFinished(false);
            }}
            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white dark:hover:border-violet-500"
          >
            Volver a mazos
          </button>
        </div>
      </div>
    </ReviewLayout>
  );
}

  return (
  <ReviewLayout>
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-900 dark:bg-slate-900/20">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
                Mazo actual
            </p>

            <p className="text-lg font-semibold text-slate-950 dark:text-white">
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
                setIsSessionFinished(false);
              }}
            className="mb-6 text-sm text-slate-600 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300 transition-colors"
            >
                ← Cambiar mazo
            </button>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 mb-4">
            <div
                className="h-2 rounded-full bg-violet-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Tarjeta {currentIndex + 1} de {reviewCards.length}
        </p>

        <div className="mt-6">
          <h2 className="text-xl text-slate-950 dark:text-white">
            {currentCard.question}
          </h2>
        </div>

        {showAnswer && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
              Respuesta
            </p>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {currentCard.answer}
            </p>
          </div>
        )}

        {!showAnswer && (
          <button
            onClick={() => setShowAnswer(true)}
            className="mt-8 rounded-xl bg-violet-600 px-4 py-2 font-semibold !text-white hover:bg-violet-500 transition-colors"
          >
            Ver respuesta
          </button>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handlePreviousCard}
            disabled={currentIndex === 0}
            className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:text-slate-300 dark:hover:text-violet-300"
          >
            Anterior
          </button>

          <button
            onClick={handleNextCard}
            className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-violet-300"
          >
            {currentIndex === reviewCards.length - 1 ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
  </ReviewLayout>
  );
}