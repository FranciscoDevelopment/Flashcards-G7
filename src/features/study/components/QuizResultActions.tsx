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
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      <button onClick={handleIncorrect}>
        No la sabía
      </button>

      <button onClick={handleCorrect}>
        La sabía
      </button>
    </div>
  );
}