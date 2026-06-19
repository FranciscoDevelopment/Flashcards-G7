import { HelpCircle } from 'lucide-react';
import type { Card } from '../types';

interface FlashcardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div 
      onClick={onFlip}
      className="w-full max-w-2xl h-80 cursor-pointer perspective-1000 group mx-auto"
    >
      <div 
        className={`w-full h-full relative duration-500 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between p-8 backface-hidden group-hover:border-slate-700/80 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Front Side (Question)</span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
              Box {card.box}
            </span>
          </div>

          {/* Question Text */}
          <div className="flex-1 flex items-center justify-center text-center px-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 leading-relaxed max-h-48 overflow-y-auto pr-2">
              {card.front}
            </h2>
          </div>

          {/* Footer instruction */}
          <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-medium">
            <HelpCircle size={14} />
            <span>Click card to reveal answer</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full rounded-3xl bg-slate-900 border border-violet-900/50 shadow-2xl flex flex-col justify-between p-8 backface-hidden rotate-y-180 group-hover:border-violet-800/80 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between text-violet-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Back Side (Answer)</span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-violet-600/10 text-violet-300 border border-violet-500/20">
              Reviewing
            </span>
          </div>

          {/* Answer Text */}
          <div className="flex-1 flex items-center justify-center text-center px-4 py-2">
            <p className="text-base md:text-lg text-slate-200 leading-relaxed font-normal max-h-48 overflow-y-auto pr-2 whitespace-pre-wrap">
              {card.back}
            </p>
          </div>

          {/* Footer instruction */}
          <div className="flex items-center justify-center gap-1.5 text-violet-400/80 text-xs font-medium">
            <HelpCircle size={14} />
            <span>Click again to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}
