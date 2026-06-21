type ReviewFinishedProps = {
  totalCards: number;
  onRestart: () => void;
  onBackToDecks: () => void;
};

export default function ReviewFinished({
  totalCards,
  onRestart,
  onBackToDecks,
}: ReviewFinishedProps) {
  return (
    <div className="mx-auto flex min-h-[55vh] items-center justify-center">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-slate-950 dark:text-white">
          🎉 Terminaste el mazo
        </h2>

        <p className="mb-10 text-slate-600 dark:text-slate-400">
          Repasaste {totalCards} {totalCards === 1 ? 'tarjeta' : 'tarjetas'}.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={onRestart}
            className="rounded-xl bg-violet-600 px-4 py-2 font-semibold !text-white transition-colors hover:bg-violet-500"
          >
            Repasar nuevamente
          </button>

          <button
            onClick={onBackToDecks}
            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-violet-500 dark:hover:text-white"
          >
            Volver a mazos
          </button>
        </div>
      </div>
    </div>
  );
}