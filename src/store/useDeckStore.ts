import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Card, Deck, StudySessionLog } from '../types';
import { reviewCard as calculateLeitnerReview } from '../utils/leitner';

interface DeckState {
  decks: Deck[];
  cards: Card[];
  logs: StudySessionLog[];
  
  // Deck actions
  addDeck: (name: string, description: string, color: string) => string;
  updateDeck: (id: string, name: string, description: string, color: string) => void;
  deleteDeck: (id: string) => void;
  
  // Card actions
  addCard: (deckId: string, front: string, back: string) => string;
  updateCard: (id: string, front: string, back: string) => void;
  deleteCard: (id: string) => void;
  
  // Review actions
  submitReview: (cardId: string, success: boolean) => void;
  
  // Bulk Actions
  importData: (decks: Deck[], cards: Card[]) => void;
  resetAll: () => void;
}

// Initial demo data to populate the dashboard right away
const initialDecks: Deck[] = [
  {
    id: 'deck-web-dev',
    name: 'Frontend Web Development',
    description: 'Master core concepts of React, JavaScript, CSS, and general web technologies.',
    color: 'from-blue-600 via-indigo-600 to-violet-600',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'deck-spaced-rep',
    name: 'Spaced Repetition Theory',
    description: 'Learn how Leitner and memory retrieval work to optimize your study habits.',
    color: 'from-emerald-500 via-teal-600 to-cyan-600',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'deck-javascript-tricks',
    name: 'JavaScript Tricky Bits',
    description: 'Tricky JavaScript closures, scopes, arrays, and asynchronous questions.',
    color: 'from-amber-500 via-orange-500 to-rose-600',
    createdAt: new Date().toISOString(),
  }
];

const initialCards: Card[] = [
  // Web Dev Deck
  {
    id: 'card-1',
    deckId: 'deck-web-dev',
    front: 'What is the purpose of React\'s virtual DOM?',
    back: 'It acts as a lightweight copy of the real DOM. React updates the virtual DOM first, compares it with a snapshot using a diffing algorithm, and then performs a minimal batch update to the real DOM for high performance.',
    box: 1,
    nextReview: new Date().toISOString(),
    lastReviewed: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'card-2',
    deckId: 'deck-web-dev',
    front: 'What is the difference between `==` and `===` in JavaScript?',
    back: '`==` performs type coercion before comparing value equality, while `===` checks both value equality and type equality strictly without coercion.',
    box: 2,
    nextReview: new Date().toISOString(),
    lastReviewed: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'card-3',
    deckId: 'deck-web-dev',
    front: 'Explain CSS flexbox layout and its main axis alignment property.',
    back: 'Flexbox is a 1-dimensional layout model for distributing space. The primary axis alignment is controlled via `justify-content`, which accepts values like `flex-start`, `center`, `space-between`, and `space-around`.',
    box: 1,
    nextReview: new Date().toISOString(),
    lastReviewed: null,
    createdAt: new Date().toISOString(),
  },
  
  // Spaced Repetition Deck
  {
    id: 'card-4',
    deckId: 'deck-spaced-rep',
    front: 'Explain the basic mechanism of the Leitner Spaced Repetition System.',
    back: 'Flashcards are sorted into boxes depending on how well the learner knows them. When correct, the card goes to the next box (increases study interval). When incorrect, it returns to box 1 (requires more frequent study).',
    box: 1,
    nextReview: new Date().toISOString(),
    lastReviewed: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'card-5',
    deckId: 'deck-spaced-rep',
    front: 'What is the "forgetting curve" and how does active retrieval combat it?',
    back: 'The forgetting curve shows how memory retention decays over time. Reviewing a card just before forgetting forces active cognitive retrieval, which strengthens synaptic pathways and flattens the forgetting curve.',
    box: 3,
    nextReview: new Date().toISOString(),
    lastReviewed: null,
    createdAt: new Date().toISOString(),
  },

  // JS Tricks Deck
  {
    id: 'card-6',
    deckId: 'deck-javascript-tricks',
    front: 'What does `typeof null` evaluate to in JavaScript, and why?',
    back: 'It returns `"object"`. This is a historic, widely acknowledged bug in JavaScript that was never fixed to preserve backward compatibility.',
    box: 1,
    nextReview: new Date().toISOString(),
    lastReviewed: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'card-7',
    deckId: 'deck-javascript-tricks',
    front: 'What is a closure in JavaScript?',
    back: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). Closures allow an inner function to access the scope of an outer function even after the outer function has returned.',
    box: 1,
    nextReview: new Date().toISOString(),
    lastReviewed: null,
    createdAt: new Date().toISOString(),
  }
];

export const useDeckStore = create<DeckState>()(
  persist(
    (set) => ({
      decks: initialDecks,
      cards: initialCards,
      logs: [],

      // Deck actions
      addDeck: (name, description, color) => {
        const id = `deck-${Date.now()}`;
        const newDeck: Deck = {
          id,
          name,
          description,
          color: color || 'from-blue-600 via-indigo-600 to-violet-600',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ decks: [...state.decks, newDeck] }));
        return id;
      },

      updateDeck: (id, name, description, color) => {
        set((state) => ({
          decks: state.decks.map((deck) =>
            deck.id === id ? { ...deck, name, description, color } : deck
          ),
        }));
      },

      deleteDeck: (id) => {
        set((state) => ({
          decks: state.decks.filter((deck) => deck.id !== id),
          cards: state.cards.filter((card) => card.deckId !== id),
          logs: state.logs.filter((log) => log.deckId !== id),
        }));
      },

      // Card actions
      addCard: (deckId, front, back) => {
        const id = `card-${Date.now()}`;
        const newCard: Card = {
          id,
          deckId,
          front,
          back,
          box: 1,
          nextReview: new Date().toISOString(),
          lastReviewed: null,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ cards: [...state.cards, newCard] }));
        return id;
      },

      updateCard: (id, front, back) => {
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, front, back } : card
          ),
        }));
      },

      deleteCard: (id) => {
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
          logs: state.logs.filter((log) => log.cardId !== id),
        }));
      },

      // Spaced Repetition Review
      submitReview: (cardId, success) => {
        set((state) => {
          const cardIndex = state.cards.findIndex((c) => c.id === cardId);
          if (cardIndex === -1) return {};

          const targetCard = state.cards[cardIndex];
          const updatedCard = calculateLeitnerReview(targetCard, success);

          const newLog: StudySessionLog = {
            id: `log-${Date.now()}`,
            deckId: targetCard.deckId,
            cardId: targetCard.id,
            timestamp: new Date().toISOString(),
            rating: success ? 'correct' : 'incorrect',
            previousBox: targetCard.box,
            newBox: updatedCard.box,
          };

          const newCards = [...state.cards];
          newCards[cardIndex] = updatedCard;

          return {
            cards: newCards,
            logs: [newLog, ...state.logs],
          };
        });
      },

      importData: (decks, cards) => {
        set({ decks, cards, logs: [] });
      },

      resetAll: () => {
        set({ decks: initialDecks, cards: initialCards, logs: [] });
      },
    }),
    {
      name: 'leitner-flashcards-storage',
    }
  )
);
