import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Tag, Eye, ShieldAlert } from 'lucide-react';
import { useCardStore } from '../store';
import type { CardDifficulty } from '../types';

export default function CardForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const cards = useCardStore((state) => state.cards);
  const addCard = useCardStore((state) => state.addCard);
  const editCard = useCardStore((state) => state.editCard);

  const card = cards.find((c) => c.id === id);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<CardDifficulty>('medium');
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');

  // Load card contents on edit mode
  useEffect(() => {
    if (isEditing && card) {
      setQuestion(card.question);
      setAnswer(card.answer);
      setTopic(card.topic);
      setDifficulty(card.difficulty);
    } else {
      setQuestion('');
      setAnswer('');
      setTopic('');
      setDifficulty('medium');
    }
  }, [id, isEditing, card]);

  if (isEditing && !card) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-100 bg-slate-950">
        <ShieldAlert className="text-rose-500 h-12 w-12 mb-4" />
        <h3 className="text-xl font-bold">Tarjeta no encontrada</h3>
        <p className="text-slate-400 mt-2">La tarjeta con ID "{id}" no existe en el store.</p>
        <Link to="/" className="text-violet-400 hover:underline mt-4 flex items-center gap-1.5 font-semibold">
          <ArrowLeft size={16} /> Volver al Listado
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || !topic.trim()) return;

    const cardData = {
      question: question.trim(),
      answer: answer.trim(),
      topic: topic.trim(),
      difficulty,
    };

    if (isEditing && card) {
      editCard(card.id, cardData);
    } else {
      addCard(cardData);
    }

    navigate('/');
  };

  const difficultyColors = {
    easy: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
    medium: 'text-amber-450 border-amber-500/30 bg-amber-500/5',
    hard: 'text-rose-450 border-rose-500/30 bg-rose-500/5',
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-950 text-slate-100 flex flex-col max-w-5xl mx-auto w-full">
      {/* Navigation Header */}
      <div className="space-y-4 shrink-0">
        <Link 
          to="/" 
          className="text-slate-400 hover:text-white inline-flex items-center gap-2 text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} /> Volver al Listado
        </Link>

        <div className="border-b border-slate-900 pb-6">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {isEditing ? 'Editar Tarjeta de Estudio' : 'Crear Nueva Tarjeta'}
          </h2>
          <p className="text-slate-400 mt-1">
            {isEditing ? 'Actualiza los campos de tu tarjeta para modificar tu mazo.' : 'Define una pregunta y una respuesta para guardar en tu biblioteca.'}
          </p>
        </div>
      </div>

      {/* Form + Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-7 bg-slate-900/10 border border-slate-900 p-6 md:p-8 rounded-3xl">
          {/* Question text */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-350">
              Anverso (Pregunta o Concepto)
            </label>
            <textarea
              required
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ej: ¿Qué es la inyección SQL?"
              className="w-full rounded-xl border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Answer text */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-350">
              Reverso (Respuesta o Detalles)
            </label>
            <textarea
              required
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Ej: Es una vulnerabilidad que permite a un atacante ejecutar sentencias SQL maliciosas..."
              className="w-full rounded-xl border border-slate-900 bg-slate-950 px-4 py-3 text-sm text-slate-300 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Category/Topic Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-355">
                Tema / Categoría
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej: Programación, Hardware, Redes"
                className="w-full rounded-xl border border-slate-900 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all font-medium"
              />
            </div>

            {/* Difficulty selection */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-355">
                Dificultad
              </label>
              <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-xl border border-slate-900">
                {(['easy', 'medium', 'hard'] as CardDifficulty[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      difficulty === level
                        ? level === 'easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : level === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {level === 'easy' ? 'Fácil' : level === 'medium' ? 'Medio' : 'Difícil'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-900 pt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 active:bg-violet-700 transition-all shadow-lg shadow-violet-600/25 active:scale-[0.98]"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Tarjeta'}
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Eye size={14} /> Vista Previa de Tarjeta</span>
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
          <div className="w-full aspect-[4/3] rounded-3xl border border-slate-900 bg-slate-900/10 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet-600/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-600/5 blur-3xl" />

            <div className="flex justify-between items-center z-10">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Tag size={10} />
                {topic || 'Categoría'}
              </span>
              <span className={`text-[9px] font-black border rounded px-1.5 py-0.5 uppercase tracking-wider ${difficultyColors[difficulty]}`}>
                {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center py-4 text-center z-10">
              {previewSide === 'front' ? (
                <p className={`text-base font-bold leading-relaxed transition-all ${question ? 'text-slate-200' : 'text-slate-650 italic'}`}>
                  {question || 'Escribe la pregunta en el formulario para previsualizar...'}
                </p>
              ) : (
                <p className={`text-sm leading-relaxed transition-all ${answer ? 'text-slate-350' : 'text-slate-650 italic'}`}>
                  {answer || 'Escribe la respuesta en el formulario para previsualizar...'}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center text-[9px] text-slate-600 font-mono border-t border-slate-900/40 pt-3 z-10">
              <span>{isEditing ? `ID: ${card?.id.split('-').pop()}` : 'Tarjeta Nueva'}</span>
              <span>Modo Quiz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
