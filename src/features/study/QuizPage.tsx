import ReviewLayout from './components/ReviewLayout';

export default function QuizPage() {
  return (
    <ReviewLayout
      variant="selector"
      subtitle="Elegí un mazo para poner a prueba tus conocimientos."
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-900 dark:bg-slate-900/20">
        <p className="text-slate-600 dark:text-slate-400">
          Modo quiz en construcción.
        </p>
      </div>
    </ReviewLayout>
  );
}