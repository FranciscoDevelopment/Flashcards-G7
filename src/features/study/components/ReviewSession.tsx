import type { Card } from '../../cards/types';

type ReviewSessionProps = {
  currentCard: Card;
  currentIndex: number;
  totalCards: number;
  progress: number;
  selectedTopic: string;
  showAnswer: boolean;
  onShowAnswer: () => void;
  onNextCard: () => void;
  onPreviousCard: () => void;
  onChangeDeck: () => void;
};

export default function ReviewSession({
  currentCard,
  currentIndex,
  totalCards,
  progress,
  selectedTopic,
  showAnswer,
  onShowAnswer,
  onNextCard,
  onPreviousCard,
  onChangeDeck,
}: ReviewSessionProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-900 dark:bg-slate-900/20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Mazo actual
          </p>

          <p className="text-lg font-semibold text-slate-950 dark:text-white">
            {selectedTopic === 'all' ? 'Todas las tarjetas' : selectedTopic}
          </p>
        </div>

        <button
          onClick={onChangeDeck}
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
        Tarjeta {currentIndex + 1} de {totalCards}
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
          onClick={onShowAnswer}
          className="mt-8 rounded-xl bg-violet-600 px-4 py-2 font-semibold !text-white hover:bg-violet-500 transition-colors"
        >
          Ver respuesta
        </button>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={onPreviousCard}
          disabled={currentIndex === 0}
          className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:text-slate-300 dark:hover:text-violet-300"
        >
          Anterior
        </button>

        <button
          onClick={onNextCard}
          className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-violet-300"
        >
          {currentIndex === totalCards - 1 ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}