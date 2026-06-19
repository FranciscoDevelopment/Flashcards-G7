import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, RotateCcw, HelpCircle, BookOpen, 
  AlertTriangle, CheckCircle2, SlidersHorizontal 
} from 'lucide-react';
import { useCardStore } from '../store';
import CardItem from './CardItem';

export default function CardList() {
  const cards = useCardStore((state) => state.cards);
  const deleteCard = useCardStore((state) => state.deleteCard);
  const resetCards = useCardStore((state) => state.resetCards);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  // Dynamically extract all unique topics/tags from cards list
  const topics = Array.from(new Set(cards.map((c) => c.topic))).filter(Boolean);

  // Filter cards based on search query and category
  const filteredCards = cards.filter((card) => {
    const matchesSearch = 
      card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || card.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  // Calculate statistics
  const totalCards = cards.length;
  // Critical review priority: cards with more misses than hits, or cards with high miss counts (>= 3)
  const criticalCount = cards.filter((c) => c.misses >= 3 || (c.misses > 0 && c.misses >= c.hits)).length;
  // Mastered cards: cards with high hits (>= 5) and low misses
  const masteredCount = cards.filter((c) => c.hits >= 5 && c.hits > c.misses * 2).length;

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
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-950 text-slate-100 flex flex-col">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-900 shrink-0">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Mis Tarjetas</h2>
          <p className="text-slate-400 mt-1">Administra tus tarjetas de estudio y visualiza el historial de aciertos y fallos.</p>
        </div>
        
        <div className="flex gap-3 shrink-0 self-start md:self-auto">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 border border-slate-900 hover:bg-slate-900 text-slate-450 hover:text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
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

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 shrink-0">
        {/* Total Card Metric */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-violet-500/10 text-violet-400">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Tarjetas</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalCards}</div>
          </div>
        </div>

        {/* Critical Priority Metric */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
          <div className={`p-3.5 rounded-xl ${criticalCount > 0 ? 'bg-rose-500/10 text-rose-400 animate-pulse' : 'bg-slate-900 text-slate-500'}`}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Críticas (Errores altos)</div>
            <div className={`text-2xl font-black mt-0.5 ${criticalCount > 0 ? 'text-rose-450' : 'text-slate-300'}`}>{criticalCount}</div>
          </div>
        </div>

        {/* Mastered Metric */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-450">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Dominadas</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{masteredCount}</div>
          </div>
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
            className="rounded-xl border border-slate-900 bg-slate-950 text-xs sm:text-sm text-slate-350 px-4 py-2.5 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all font-semibold"
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
      <div className="flex-1 space-y-4">
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredCards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-900 rounded-3xl bg-slate-900/5">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mx-auto mb-4">
              <HelpCircle size={20} />
            </div>
            <h4 className="text-lg font-bold text-slate-300">No se encontraron tarjetas</h4>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
              {searchTerm || selectedTopic !== 'all' 
                ? 'Intenta modificando los filtros de búsqueda o categoría.' 
                : 'Crea tu primera tarjeta de estudio para empezar.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
