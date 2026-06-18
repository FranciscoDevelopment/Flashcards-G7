import { useState } from 'react';
import { Plus, Search, BookOpen, Clock, Calendar, TrendingUp } from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';
import DeckCard from '../components/DeckCard';
import CreateDeckModal from '../components/CreateDeckModal';
import { isCardDue } from '../utils/leitner';

export default function Dashboard() {
  const { decks, cards, logs, deleteDeck } = useDeckStore((state) => ({
    decks: state.decks,
    cards: state.cards,
    logs: state.logs,
    deleteDeck: state.deleteDeck,
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filtered decks
  const filteredDecks = decks.filter((deck) =>
    deck.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalCards = cards.length;
  const dueCards = cards.filter(isCardDue).length;
  const totalReviews = logs.length;
  const correctReviews = logs.filter((log) => log.rating === 'correct').length;
  const successRate = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

  const handleDeleteDeck = (id: string) => {
    if (window.confirm('Are you sure you want to delete this deck? This will delete all cards inside it!')) {
      deleteDeck(id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 bg-slate-950 text-slate-100">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-900">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Study Dashboard</h2>
          <p className="text-slate-400 mt-1">Select a deck to begin your memory training or create a new one.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/20 active:scale-[0.98] self-start md:self-auto"
        >
          <Plus size={18} />
          Create Deck
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-violet-500/10 text-violet-400">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Decks</div>
            <div className="text-2xl font-black text-white mt-1">{decks.length}</div>
          </div>
        </div>

        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Cards</div>
            <div className="text-2xl font-black text-white mt-1">{totalCards}</div>
          </div>
        </div>

        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
          <div className={`p-3.5 rounded-xl ${dueCards > 0 ? 'bg-amber-500/10 text-amber-400 animate-pulse' : 'bg-emerald-500/10 text-emerald-400'}`}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Due Reviews</div>
            <div className={`text-2xl font-black mt-1 ${dueCards > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {dueCards}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-teal-500/10 text-teal-400">
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Accuracy</div>
            <div className="text-2xl font-black text-white mt-1">{successRate}%</div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-white tracking-tight">Your Decks</h3>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search decks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-900/20 text-sm text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>

        {/* Decks Grid */}
        {filteredDecks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                cards={cards}
                onDelete={handleDeleteDeck}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-slate-900 rounded-3xl bg-slate-900/5">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mx-auto mb-4">
              <BookOpen size={22} />
            </div>
            <h4 className="text-lg font-bold text-slate-300">No decks found</h4>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
              {searchTerm ? 'Try adjusting your search query.' : 'Create a deck to start organizing your flashcards.'}
            </p>
          </div>
        )}
      </div>

      {/* Create Deck Modal */}
      <CreateDeckModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
