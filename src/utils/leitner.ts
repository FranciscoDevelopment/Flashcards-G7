import type { Card } from '../types';

// Box intervals in days
export const BOX_INTERVALS: { [key: number]: number } = {
  1: 1,  // 1 day
  2: 2,  // 2 days
  3: 5,  // 5 days
  4: 9,  // 9 days
  5: 15, // 15 days
};

/**
 * Simulates review of a card and determines its new box and next review time.
 */
export function reviewCard(card: Card, success: boolean): Card {
  const previousBox = card.box;
  const newBox = success ? Math.min(5, previousBox + 1) : 1;

  const daysInterval = BOX_INTERVALS[newBox];
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + daysInterval);

  return {
    ...card,
    box: newBox,
    lastReviewed: new Date().toISOString(),
    nextReview: nextReviewDate.toISOString(),
  };
}

/**
 * Checks if a card is due for study.
 */
export function isCardDue(card: Card): boolean {
  return new Date(card.nextReview) <= new Date();
}

/**
 * Helper to get a human readable message about when a card is due.
 */
export function getCardDueStatus(card: Card): string {
  const now = new Date();
  const next = new Date(card.nextReview);
  
  if (next <= now) return 'Due now';
  
  const diffMs = next.getTime() - now.getTime();
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    return `Due in ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`;
  }
  
  const diffDays = Math.ceil(diffHours / 24);
  return `Due in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
}
