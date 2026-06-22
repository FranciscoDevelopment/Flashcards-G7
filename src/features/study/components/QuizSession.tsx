import type { Card } from '../../cards/types';
import QuizResultActions from './QuizResultActions';

type QuizSessionProps = {
  currentCard: Card;
  currentIndex: number;
  totalCards: number;
  progress: number;
  showAnswer: boolean;
  onShowAnswer: () => void;
  onNextCard: () => void;
  onPreviousCard: () => void;
};

export default function QuizSession({
  currentCard,
  currentIndex,
  totalCards,
  progress,
  showAnswer,
  onShowAnswer,
  onNextCard,
  onPreviousCard,
}: QuizSessionProps) {
  const isFirstCard = currentIndex === 0;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-900 dark:bg-slate-900/20">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tarjeta {currentIndex + 1} de {totalCards}
            </p>

            <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">
              {Math.round(progress)}%
            </p>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="review-flip-card mt-12">
          <div className={`review-flip-inner ${showAnswer ? 'is-flipped' : ''}`}>
            <div className="review-flip-face review-flip-front">
              <div className="flex h-full min-h-44 items-center">
                <h2 className="text-2xl font-semibold leading-relaxed text-slate-950 dark:text-white">
                  {currentCard.question}
                </h2>
              </div>
            </div>

            <div className="review-flip-face review-flip-back">
              <div className="flex h-full min-h-44 flex-col justify-center">
                <p className="mb-4 text-sm font-bold uppercase tracking-wider text-violet-500 dark:text-violet-300">
                  Respuesta
                </p>

                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                  {currentCard.answer}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 items-end gap-4">
          <div className="flex justify-start">
            <button
              onClick={onPreviousCard}
              disabled={isFirstCard || !showAnswer}
              className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:text-violet-300"
            >
              Anterior
            </button>
          </div>

          <div className="flex justify-center pb-4">
            {!showAnswer ? (
             <button
                onClick={onShowAnswer}
                className="rounded-xl bg-violet-600 px-6 py-3 font-semibold !text-white transition-colors hover:bg-violet-500"
                >
                    Ver respuesta
             </button>
            ) : (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Marcá si la sabías para continuar.
                </p>
            )}
          </div>

          <div className="flex justify-end">
            {showAnswer ? (
              <QuizResultActions onNextCard={onNextCard} />
            ) : (
              <button
                disabled
                className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:text-slate-300"
              >
                Siguiente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}