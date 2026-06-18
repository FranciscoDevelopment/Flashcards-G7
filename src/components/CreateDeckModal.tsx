import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GRADIENTS = [
  { name: 'Indigo Dream', value: 'from-violet-600 via-indigo-600 to-blue-600' },
  { name: 'Emerald Wave', value: 'from-teal-500 via-emerald-600 to-green-600' },
  { name: 'Sunset Glow', value: 'from-rose-500 via-orange-500 to-amber-500' },
  { name: 'Cyber Neon', value: 'from-cyan-500 via-violet-600 to-fuchsia-600' },
  { name: 'Fuchsia Fire', value: 'from-pink-500 via-purple-600 to-indigo-600' },
];

export default function CreateDeckModal({ isOpen, onClose }: CreateDeckModalProps) {
  const addDeck = useDeckStore((state) => state.addDeck);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(GRADIENTS[0].value);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addDeck(name, description, color);
    setName('');
    setDescription('');
    setColor(GRADIENTS[0].value);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <h3 className="text-xl font-bold text-white">Create New Deck</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Deck Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spanish Vocabulary"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you studying in this deck?"
              rows={3}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Theme Theme</label>
            <div className="grid grid-cols-5 gap-2">
              {GRADIENTS.map((grad) => (
                <button
                  key={grad.value}
                  type="button"
                  onClick={() => setColor(grad.value)}
                  className={`h-12 w-full rounded-xl bg-gradient-to-br ${grad.value} relative transition-transform hover:scale-105 active:scale-95 flex items-center justify-center`}
                  title={grad.name}
                >
                  {color === grad.value && (
                    <span className="h-3 w-3 rounded-full bg-white shadow-md border border-black/20" />
                  )}
                </button>
              ))}
            </div>
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
              Create Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
