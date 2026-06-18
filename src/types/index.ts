export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  box: number; // 1 to 5
  nextReview: string; // ISO date string
  lastReviewed: string | null; // ISO date string
  createdAt: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  color: string; // Gradient key or hex
  createdAt: string;
}

export interface StudySessionLog {
  id: string;
  deckId: string;
  cardId: string;
  timestamp: string;
  rating: 'correct' | 'incorrect';
  previousBox: number;
  newBox: number;
}
