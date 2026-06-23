type StudyFinishedProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
};

export default function StudyFinished({
  eyebrow,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: StudyFinishedProps) {
  return (
    <div className="mx-auto flex min-h-[55vh] items-center justify-center">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-900 dark:bg-slate-900/20">
        {eyebrow && (
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-300">
            {eyebrow}
          </p>
        )}

        <h2 className="mb-6 text-2xl font-bold text-slate-950 dark:text-white">
          {title}
        </h2>

        <p className="mb-10 text-slate-600 dark:text-slate-400">
          {description}
        </p>

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