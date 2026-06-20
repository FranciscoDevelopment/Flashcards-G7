import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ReviewLayoutProps {
  children: ReactNode;
}

export default function ReviewLayout({ children }: ReviewLayoutProps) {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-16 mt-4">
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white mt-10 ml-8 mb-8">
          Modo repaso
        </h1>
      </div>

      <div className="flex-1 flex justify-center pb-8">
        <div className="w-full max-w-4xl">
          <div className="mb-10 flex justify-end">
            <Link
              to="/"
              className="text-sm text-slate-600 hover:text-violet-600 transition-colors dark:text-slate-400 dark:hover:text-violet-300"
            >
              ← Volver al Inicio
            </Link>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}