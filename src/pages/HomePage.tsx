import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, BookOpen, Clock, Calendar, TrendingUp, 
  Layers, Settings as SettingsIcon, HelpCircle, CheckCircle2, 
  AlertCircle, Download, Upload, RotateCcw, AlertTriangle, 
  CheckCircle, Info 
} from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';
import DeckCard from '../components/DeckCard';
import CreateDeckModal from '../components/CreateDeckModal';
import { isCardDue } from '../utils/leitner';

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on path
  const getActiveTab = (pathname: string) => {
    if (pathname === '/leitner') return 'stats';
    if (pathname === '/settings') return 'settings';
    return 'decks';
  };

  const activeTab = getActiveTab(location.pathname);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'decks') navigate('/');
    else if (tabId === 'stats') navigate('/leitner');
    else if (tabId === 'settings') navigate('/settings');
  };

  // State & Store hooks
  const { decks, cards, logs, deleteDeck, resetAll, importData } = useDeckStore((state) => ({
    decks: state.decks,
    cards: state.cards,
    logs: state.logs,
    deleteDeck: state.deleteDeck,
    resetAll: state.resetAll,
    importData: state.importData,
  }));

  // --- Decks (Dashboard) State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filtered decks
  const filteredDecks = decks.filter((deck) =>
    deck.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // General statistics
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

  // --- Stats (Leitner Stats) calculation ---
  const boxCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as { [key: number]: number };
  const boxDueCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as { [key: number]: number };

  cards.forEach((card) => {
    const boxNum = card.box as number;
    if (boxNum >= 1 && boxNum <= 5) {
      boxCounts[boxNum] = (boxCounts[boxNum] || 0) + 1;
      if (isCardDue(card)) {
        boxDueCounts[boxNum] = (boxDueCounts[boxNum] || 0) + 1;
      }
    }
  });

  const boxDetails = [
    {
      level: 1,
      name: 'Box 1: Aprendizaje Activo',
      interval: 'Diario (1 Día)',
      desc: 'Elementos nuevos o desafiantes que requieren revisión inmediata. Las tarjetas falladas regresan aquí.',
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-400',
      bgGlow: 'rgba(239, 68, 68, 0.08)',
    },
    {
      level: 2,
      name: 'Box 2: Retención Corto Plazo',
      interval: 'Cada 2 Días',
      desc: 'Elementos con validación de recuerdo inicial. Se revisan cada dos días para solidificar la asociación.',
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      bgGlow: 'rgba(245, 158, 11, 0.08)',
    },
    {
      level: 3,
      name: 'Box 3: Retención Medio Plazo',
      interval: 'Cada 5 Días',
      desc: 'Conexiones conceptuales en formación. Se reduce la frecuencia para evaluar vías de memoria más profundas.',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      bgGlow: 'rgba(16, 185, 129, 0.08)',
    },
    {
      level: 4,
      name: 'Box 4: Memoria Largo Plazo',
      interval: 'Cada 9 Días',
      desc: 'Alta retención de memoria. Revisadas una vez por semana para proteger contra el desvanecimiento del trazo.',
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-400',
      bgGlow: 'rgba(59, 130, 246, 0.08)',
    },
    {
      level: 5,
      name: 'Box 5: Dominio Semi-Permanente',
      interval: 'Cada 15 Días',
      desc: 'Casi memoria semántica permanente. Se evalúan rara vez pero se mantienen programadas.',
      color: 'from-violet-500 to-fuchsia-600',
      textColor: 'text-violet-400',
      bgGlow: 'rgba(139, 92, 246, 0.08)',
    },
  ];

  // --- Settings State & Handlers ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleBackup = () => {
    try {
      const backupData = {
        decks,
        cards,
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flashcards_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccessMsg('¡Respaldo generado y descargado correctamente!');
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg('No se pudo generar el respaldo.');
      setSuccessMsg(null);
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        if (!parsed.decks || !parsed.cards || !Array.isArray(parsed.decks) || !Array.isArray(parsed.cards)) {
          throw new Error('Formato inválido. El respaldo debe contener arreglos de decks y cards.');
        }

        importData(parsed.decks, parsed.cards);
        setSuccessMsg(`¡Base de datos restaurada con éxito! (${parsed.decks.length} mazos y ${parsed.cards.length} tarjetas).`);
        setErrorMsg(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        setErrorMsg(err.message || 'Error al procesar el archivo JSON.');
        setSuccessMsg(null);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      window.confirm(
        '¿Estás seguro de que quieres restablecer todos los datos? Esto borrará tus mazos personalizados y el progreso, volviendo a sembrar los datos de prueba.'
      )
    ) {
      resetAll();
      setSuccessMsg('Base de datos restablecida a las semillas iniciales de prueba.');
      setErrorMsg(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-950 text-slate-100 flex flex-col">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-900 shrink-0">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {activeTab === 'decks' && 'Panel de Estudio'}
            {activeTab === 'stats' && 'Progreso del Sistema Leitner'}
            {activeTab === 'settings' && 'Ajustes del Sistema'}
          </h2>
          <p className="text-slate-400 mt-1">
            {activeTab === 'decks' && 'Selecciona un mazo para entrenar tu memoria o crea uno nuevo.'}
            {activeTab === 'stats' && 'Visualiza la distribución de tus tarjetas a través del calendario de repaso.'}
            {activeTab === 'settings' && 'Gestiona tus bases de datos, exporta copias de seguridad o reinicia configuraciones.'}
          </p>
        </div>

        {activeTab === 'decks' && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/20 active:scale-[0.98] self-start md:self-auto shrink-0"
          >
            <Plus size={18} />
            Crear Mazo
          </button>
        )}
      </div>

      {/* Tabs Selector Navigation */}
      <div className="flex border-b border-slate-900/60 pb-px shrink-0">
        <div className="flex space-x-6">
          <button
            onClick={() => handleTabChange('decks')}
            className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all border-b-2 px-1 ${
              activeTab === 'decks'
                ? 'border-violet-500 text-violet-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen size={16} />
            Mis Mazos
          </button>
          <button
            onClick={() => handleTabChange('stats')}
            className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all border-b-2 px-1 ${
              activeTab === 'stats'
                ? 'border-violet-500 text-violet-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={16} />
            Progreso Leitner
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`flex items-center gap-2 pb-4 text-sm font-semibold transition-all border-b-2 px-1 ${
              activeTab === 'settings'
                ? 'border-violet-500 text-violet-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <SettingsIcon size={16} />
            Ajustes
          </button>
        </div>
      </div>

      {/* --- CONTENT TABS --- */}
      <div className="flex-1 space-y-8">
        {/* TAB 1: DECKS (Dashboard) */}
        {activeTab === 'decks' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3.5 rounded-xl bg-violet-500/10 text-violet-400">
                  <BookOpen size={22} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Mazos</div>
                  <div className="text-2xl font-black text-white mt-1">{decks.length}</div>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <Clock size={22} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Tarjetas</div>
                  <div className="text-2xl font-black text-white mt-1">{totalCards}</div>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 flex items-center gap-4">
                <div className={`p-3.5 rounded-xl ${dueCards > 0 ? 'bg-amber-500/10 text-amber-400 animate-pulse' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <Calendar size={22} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pendientes</div>
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
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Precisión</div>
                  <div className="text-2xl font-black text-white mt-1">{successRate}%</div>
                </div>
              </div>
            </div>

            {/* Decks Section */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white tracking-tight">Tus Mazos de Estudio</h3>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar mazos..."
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
                  <h4 className="text-lg font-bold text-slate-300">No se encontraron mazos</h4>
                  <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                    {searchTerm ? 'Intenta ajustando tu término de búsqueda.' : 'Crea un mazo para empezar a organizar tus tarjetas.'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: STATS (Leitner Progress) */}
        {activeTab === 'stats' && (
          <div className="space-y-10">
            {/* Explanation card */}
            <div className="rounded-2xl border border-violet-900/30 bg-violet-950/10 p-6 flex flex-col md:flex-row gap-5 items-start">
              <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400 border border-violet-500/20 shrink-0">
                <HelpCircle size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-violet-300">Cómo funciona el Sistema Leitner</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Las tarjetas se ordenan en cajones (Boxes) según el nivel de memorización. Si recuerdas una tarjeta **correctamente**, avanza al **siguiente cajón** (duplica su tiempo de espera). Si la **olvidas**, la tarjeta vuelve de inmediato al **Cajón 1** para revisión diaria. Así maximizas tu tiempo concentrándote en lo que más te cuesta recordar.
                </p>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-slate-900/10 border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight">Gráfico de Distribución del Sistema</h3>
              
              {totalCards > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-end justify-between h-48 pt-4 px-2 md:px-10 border-b border-slate-900">
                    {boxDetails.map((box) => {
                      const count = boxCounts[box.level] || 0;
                      const percent = totalCards > 0 ? (count / totalCards) * 100 : 0;
                      const dueCount = boxDueCounts[box.level] || 0;

                      return (
                        <div key={box.level} className="flex flex-col items-center flex-1 group">
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 border border-slate-800 text-[10px] px-2 py-1 rounded mb-2 absolute translate-y-[-110px] text-center z-10">
                            <span className="font-bold text-white block">{count} tarjetas</span>
                            <span className="text-amber-400">{dueCount} por revisar</span>
                          </div>

                          {/* Bar */}
                          <div className="w-8 md:w-16 bg-slate-900 rounded-t-lg relative overflow-hidden flex flex-col justify-end" style={{ height: '100%', minHeight: '8px' }}>
                            {/* Bar fill */}
                            <div 
                              className={`w-full rounded-t-lg bg-gradient-to-t ${box.color} transition-all duration-500`}
                              style={{ height: `${percent || 4}%` }}
                            />
                            
                            {/* Due fill (overlaid) */}
                            {dueCount > 0 && (
                              <div 
                                className="w-full bg-amber-500/30 absolute bottom-0 border-t border-amber-400/50" 
                                style={{ height: `${(dueCount / totalCards) * 100}%` }}
                              />
                            )}
                          </div>

                          <span className="mt-3 text-xs font-mono text-slate-500">Box {box.level}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-center gap-6 flex-wrap text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 rounded bg-violet-600 border border-violet-500/20" />
                      Tarjetas en Caja
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 rounded bg-amber-500 border border-amber-400/20" />
                      Tarjetas Pendientes
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Agrega tarjetas a tus mazos para ver las estadísticas de distribución.
                </div>
              )}
            </div>

            {/* Box breakdowns */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {boxDetails.map((box) => {
                const count = boxCounts[box.level] || 0;
                const dueCount = boxDueCounts[box.level] || 0;
                const percent = totalCards > 0 ? Math.round((count / totalCards) * 100) : 0;

                return (
                  <div 
                    key={box.level}
                    className="rounded-2xl border border-slate-900 bg-slate-900/10 p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300"
                    style={{ boxShadow: `inset 0 0 20px ${box.bgGlow}` }}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h4 className="font-bold text-white text-base tracking-tight">{box.name}</h4>
                          <span className={`text-xs font-semibold ${box.textColor} uppercase tracking-wider`}>
                            Intervalo: {box.interval}
                          </span>
                        </div>
                        
                        <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-400 font-bold border border-slate-850">
                          {percent}% del total
                        </span>
                      </div>
                      
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                        {box.desc}
                      </p>
                    </div>

                    <div className="border-t border-slate-900 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-white">{count}</span>
                        <span className="text-xs text-slate-500 font-semibold">tarjetas</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-850/65">
                        {dueCount > 0 ? (
                          <>
                            <AlertCircle size={12} className="text-amber-500" />
                            <span className="text-amber-400">{dueCount} pendientes</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span className="text-slate-450">Al día</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Status Messages */}
            {successMsg && (
              <div className="rounded-2xl border border-emerald-900/35 bg-emerald-950/15 p-4 flex gap-3 text-emerald-400 items-start text-sm transition-all duration-300">
                <CheckCircle className="shrink-0 mt-0.5" size={16} />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="rounded-2xl border border-rose-900/35 bg-rose-950/15 p-4 flex gap-3 text-rose-400 items-start text-sm transition-all duration-300">
                <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Backup utilities */}
              <div className="bg-slate-900/10 border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6">
                <h3 className="text-lg font-bold text-white tracking-tight">Copia de Seguridad y Sincronización</h3>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="max-w-md">
                      <h4 className="font-semibold text-white text-sm">Respaldar Base de Datos</h4>
                      <p className="text-slate-500 text-xs mt-1">Descarga un archivo local `.json` con tus mazos, tarjetas y registros del historial Leitner.</p>
                    </div>
                    <button
                      onClick={handleBackup}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-slate-750 hover:text-white shrink-0"
                    >
                      <Download size={14} />
                      Exportar Datos
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="max-w-md">
                      <h4 className="font-semibold text-white text-sm">Importar Base de Datos</h4>
                      <p className="text-slate-500 text-xs mt-1">Restablece tu base de datos completa o carga mazos externos desde un archivo `.json` de respaldo.</p>
                    </div>
                    <div className="shrink-0">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleRestore}
                        accept=".json"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 border border-slate-850 hover:bg-slate-900 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                      >
                        <Upload size={14} />
                        Cargar JSON
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-slate-900/10 border border-rose-950/20 rounded-3xl p-6 md:p-8 space-y-6">
                <h3 className="text-lg font-bold text-rose-400 tracking-tight">Zona de Peligro</h3>
                
                <div className="p-4 rounded-2xl bg-rose-950/5 border border-rose-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="max-w-md">
                    <h4 className="font-semibold text-rose-300 text-sm">Restablecer Todo</h4>
                    <p className="text-slate-500 text-xs mt-1">Elimina todo el historial, mazos personalizados, y vuelve a sembrar los mazos predeterminados del sistema.</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-rose-600/10 shrink-0"
                  >
                    <RotateCcw size={14} />
                    Restablecer
                  </button>
                </div>
              </div>

              {/* Specs */}
              <div className="lg:col-span-2 bg-slate-900/10 border border-slate-900 rounded-3xl p-6 md:p-8 flex gap-5">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 shrink-0 self-start">
                  <Info size={22} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-slate-200">Especificaciones Técnicas</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-normal">
                    Este sistema está construido con React 19 + TypeScript + Vite, estilizado de manera ágil usando Tailwind CSS v3. Los estados globales de la aplicación, el algoritmo de Leitner y las métricas de sincronización de estudio están encapsuladas y sincronizadas atómicamente con Zustand persistido directamente en el `localStorage` del cliente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Deck Modal */}
      <CreateDeckModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
