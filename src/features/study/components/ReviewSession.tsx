import type { Card } from '../../cards/types';

type ReviewSessionProps = {
  currentCard: Card;
  currentIndex: number;
  totalCards: number;
  progress: number;
  selectedTopic: string;
  showAnswer: boolean;
  direction: 'next' | 'prev';
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
  direction,
  onShowAnswer,
  onNextCard,
  onPreviousCard,
  onChangeDeck,
}: ReviewSessionProps) {
  const isLastCard = currentIndex === totalCards - 1;
  const isReadyToFinish = isLastCard && showAnswer;
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

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/30 dark:shadow-[0_0_0_1px_rgba(139,92,246,0.08)]">
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
          className={`review-flip-card relative mt-12 ${direction === 'prev' ? 'study-card-enter-prev' : 'study-card-enter-next'
            }`}
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

        <div className="mt-10 grid grid-cols-3 items-end gap-4">
          <div className="flex justify-start">
            <button
              onClick={onPreviousCard}
              disabled={currentIndex === 0}
              className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:text-violet-300"
            >
              Anterior
            </button>
          </div>

          <div className="flex justify-center pb-4">
            <button
              onClick={onShowAnswer}
              className="rounded-xl bg-violet-600 px-6 py-3 font-semibold !text-white transition-colors hover:bg-violet-500"
            >
              {showAnswer ? 'Ver pregunta' : 'Ver respuesta'}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onNextCard}
              className={
                isReadyToFinish
                  ? 'rounded-xl bg-emerald-500 px-7 py-3 font-semibold !text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-400'
                  : 'rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-violet-300'
              }
            >
              {isReadyToFinish ? '✓ Finalizar' : isLastCard ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>


      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 lg:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Mazo actual
          </p>

          <p className="text-base font-semibold text-slate-950 dark:text-white">
            {selectedTopic === 'all' ? 'Todas las tarjetas' : selectedTopic}
          </p>
        </div>

        <button
          onClick={onChangeDeck}
          className="text-sm text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"
        >
          ← Cambiar mazo
        </button>
      </div>
    </div>
  );
}