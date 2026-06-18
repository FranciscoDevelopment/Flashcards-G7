import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckId: string;
  cardIdToEdit?: string | null;
}

export default function AddCardModal({ isOpen, onClose, deckId, cardIdToEdit }: AddCardModalProps) {
  const { addCard, updateCard, cards } = useDeckStore((state) => ({
    addCard: state.addCard,
    updateCard: state.updateCard,
    cards: state.cards,
  }));

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const isEditing = !!cardIdToEdit;

  useEffect(() => {
    if (isEditing && cardIdToEdit) {
      const card = cards.find((c) => c.id === cardIdToEdit);
      if (card) {
        setFront(card.front);
        setBack(card.back);
      }
    } else {
      setFront('');
      setBack('');
    }
  }, [cardIdToEdit, isEditing, cards, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    if (isEditing && cardIdToEdit) {
      updateCard(cardIdToEdit, front, back);
    } else {
      addCard(deckId, front, back);
    }

    setFront('');
    setBack('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h3 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Flashcard' : 'Add Flashcard'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Front Side (Question / Concept)</label>
            <textarea
              required
              rows={4}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="e.g. What is the time complexity of searching a binary search tree in the worst case?"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Back Side (Answer / Details)</label>
            <textarea
              required
              rows={4}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="e.g. O(n). This occurs when the tree is unbalanced, resembling a linked list."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500 active:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20"
            >
              {isEditing ? 'Save Changes' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
