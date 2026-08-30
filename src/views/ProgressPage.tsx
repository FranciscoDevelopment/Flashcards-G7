'use client';

import Link from 'next/link';
import { ArrowLeft, Flame, Trophy, CheckCircle2, XCircle, TrendingUp, Calendar } from 'lucide-react';
import { useProgressStats } from '../features/progress/hooks/useProgressStats';

export default function ProgressPage() {
  const {
    currentStreak,
    bestStreak,
    totalHits,
    totalMisses,
    totalAnswers,
    accuracyPercentage,
    sessionHistory,
  } = useProgressStats();

  const barColor =
    accuracyPercentage >= 70
      ? 'bg-emerald-500'
      : accuracyPercentage >= 40
        ? 'bg-amber-500'
        : totalAnswers === 0
          ? 'bg-slate-700'
          : 'bg-rose-500';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          aria-label="Volver al inicio"
          className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-white">Tu progreso</h2>
          <p className="text-sm text-slate-400">Estadísticas generales y rachas de estudio.</p>
        </div>
      </div>

      {/* Tarjetas superiores: racha actual, mejor racha, progreso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-orange-400">
            <Flame size={20} />
            <p className="text-xs font-bold uppercase tracking-wider">Racha actual</p>
          </div>
          <p className="text-4xl font-extrabold text-white">
            {currentStreak} <span className="text-lg font-semibold text-slate-400">días</span>
          </p>
          {currentStreak === 0 && (
            <p className="text-xs text-slate-500">Completá un quiz para iniciar tu racha.</p>
          )}
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-yellow-400">
            <Trophy size={20} />
            <p className="text-xs font-bold uppercase tracking-wider">Mejor racha</p>
          </div>
          <p className="text-4xl font-extrabold text-white">
            {bestStreak} <span className="text-lg font-semibold text-slate-400">días</span>
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-violet-400">
            <TrendingUp size={20} />
            <p className="text-xs font-bold uppercase tracking-wider">Progreso general</p>
          </div>
          <p className="text-4xl font-extrabold text-white">{accuracyPercentage}%</p>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${accuracyPercentage}%` }}
            />
          </div>
        </div>

      </div>

      {/* Desempeño general */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Desempeño general
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-emerald-400">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Aciertos</span>
            </div>
            <p className="text-2xl font-extrabold text-emerald-400">{totalHits}</p>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-rose-400">
              <XCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Errores</span>
            </div>
            <p className="text-2xl font-extrabold text-rose-400">{totalMisses}</p>
          </div>
          <div className="rounded-xl border border-slate-500/20 bg-slate-500/5 p-4 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
             Total respuestas
            </span>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{totalAnswers}</p>
          </div>
        </div>
      </div>

      {/* Sesiones recientes */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar size={16} />
          <h2 className="text-sm font-bold uppercase tracking-wider">Sesiones recientes</h2>
        </div>

        {sessionHistory.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            Todavía no completaste ningún quiz.
          </p>
        ) : (
          <div className="space-y-2">
            {[...sessionHistory].reverse().slice(0, 10).map((session, index) => {
              const total = session.hits + session.misses;
              const pct = total === 0 ? 0 : Math.round((session.hits / total) * 100);
              const date = new Date(session.date).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
              return (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 rounded-xl border border-slate-500/20 bg-slate-500/5 px-4 py-3 text-sm"
                >
                  <p className="text-slate-500">{date}</p>
                  <p className="text-emerald-500 font-semibold">{session.hits} aciertos</p>
                  <p className="text-rose-500 font-semibold">{session.misses} errores</p>
                  <p className="text-slate-800 dark:text-white font-bold">{pct}%</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
