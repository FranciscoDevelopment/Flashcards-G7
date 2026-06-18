import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Play, Calendar, Trash2, Edit2, Search, HelpCircle, Layers } from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';
import AddCardModal from '../components/AddCardModal';
import { isCardDue, getCardDueStatus } from '../utils/leitner';

export default function DeckDetails() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const { decks, cards, deleteCard } = useDeckStore((state) => ({
    decks: state.decks,
    cards: state.cards,
    deleteCard: state.deleteCard,
  }));

  const deck = decks.find((d) => d.id === deckId);
  const deckCards = cards.filter((c) => c.deckId === deckId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

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

  const filteredCards = deckCards.filter(
    (card) =>
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dueCards = deckCards.filter(isCardDue);
  const dueCount = dueCards.length;

  const handleEditCard = (cardId: string) => {
    setEditingCardId(cardId);
    setIsAddOpen(true);
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(cardId);
    }
  };

  const handleStudy = () => {
    if (deckCards.length > 0) {
      navigate(`/study/${deck.id}`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-950 text-slate-100">
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Link to="/" className="text-slate-400 hover:text-white inline-flex items-center gap-2 text-sm font-semibold transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-900 pb-6">
          <div className="flex gap-4">
            <div className={`w-2.5 rounded-full bg-gradient-to-b ${deck.color} shrink-0`} />
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{deck.name}</h2>
              <p className="text-slate-400 mt-2 max-w-2xl leading-relaxed">{deck.description || 'No description provided.'}</p>
            </div>
          </div>
          
          <div className="flex gap-3 self-start lg:self-auto shrink-0">
            <button
              onClick={() => {
                setEditingCardId(null);
                setIsAddOpen(true);
              }}
              className="flex items-center justify-center gap-2 border border-slate-800 hover:bg-slate-900 text-slate-200 font-semibold text-sm px-5 py-3 rounded-xl transition-all active:scale-[0.98]"
            >
              <Plus size={18} />
              Add Card
            </button>

            <button
              onClick={handleStudy}
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
              {dueCount > 0 ? `Study Due (${dueCount})` : deckCards.length === 0 ? 'No Cards' : 'Practice All'}
            </button>
          </div>
        </div>
      </div>

      {/* Main List Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Cards List</h3>
            <p className="text-xs text-slate-500 mt-0.5">Showing {filteredCards.length} of {deckCards.length} cards</p>
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
              placeholder="Search cards..."
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
                        Box {card.box}
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
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Front (Question)</div>
                        <p className="text-sm text-slate-200 font-medium line-clamp-3 leading-relaxed">{card.front}</p>
                      </div>
                      <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-900 pt-3 md:pt-0 md:pl-4">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Back (Answer)</div>
                        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{card.back}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex md:flex-col gap-2 shrink-0 md:border-l border-slate-900/60 md:pl-4 justify-end">
                    <button
                      onClick={() => handleEditCard(card.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                      title="Edit Card Front/Back"
                    >
                      <Edit2 size={13} />
                      <span className="md:hidden">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 border border-slate-800 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                      title="Delete Card"
                    >
                      <Trash2 size={13} />
                      <span className="md:hidden">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-slate-900 rounded-3xl bg-slate-900/5">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mx-auto mb-4">
              <HelpCircle size={22} />
            </div>
            <h4 className="text-lg font-bold text-slate-300">No cards in this deck</h4>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
              {searchTerm ? 'No matches found.' : 'Add your first question/answer card to start learning.'}
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Card Modal */}
      <AddCardModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingCardId(null);
        }}
        deckId={deck.id}
        cardIdToEdit={editingCardId}
      />
    </div>
  );
}
