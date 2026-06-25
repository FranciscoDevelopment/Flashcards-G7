import { CheckCircle2, XCircle } from 'lucide-react';

type StudyFinishedProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  sessionHits?: number;
  sessionMisses?: number;
  onPrimary: () => void;
  onSecondary: () => void;
};

export default function StudyFinished({
  eyebrow,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  sessionHits = 0,
  sessionMisses = 0,
  onPrimary,
  onSecondary,
}: StudyFinishedProps) {
  const total = sessionHits + sessionMisses;
  const percentage = total === 0 ? 0 : Math.round((sessionHits / total) * 100);

  const percentageColor =
    percentage >= 70
      ? 'text-emerald-400'
      : percentage >= 40
        ? 'text-amber-400'
        : 'text-rose-400';

  return (
    <div className="mx-auto flex min-h-[55vh] items-center justify-center">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-900 dark:bg-slate-900/20 space-y-8">

        <div>
          {eyebrow && (
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-300">
              {eyebrow}
            </p>
          )}
          <h2 className="mb-3 text-2xl font-bold text-slate-950 dark:text-white">
            {title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>

        {total > 0 && (
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-emerald-400">
                <CheckCircle2 size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Aciertos</span>
              </div>
              <p className="text-2xl font-extrabold text-emerald-400">{sessionHits}</p>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-rose-400">
                <XCircle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Errores</span>
              </div>
              <p className="text-2xl font-extrabold text-rose-400">{sessionMisses}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-center space-y-1 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Precisión
              </span>
              <p className={`text-2xl font-extrabold ${percentageColor}`}>
                {percentage}%
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={onPrimary}
            className="rounded-xl bg-violet-600 px-4 py-2 font-semibold !text-white transition-colors hover:bg-violet-500"
          >
            {primaryLabel}
          </button>

          <button
            onClick={onSecondary}
            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-violet-500 dark:hover:text-white"
          >
            {secondaryLabel}
          </button>
        </div>

      </div>
    </div>
  );
}