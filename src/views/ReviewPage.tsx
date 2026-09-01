'use client';

import { useState } from 'react';
import { useCardStore } from '../features/cards/store';
import { getOrderedCards } from '../features/study/utils/getOrderedCards';
import StudyLayout from '../features/study/components/StudyLayout';
import DeckSelector from '../features/study/components/DeckSelector';
import ReviewSession from '../features/study/components/ReviewSession';
import StudyFinished from '../features/study/components/StudyFinished';
import '../features/study/styles/study.css';

export default function ReviewPage() {
  const cards = useCardStore((state) => state.cards);
  const hasHydrated = useCardStore((state) => state.hasHydrated);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  const topics = Array.from(new Set(cards.map((card) => card.topic))).filter(Boolean);

  const orderedCards = getOrderedCards(cards);

  const deckOptions = [
    {
      id: 'all',
      title: 'Todas las tarjetas',
      count: orderedCards.length,
    },
    ...topics.map((topic) => ({
      id: topic,
      title: topic,
      count: orderedCards.filter((card) => card.topic === topic).length,
    })),
  ];

  const reviewCards =
    selectedTopic === 'all'
      ? orderedCards
      : orderedCards.filter((card) => card.topic === selectedTopic);

  const currentCard = reviewCards[currentIndex];
  const completedCards = currentIndex + (showAnswer ? 1 : 0);
  const progress = (completedCards / reviewCards.length) * 100;
  const visibleProgress = Math.max(progress, 1);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  if (!hasHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <p className="text-slate-500 text-sm" role="status" aria-live="polite">
          Cargando tarjetas...
        </p>
      </div>
    );
  }

  const handleNextCard = () => {
    if (currentIndex < reviewCards.length - 1) {
      setDirection('next');
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setIsSessionFinished(true);
    }
  };

  const handlePreviousCard = () => {
    if (currentIndex > 0) {
      setDirection('prev');
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleSelectDeck = (deckId: string) => {
    setSelectedTopic(deckId);
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsSessionFinished(false);
  };

  if (selectedTopic === null) {
    return (
      <StudyLayout
        title="Modo Repaso"
        variant="selector"
        subtitle="Elegí un mazo para comenzar tu sesión de repaso."
      >
        <DeckSelector
          decks={deckOptions}
          onSelectDeck={handleSelectDeck}
        />
      </StudyLayout>
    );
  }

  if (reviewCards.length === 0) {
    return (
      <StudyLayout title="Modo Repaso">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-900 dark:bg-slate-900/20">
          <p className="text-slate-600 dark:text-slate-400">
            No hay tarjetas disponibles para repasar.
          </p>
        </div>
      </StudyLayout>
    );
  }

  if (isSessionFinished) {
    return (
      <StudyLayout title="Modo Repaso" variant="finished">
        <StudyFinished
          eyebrow="Repaso terminado"
          title="🎉 ¡Todo listo!"
          description={`Terminaste todas las tarjetas, ¡gran trabajo!.`}
          primaryLabel="Repasar nuevamente"
          secondaryLabel="Volver a mazos"
          onPrimary={() => {
            setCurrentIndex(0);
            setShowAnswer(false);
            setIsSessionFinished(false);
          }}
          onSecondary={() => {
            setSelectedTopic(null);
            setCurrentIndex(0);
            setShowAnswer(false);
            setIsSessionFinished(false);
          }}
        />
      </StudyLayout>
    );
  }

  return (
    <StudyLayout
      title="Modo Repaso"
      backLabel="Cambiar mazo"
      onBack={() => {
        setSelectedTopic(null);
        setCurrentIndex(0);
        setShowAnswer(false);
        setIsSessionFinished(false);
      }}
    >
      <ReviewSession
        currentCard={currentCard}
        currentIndex={currentIndex}
        totalCards={reviewCards.length}
        progress={visibleProgress}
        selectedTopic={selectedTopic}
        showAnswer={showAnswer}
        direction={direction}
        onShowAnswer={() => setShowAnswer((prev) => !prev)}
        onNextCard={handleNextCard}
        onPreviousCard={handlePreviousCard}
        onChangeDeck={() => {
          setSelectedTopic(null);
          setCurrentIndex(0);
          setShowAnswer(false);
          setIsSessionFinished(false);
        }}
      />
    </StudyLayout>
  );
}
