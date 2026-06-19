import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Card } from './types';
import { INITIAL_SEED_CARDS } from './seed';

// Define the interface describing the store's data and actions
interface CardState {
  // State (Data)
  cards: Card[];

  // I1 Actions (D1 - Basic CRUD)
  addCard: (newCard: Omit<Card, 'id' | 'hits' | 'misses' | 'createdAt' | 'lastReviewedAt'>) => void;
  editCard: (id: string, updatedFields: Partial<Omit<Card, 'id'>>) => void;
  deleteCard: (id: string) => void;

  // Additional utility actions
  resetCards: () => void;

  // RESERVED FOR I3 (D3 - Metrics tracking)
  // Function declared in the interface and mapped below so I3 can work here.
  recordResult: (id: string, result: 'hit' | 'miss') => void;
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

      // SLOT FOR I3 (D3)
      // Structure is ready. When I3 joins the project,
      // they only need to replace this comment with their hits/misses logic.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      recordResult: (_id, _result) =>
        set((state) => ({
          // NOTE FOR I3: Map over 'cards' and increment hits or misses based on 'result'
          cards: state.cards, 
        })),
    }),
    {
      // Unique key name to identify this data in the browser's localStorage
      name: 'smart-flashcards-storage',
    }
  )
);
