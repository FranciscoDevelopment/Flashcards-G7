import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ReviewLayoutProps {
  children: ReactNode;
  subtitle?: string;
  variant?: 'selector' | 'session' | 'finished';
  backLabel?: string;
  onBack?: () => void;
}

export default function ReviewLayout({
  children,
  subtitle,
  variant = 'session',
  backLabel = 'Volver al Inicio',
  onBack,
}: ReviewLayoutProps) {

  const isSelector = variant === 'selector';
  const isFinished = variant === 'finished';

  return (
    <>
      <div
        className={
          isSelector
            ? 'mx-auto mt-14 w-full max-w-4xl px-6'
            : isFinished
              ? 'mx-auto mt-16 w-full max-w-5xl px-12'
              : 'mx-auto mt-9 w-full max-w-5xl px-12'
        }
      >
        <div
          className={
            isSelector
              ? 'flex items-start justify-between gap-6'
              : 'ml-8 flex items-start justify-between gap-6'
          }
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Modo Repaso
            </h1>

            {subtitle && (
              <p
                className={`text-slate-600 dark:text-slate-400 ${isSelector ? 'mt-4' : 'mt-2'
                  }`}
              >
                {subtitle}
              </p>
            )}
          </div>

          {onBack ? (
            <button
              onClick={onBack}
              className="mr-16 mt-4 text-sm text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"
            >
              ← {backLabel}
            </button>
          ) : (
            <Link
              to="/"
              className={`text-sm text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300 ${isFinished ? 'mr-12 mt-4' : 'mt-1'
                }`}
            >
              ← {backLabel}
            </Link>
          )}
        </div>
      </div>

      <div
        className={
          isSelector
            ? 'flex flex-1 justify-center pt-9 pb-8'
            : 'flex flex-1 justify-center pt-8 pb-8'
        }
      >
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </div>
    </>
  );
}