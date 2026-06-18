import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Play, Calendar, Trash2, Edit2, 
  Search, HelpCircle, Layers, Check, X, RefreshCw, Trophy 
} from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';
import Flashcard from '../components/Flashcard';
import { isCardDue, getCardDueStatus } from '../utils/leitner';

export default function FlashcardsPage() {
  const { deckId } = useParams<{ deckId: string }>();
  
  const { decks, cards, deleteCard, submitReview } = useDeckStore((state) => ({
    decks: state.decks,
    cards: state.cards,
    deleteCard: state.deleteCard,
    submitReview: state.submitReview,
  }));

  const deck = decks.find((d) => d.id === deckId);
  const deckCards = cards.filter((c) => c.deckId === deckId);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- STUDY MODE STATE ---
  const [isStudying, setIsStudying] = useState(false);
  const [studyStack, setStudyStack] = useState<typeof deckCards>([]);
  const [isDueOnly, setIsDueOnly] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Session Metrics
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize/refresh study stack when study mode is triggered
  const startStudySession = () => {
    if (deckCards.length === 0) return;
    
    const due = deckCards.filter(isCardDue);
    if (due.length > 0) {
      setStudyStack(due);
      setIsDueOnly(true);
    } else {
      setStudyStack(deckCards);
      setIsDueOnly(false);
    }
    
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCorrect(0);
    setSessionReviewed(0);
    setIsFinished(false);
    setIsStudying(true);
  };

  // Keyboard shortcut listener for active study session
  useEffect(() => {
    if (!isStudying || isFinished || studyStack.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [isStudying, isFlipped, isFinished, studyStack, currentIndex]);

  if (!deck) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-100 bg-slate-950">
        <h3 className="text-xl font-bold">Mazo no encontrado</h3>
        <Link to="/" className="text-violet-400 hover:underline mt-4 flex items-center gap-1.5">
          <ArrowLeft size={16} /> Volver al Inicio
        </Link>
      </div>
    );
  }

  const filteredCards = deckCards.filter(
    (card) =>
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dueCount = deckCards.filter(isCardDue).length;

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
      deleteCard(cardId);
    }
  };

  const handleResponse = (success: boolean) => {
    const activeCard = studyStack[currentIndex];
    if (!activeCard) return;

    // 1. Submit progress to store
    submitReview(activeCard.id, success);

    // 2. Log session metrics
    if (success) setSessionCorrect((c) => c + 1);
    setSessionReviewed((r) => r + 1);

    // 3. Move to next card or finish
    setIsFlipped(false);
    
    setTimeout(() => {
      if (currentIndex + 1 < studyStack.length) {
        setCurrentIndex((idx) => idx + 1);
      } else {
        setIsFinished(true);
      }
    }, 200);
  };

  // --- STUDY MODE RENDER ---
  if (isStudying) {
    if (isFinished) {
      const accuracy = sessionReviewed > 0 ? Math.round((sessionCorrect / sessionReviewed) * 100) : 0;
      
      return (
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center justify-center bg-slate-950 text-slate-100">
          <div className="w-full max-w-md rounded-3xl border border-slate-900 bg-slate-900/20 p-8 text-center space-y-8 shadow-2xl">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-violet-600/30 animate-bounce">
              <Trophy size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">¡Sesión Completada!</h2>
              <p className="text-slate-400 text-sm">
                ¡Gran trabajo! Has terminado de revisar esta pila de estudio.
              </p>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-900 py-6">
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Revisadas</div>
                <div className="text-xl font-black text-white mt-1">{sessionReviewed} tarjetas</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Aciertos</div>
                <div className="text-xl font-black text-emerald-400 mt-1">{accuracy}%</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={startStudySession}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-violet-600/20 active:scale-[0.98]"
              >
                <RefreshCw size={16} />
                Estudiar de Nuevo
              </button>

              <button
                onClick={() => setIsStudying(false)}
                className="w-full flex items-center justify-center gap-2 border border-slate-800 hover:bg-slate-900 text-slate-300 font-semibold text-sm py-3 px-4 rounded-xl transition-colors"
              >
                <ArrowLeft size={16} />
                Regresar al Mazo
              </button>
            </div>
          </div>
        </div>
      );
    }

    const totalCards = studyStack.length;
    const studyProgressPercent = totalCards > 0 ? Math.round((currentIndex / totalCards) * 100) : 0;
    const activeCard = studyStack[currentIndex];

    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col justify-between bg-slate-950 text-slate-100 min-h-screen">
        {/* Upper Navigation & Stats */}
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setIsStudying(false)}
              className="text-slate-400 hover:text-white inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            >
              <ArrowLeft size={16} /> Salir del Repaso
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isDueOnly ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-900 text-slate-400'
              }`}>
                {isDueOnly ? 'Solo Pendientes' : 'Pila Completa'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-2xl mx-auto space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <span>Tarjeta {currentIndex + 1} de {totalCards}</span>
              <span>{studyProgressPercent}% completado</span>
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
        {activeCard ? (
          <div className="my-8 flex items-center justify-center flex-1">
            <Flashcard
              card={activeCard}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 text-sm">
            Error al cargar la tarjeta actual.
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
                Revelar Respuesta
              </button>
              <div className="text-[11px] text-slate-500 mt-2 font-medium">
                Tip: Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 font-mono text-[9px] text-slate-400">Espacio</kbd> para voltear
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
                  Olvidada (1)
                </button>

                <button
                  onClick={() => handleResponse(true)}
                  className="flex items-center justify-center gap-2 bg-emerald-600/10 border border-emerald-950/50 hover:bg-emerald-600/20 text-emerald-400 font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg hover:shadow-emerald-950/20 active:scale-95 text-sm uppercase tracking-wider"
                >
                  <Check size={18} />
                  Recordada (2)
                </button>
              </div>
              
              <div className="text-center text-[10px] text-slate-505 font-semibold tracking-wider uppercase">
                Teclado: <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-850">←</kbd> / <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-850">1</kbd> para olvidar, <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-850">→</kbd> / <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-850">2</kbd> para recordar
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DECK DETAILS (LIST MODE) RENDER ---
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation & Header */}
      <div className="space-y-4 shrink-0">
        <Link to="/" className="text-slate-400 hover:text-white inline-flex items-center gap-2 text-sm font-semibold transition-colors">
          <ArrowLeft size={16} /> Volver al Dashboard
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-900 pb-6">
          <div className="flex gap-4">
            <div className={`w-2.5 rounded-full bg-gradient-to-b ${deck.color} shrink-0`} />
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{deck.name}</h2>
              <p className="text-slate-400 mt-2 max-w-2xl leading-relaxed">{deck.description || 'Sin descripción disponible.'}</p>
            </div>
          </div>
          
          <div className="flex gap-3 self-start lg:self-auto shrink-0">
            <Link
              to={`/deck/${deck.id}/new`}
              className="flex items-center justify-center gap-2 border border-slate-800 hover:bg-slate-900 text-slate-200 font-semibold text-sm px-5 py-3 rounded-xl transition-all active:scale-[0.98]"
            >
              <Plus size={18} />
              Agregar Tarjeta
            </Link>

            <button
              onClick={startStudySession}
              disabled={deckCards.length === 0}
              className={`flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                deckCards.length === 0
                  ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-transparent'
                  : dueCount > 0
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/20'
                  : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800'
              }`}
            >
              <Play size={16} fill={deckCards.length > 0 ? 'currentColor' : 'none'} />
              {dueCount > 0 ? `Estudiar Pendientes (${dueCount})` : deckCards.length === 0 ? 'Sin Tarjetas' : 'Repasar Todo'}
            </button>
          </div>
        </div>
      </div>

      {/* Main List Section */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Tarjetas del Mazo</h3>
            <p className="text-xs text-slate-500 mt-0.5">Mostrando {filteredCards.length} de {deckCards.length} tarjetas</p>
          </div>

          {/* Search Card */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tarjetas..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/20 text-sm text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {filteredCards.length > 0 ? (
          <div className="space-y-4">
            {filteredCards.map((card, idx) => {
              const due = isCardDue(card);
              return (
                <div 
                  key={card.id} 
                  className="rounded-2xl border border-slate-900 bg-slate-900/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-800/80 hover:bg-slate-900/20 transition-all duration-300"
                >
                  <div className="flex-1 space-y-4">
                    {/* Top Row - Index and Box Status */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono text-slate-600">#{idx + 1}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400">
                        <Layers size={11} />
                        Caja {card.box}
                      </span>
                      <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                        due ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        <Calendar size={11} />
                        {getCardDueStatus(card)}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Frente (Pregunta / Concepto)</div>
                        <p className="text-sm text-slate-200 font-medium line-clamp-3 leading-relaxed">{card.front}</p>
                      </div>
                      <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-900 pt-3 md:pt-0 md:pl-4">
                        <div className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Dorso (Respuesta / Detalles)</div>
                        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{card.back}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex md:flex-col gap-2 shrink-0 md:border-l border-slate-900/60 md:pl-4 justify-end">
                    <Link
                      to={`/deck/${deck.id}/edit/${card.id}`}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                      title="Editar tarjeta"
                    >
                      <Edit2 size={13} />
                      <span className="md:hidden text-slate-300">Editar</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 border border-slate-800 text-slate-500 hover:text-rose-450 hover:bg-rose-500/5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                      title="Eliminar tarjeta"
                    >
                      <Trash2 size={13} />
                      <span className="md:hidden">Eliminar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-slate-900 rounded-3xl bg-slate-900/5">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-505 mx-auto mb-4">
              <HelpCircle size={22} />
            </div>
            <h4 className="text-lg font-bold text-slate-300">No hay tarjetas en este mazo</h4>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
              {searchTerm ? 'No se encontraron coincidencias.' : 'Crea tu primera tarjeta de pregunta/respuesta para empezar a estudiar.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
