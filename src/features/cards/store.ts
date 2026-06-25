import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Card } from './types';
import { INITIAL_SEED_CARDS } from './seed';

// Define the interface describing the store's data and actions
interface CardState {
  // State (Data)
  cards: Card[];

  // I1 Actions (D1 - Basic CRUD)
  addCard: (newCard: Omit<Card, 'id' | 'hits' | 'misses' | 'history' | 'createdAt' | 'lastReviewedAt'>) => void;
  editCard: (id: string, updatedFields: Partial<Omit<Card, 'id'>>) => void;
  deleteCard: (id: string) => void;

  // Additional utility actions
  resetCards: () => void;

  // I3 Actions (D3 - Metrics tracking)
  recordResult: (id: string, result: 'hit' | 'miss') => void;
  resetCardMetrics: (id: string) => void;
}

// Create the Store using the 'persist' middleware
export const useCardStore = create<CardState>()(
  persist(
    (set) => ({
      // INITIAL LOAD: Inject seed data into the base state
      cards: INITIAL_SEED_CARDS,

      // CRUD Actions

      /** Creates a card by adding auto-generated and initial fields */
      addCard: (newCard) =>
        set((state) => ({
          cards: [
            ...state.cards,
            {
              ...newCard,
              id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`, // Safe fallback ID generator for non-HTTPS contexts
              hits: 0,                 // Initialize to 0 for I3 and I4
              misses: 0,               // Initialize to 0 for I3 and I4
              history: [],              
              createdAt: new Date().toISOString(), // Current creation date
            },
          ],
        })),

      /** Updates the allowed fields of an existing card by its ID */
      editCard: (id, updatedFields) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, ...updatedFields } : card
          ),
        })),

      /** Removes a card from the array by filtering it out by ID */
      deleteCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
        })),

      /** Resets flashcards back to the initial seed data */
      resetCards: () =>
        set(() => ({
          cards: INITIAL_SEED_CARDS,
        })),

      /** Records a hit or miss for the card and updates the last review date */
      recordResult: (id, result) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id
              ? {
                  ...card,
                  hits: result === 'hit' ? card.hits + 1 : card.hits,
                  misses: result === 'miss' ? card.misses + 1 : card.misses,
                  history: [...(card.history ?? []), result],
                  lastReviewedAt: new Date().toISOString(),
                }
              : card
          ),
        })),

      /** Resets the hits and misses for a specific card (action available from the metrics modal) */
      resetCardMetrics: (id) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id
              ? { ...card, hits: 0, misses: 0, history: [], lastReviewedAt: undefined }
              : card
          ),
        })),
    }),
    {
      // Unique key name to identify this data in the browser's localStorage
      name: 'smart-flashcards-storage',
    }
  )
);
