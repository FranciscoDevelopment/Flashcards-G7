import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, RefreshCw, Trophy } from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';
import Flashcard from '../components/Flashcard';
import { isCardDue } from '../utils/leitner';

export default function StudySession() {
  const { deckId } = useParams<{ deckId: string }>();
  const { decks, cards, submitReview } = useDeckStore((state) => ({
    decks: state.decks,
    cards: state.cards,
    submitReview: state.submitReview,
  }));

  const deck = decks.find((d) => d.id === deckId);
  const deckCards = cards.filter((c) => c.deckId === deckId);

  // Determine study stack: due cards first, fallback to all cards if none are due
  const [studyStack, setStudyStack] = useState<typeof deckCards>([]);
  const [isDueOnly, setIsDueOnly] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Session Stats
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (deckCards.length > 0) {
      const due = deckCards.filter(isCardDue);
      if (due.length > 0) {
        setStudyStack(due);
        setIsDueOnly(true);
      } else {
        setStudyStack(deckCards);
        setIsDueOnly(false);
      }
    }
  }, [deckId]); // Run once on load for this deck

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || studyStack.length === 0) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1' || e.code === 'ArrowLeft' || e.key === 'n') {
          handleResponse(false);
        } else if (e.key === '2' || e.code === 'ArrowRight' || e.key === 'y') {
          handleResponse(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isFinished, studyStack, currentIndex]);

  if (!deck) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-100 bg-slate-950">
        <h3 className="text-xl font-bold">Deck not found</h3>
        <Link to="/" className="text-violet-400 hover:underline mt-4 flex items-center gap-1.5">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  if (deckCards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-100 bg-slate-950">
        <h3 className="text-xl font-bold">No cards in this deck</h3>
        <p className="text-slate-400 mt-2">Add some cards to this deck first before studying.</p>
        <Link to={`/deck/${deck.id}`} className="text-violet-400 hover:underline mt-4 flex items-center gap-1.5">
          <ArrowLeft size={16} /> Back to Deck Details
        </Link>
      </div>
    );
  }

  const activeCard = studyStack[currentIndex];
  const totalCards = studyStack.length;

  const handleResponse = (success: boolean) => {
    // 1. Submit progress to store
    submitReview(activeCard.id, success);

    // 2. Log session metrics
    if (success) setSessionCorrect((c) => c + 1);
    setSessionReviewed((r) => r + 1);

    // 3. Move to next card or finish
    setIsFlipped(false);
    
    // Timeout gives card time to rotate back before rendering next question
    setTimeout(() => {
      if (currentIndex + 1 < totalCards) {
        setCurrentIndex((idx) => idx + 1);
      } else {
        setIsFinished(true);
      }
    }, 200);
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCorrect(0);
    setSessionReviewed(0);
    setIsFinished(false);
    // Refresh the study stack
    const due = deckCards.filter(isCardDue);
    if (due.length > 0) {
      setStudyStack(due);
      setIsDueOnly(true);
    } else {
      setStudyStack(deckCards);
      setIsDueOnly(false);
    }
  };

  // Completion Screen layout
  if (isFinished) {
    const accuracy = sessionReviewed > 0 ? Math.round((sessionCorrect / sessionReviewed) * 100) : 0;
    
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-center bg-slate-950 text-slate-100">
        <div className="w-full max-w-md rounded-3xl border border-slate-900 bg-slate-900/20 p-8 text-center space-y-8 shadow-2xl">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-violet-600/30">
            <Trophy size={32} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Session Completed!</h2>
            <p className="text-slate-400 text-sm">
              Great work! You have finished studying this stack.
            </p>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-900 py-6">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Reviewed</div>
              <div className="text-xl font-black text-white mt-1">{sessionReviewed} cards</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Accuracy</div>
              <div className="text-xl font-black text-emerald-400 mt-1">{accuracy}%</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={restartSession}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-violet-600/20 active:scale-[0.98]"
            >
              <RefreshCw size={16} />
              Study Again
            </button>

            <Link
              to={`/deck/${deck.id}`}
              className="w-full flex items-center justify-center gap-2 border border-slate-800 hover:bg-slate-900 text-slate-300 font-semibold text-sm py-3 px-4 rounded-xl transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Deck details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const studyProgressPercent = totalCards > 0 ? Math.round((currentIndex / totalCards) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col justify-between bg-slate-950 text-slate-100 min-h-screen">
      {/* Upper Navigation & Stats */}
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link to={`/deck/${deck.id}`} className="text-slate-400 hover:text-white inline-flex items-center gap-2 text-sm font-semibold transition-colors">
            <ArrowLeft size={16} /> Exit Session
          </Link>
          <div className="flex items-center gap-3">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              isDueOnly ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-900 text-slate-400'
            }`}>
              {isDueOnly ? 'Due Cards Only' : 'Practice Stack'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Card {currentIndex + 1} of {totalCards}</span>
            <span>{studyProgressPercent}% complete</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-300"
              style={{ width: `${studyProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Flashcard View */}
      {activeCard && (
        <div className="my-8 flex items-center justify-center flex-1">
          <Flashcard
            card={activeCard}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
          />
        </div>
      )}

      {/* Lower controls (Keyboard guides / Quick evaluation) */}
      <div className="w-full max-w-2xl mx-auto pb-4">
        {!isFlipped ? (
          <div className="text-center">
            <button
              onClick={() => setIsFlipped(true)}
              className="bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700/80 px-6 py-3 rounded-2xl text-sm font-semibold hover:text-white transition-all active:scale-95"
            >
              Reveal Answer
            </button>
            <div className="text-[11px] text-slate-500 mt-2 font-medium">
              Pro tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 font-mono text-[9px] text-slate-400">Space</kbd> to flip card
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleResponse(false)}
                className="flex items-center justify-center gap-2 border border-rose-900/50 hover:bg-rose-950/20 text-rose-400 font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg hover:shadow-rose-950/20 active:scale-95 text-sm uppercase tracking-wider"
              >
                <X size={18} />
                Forgot (1)
              </button>

              <button
                onClick={() => handleResponse(true)}
                className="flex items-center justify-center gap-2 bg-emerald-600/10 border border-emerald-950/50 hover:bg-emerald-600/20 text-emerald-400 font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg hover:shadow-emerald-950/20 active:scale-95 text-sm uppercase tracking-wider"
              >
                <Check size={18} />
                Remembered (2)
              </button>
            </div>
            
            <div className="text-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
              Keyboard: <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-850">←</kbd> / <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-850">1</kbd> for forgot, <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-850">→</kbd> / <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-850">2</kbd> for remembered
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
