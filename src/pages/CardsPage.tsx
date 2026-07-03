import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, RotateCcw, BookOpen, SlidersHorizontal 
} from 'lucide-react';
import { useCardStore } from '../features/cards/store';
import CardList from '../features/cards/components/CardList';

export default function CardsPage() {
    useEffect(() => {
    document.title = 'SmartFlash | Mis Tarjetas';
  }, []); const cards = useCardStore((state) => state.cards);
  const deleteCard = useCardStore((state) => state.deleteCard);
  const resetCards = useCardStore((state) => state.resetCards);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const safeCards = cards || [];

  // Dynamically extract all unique topics/tags from cards list
  const topics = Array.from(new Set(safeCards.map((c) => c.topic))).filter(Boolean);

  // Filter cards based on search query and category
  const filteredCards = safeCards.filter((card) => {
    const matchesSearch = 
      card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || card.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  // Calculate statistics
  const totalCards = safeCards.length;

  const handleDeleteCard = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
      deleteCard(id);
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres restaurar las tarjetas semilla iniciales? Esto borrará tus tarjetas personalizadas.')) {
      resetCards();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 flex flex-col">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-900 shrink-0">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Mis Tarjetas</h2>
          <p className="text-slate-400 mt-2 flex flex-wrap items-center gap-2">
            <span>Administra tus tarjetas de estudio.</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-[11px] font-bold font-mono rounded-full bg-slate-900 border border-slate-800 text-violet-400">
              <BookOpen size={12} />
              {totalCards} {totalCards === 1 ? 'tarjeta' : 'tarjetas'} • {topics.length} {topics.length === 1 ? 'tema' : 'temas'}
            </span>
          </p>
        </div>
        
        <div className="flex gap-3 shrink-0 self-start md:self-auto">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 border border-slate-900 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
            title="Reiniciar base de datos a tarjetas semillas"
          >
            <RotateCcw size={14} />
            Restaurar Semillas
          </button>
          
          <Link
            to="/new"
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-600/25 active:scale-[0.98]"
          >
            <Plus size={16} />
            Nueva Tarjeta
          </Link>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/10 border border-slate-900/40 p-4 rounded-2xl shrink-0">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
            <Search size={15} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por pregunta o respuesta..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all font-medium"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-xs font-semibold flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal size={14} />
            Filtrar:
          </span>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="rounded-xl border border-slate-900 bg-slate-950 text-xs sm:text-sm text-slate-400 px-4 py-2.5 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all font-semibold"
          >
            <option value="all">Todos los temas</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards List Display Grid */}
      <CardList
        filteredCards={filteredCards}
        onDelete={handleDeleteCard}
        searchTerm={searchTerm}
        selectedTopic={selectedTopic}
      />
    </div>
  );
}
