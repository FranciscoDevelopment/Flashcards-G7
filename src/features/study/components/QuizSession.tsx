import type { Card } from '../../cards/types';
import QuizResultActions from './QuizResultActions';

type QuizSessionProps = {
  currentCard: Card;
  currentIndex: number;
  totalCards: number;
  progress: number;
  selectedTopic: string;
  showAnswer: boolean;
  canRevealAnswer: boolean;
  onShowAnswer: () => void;
  onNextCard: () => void;
  onRecordResult: (result: 'hit' | 'miss') => void;
};

export default function QuizSession({
  currentCard,
  currentIndex,
  totalCards,
  progress,
  selectedTopic,
  showAnswer,
  canRevealAnswer,
  onShowAnswer,
  onNextCard,
  onRecordResult,
}: QuizSessionProps) {

  return (
    <div className="relative mx-auto max-w-2xl space-y-4">
      <div className="absolute left-0 top-0 hidden -translate-x-[115%] lg:block">
        <div className="rounded-2xl border border-slate-200/70 bg-white/60 px-5 py-4 shadow-sm backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Mazo actual
          </p>

          <p className="mt-1 text-base font-semibold text-slate-950 dark:text-white">
            {selectedTopic === 'all' ? 'Todas las tarjetas' : selectedTopic}
          </p>
        </div>
      </div>

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

        <div
          key={currentCard.id}
          className="review-flip-card relative mt-12 study-card-enter"
        >
          <div className="study-card-deck" aria-hidden="true">
            {Array.from({
              length: Math.min(3, Math.max(totalCards - currentIndex - 1, 0)),
            }).map((_, index) => (
              <span
                key={index}
                className="study-card-deck-item"
                style={{ '--deck-index': index } as React.CSSProperties}
              />
            ))}
          </div>

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

        <div className="mt-8">
          {!showAnswer ? (
            <div className="flex justify-center">
              <button
  onClick={onShowAnswer}
  disabled={!canRevealAnswer}
  className="rounded-xl bg-violet-600 px-6 py-3 font-semibold !text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:bg-slate-400 dark:disabled:bg-slate-700"
>
  Ver respuesta
</button>
            </div>
          ) : (
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="flex justify-start pt-6">
                <button
                  onClick={onShowAnswer}
                  className="pl-2 text-sm text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"
                >
                  Recordar pregunta
                </button>
              </div>
              <div className="flex justify-center">
                <QuizResultActions
                  cardId={currentCard.id}
                  onNextCard={onNextCard}
                  onRecordResult={onRecordResult}
                />
              </div>
            </div>
          )}
          {showAnswer && (
            <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
              Marcá una opción para continuar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}