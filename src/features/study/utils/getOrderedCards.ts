import type { Card } from '../../cards/types';

export function getCardPriorityScore(card: Card): number {
  const { hits, misses, history } = card;
  const total = hits + misses;

  if (total === 0) return 50;

  const errorRate = misses / total;

  const recentHistory = history.slice(-3);
  const recentErrors = recentHistory.filter(h => h === 'miss').length;
  const recencyMultiplier = recentErrors * 15;

  const score = (errorRate * 50) + (Math.min(misses, 5) * 4) + recencyMultiplier;

  return Math.min(Math.round(score), 100);
}

export function getOrderedCards(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    return getCardPriorityScore(b) - getCardPriorityScore(a);
  });
}