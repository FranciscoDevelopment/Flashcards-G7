import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, Eye } from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';

export default function NewCardPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();

  const { decks, addCard } = useDeckStore((state) => ({
    decks: state.decks,
    addCard: state.addCard,
  }));

  const deck = decks.find((d) => d.id === deckId);

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    addCard(deck.id, front, back);
    navigate(`/deck/${deck.id}`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-950 text-slate-100 flex flex-col max-w-5xl mx-auto w-full">
      {/* Header Navigation */}
      <div className="space-y-4 shrink-0">
        <Link 
          to={`/deck/${deck.id}`} 
          className="text-slate-400 hover:text-white inline-flex items-center gap-2 text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} /> Volver al Mazo
        </Link>

        <div className="border-b border-slate-900 pb-6">
          <div className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${deck.color}`} />
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{deck.name}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">Crear Nueva Tarjeta</h2>
          <p className="text-slate-400 mt-1">Añade una tarjeta de memoria utilizando el sistema de repetición espaciada Leitner.</p>
        </div>
      </div>

      {/* Main Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-7 bg-slate-900/10 border border-slate-900 p-6 md:p-8 rounded-3xl">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-350">
              Anverso de la Tarjeta (Pregunta o Concepto)
            </label>
            <textarea
              required
              rows={4}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Ej: ¿Cuál es el peor caso de complejidad temporal de QuickSort?"
              className="w-full rounded-xl border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none font-medium leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-350">
              Reverso de la Tarjeta (Respuesta o Detalles)
            </label>
            <textarea
              required
              rows={4}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Ej: O(n²). Esto ocurre cuando el pivote elegido es consistentemente el menor o mayor elemento del subarreglo."
              className="w-full rounded-xl border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-slate-300 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-900 pt-6">
            <button
              type="button"
              onClick={() => navigate(`/deck/${deck.id}`)}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 active:bg-violet-700 transition-all shadow-lg shadow-violet-600/25 active:scale-[0.98]"
            >
              Crear Tarjeta
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Eye size={14} /> Vista Previa en Vivo</span>
            <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-850">
              <button
                type="button"
                onClick={() => setPreviewSide('front')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                  previewSide === 'front' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Anverso
              </button>
              <button
                type="button"
                onClick={() => setPreviewSide('back')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                  previewSide === 'back' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Reverso
              </button>
            </div>
          </div>

          {/* Preview Card Box */}
          <div className="w-full aspect-[4/3] rounded-3xl border border-slate-900 bg-slate-900/10 p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Ambient Background Gradient for Preview */}
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet-600/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-600/5 blur-3xl" />

            <div className="flex justify-between items-center z-10">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Layers size={10} /> Caja 1
              </span>
              <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">
                {previewSide === 'front' ? 'Pregunta' : 'Respuesta'}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center py-6 text-center z-10">
              {previewSide === 'front' ? (
                <p className={`text-base font-bold leading-relaxed transition-all ${front ? 'text-slate-200' : 'text-slate-650 italic'}`}>
                  {front || 'Escribe la pregunta en el formulario para ver la vista previa...'}
                </p>
              ) : (
                <p className={`text-sm leading-relaxed transition-all ${back ? 'text-slate-350' : 'text-slate-650 italic'}`}>
                  {back || 'Escribe la respuesta en el formulario para ver la vista previa...'}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center text-[9px] text-slate-600 font-mono border-t border-slate-900/60 pt-3 z-10">
              <span>AethelFlash Preview</span>
              <span>Modo Leitner</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/20 border border-slate-900 text-xs text-slate-400 leading-normal flex gap-2">
            <BookOpen size={16} className="text-violet-400 shrink-0 mt-0.5" />
            <span>
              Una vez guardada, la tarjeta entrará automáticamente en el **Cajón 1** y estará disponible para repasar en la próxima sesión.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
