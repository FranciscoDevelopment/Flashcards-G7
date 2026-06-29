import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isToday, isYesterday } from 'date-fns';

interface SessionEntry {
  date: string;
  hits: number;
  misses: number;
}

interface ProgressState {
  currentStreak: number;
  bestStreak: number;
  lastStudyDate: string | null;
  sessionHistory: SessionEntry[];
  registerSession: (hits: number, misses: number) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      bestStreak: 0,
      lastStudyDate: null,
      sessionHistory: [],

      registerSession: (hits, misses) => {
        const { currentStreak, bestStreak, lastStudyDate, sessionHistory } = get();
        const today = new Date();

        // Si ya estudió hoy, solo agrega la sesión sin tocar la racha
        if (lastStudyDate && isToday(new Date(lastStudyDate))) {
          set({
            sessionHistory: [
              ...sessionHistory,
              { date: today.toISOString(), hits, misses },
            ],
          });
          return;
        }

        // Si estudió ayer la racha sigue, si no reinicia a 1
        const newStreak =
          lastStudyDate && isYesterday(new Date(lastStudyDate))
            ? currentStreak + 1
            : 1;

        set({
          currentStreak: newStreak,
          bestStreak: Math.max(newStreak, bestStreak),
          lastStudyDate: today.toISOString(),
          sessionHistory: [
            ...sessionHistory,
            { date: today.toISOString(), hits, misses },
          ],
        });
      },
    }),
    { name: 'progress-storage' }
  )
);