type QuizResultActionsProps = {
  onNextCard: () => void;
};

export default function QuizResultActions({ onNextCard }: QuizResultActionsProps) {
  const handleCorrect = () => {
    // Punto de integración para D3:
    // acá se conectará el registro de aciertos.
    onNextCard();
  };

  const handleIncorrect = () => {
    // Punto de integración para D3:
    // acá se conectará el registro de errores.
    onNextCard();
  };

  return (
    <div className="mt-1 flex flex-col justify-center gap-3 sm:flex-row">
      <button 
        onClick={handleIncorrect}
        className="rounded-xl border border-rose-300 px-5 py-3 min-w-[140px] font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40">
          No lo sabía
      </button>

      <button 
        onClick={handleCorrect}
        className="rounded-xl border border-emerald-300 px-5 py-3 min-w-[140px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/40">
          Lo sabía
      </button>
    </div>
  );
}