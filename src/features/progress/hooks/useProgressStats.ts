import { useCardStore } from '../../cards/store';
import { useProgressStore } from '../store/useProgresseStore';

export function useProgressStats() {
  const cards = useCardStore((state) => state.cards);
  const { currentStreak, bestStreak, sessionHistory } = useProgressStore();

  // Lee hits y misses acumulados de todas las tarjetas (los registró D3)
  const totalHits = cards.reduce((acc, card) => acc + card.hits, 0);
  const totalMisses = cards.reduce((acc, card) => acc + card.misses, 0);
  const totalAnswers = totalHits + totalMisses;

  const accuracyPercentage =
    totalAnswers === 0
      ? 0
      : Math.round((totalHits / totalAnswers) * 100);

  return {
    currentStreak,
    bestStreak,
    totalHits,
    totalMisses,
    totalAnswers,
    accuracyPercentage,
    sessionHistory,
  };
}