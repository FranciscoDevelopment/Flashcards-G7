import { useState } from 'react';
import { useCardStore } from '../cards/store';
import ReviewLayout from './components/ReviewLayout';
import DeckSelector from './components/DeckSelector';
import ReviewSession from './components/ReviewSession';
import ReviewFinished from './components/ReviewFinished';
import './styles/review.css';

export default function ReviewPage() {
  const cards = useCardStore((state) => state.cards);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  const topics = Array.from(
    new Set(cards.map((card) => card.topic))
  ).filter(Boolean);

  const orderedCards = cards;

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

  const handleNextCard = () => {
    if (currentIndex < reviewCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setIsSessionFinished(true);
    }
  };

  const handlePreviousCard = () => {
    if (currentIndex > 0) {
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
      <ReviewLayout
        variant="selector"
        subtitle="Elegí un mazo para comenzar tu sesión de repaso."
      >
        <DeckSelector
          decks={deckOptions}
          onSelectDeck={handleSelectDeck}
        />
      </ReviewLayout>
    );
  }

  if (reviewCards.length === 0) {
    return (
      <ReviewLayout>
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-900 dark:bg-slate-900/20">
          <p className="text-slate-600 dark:text-slate-400">
            No hay tarjetas disponibles para repasar.
          </p>
        </div>
      </ReviewLayout>
    );
  }

  if (isSessionFinished) {
    return (
      <ReviewLayout variant="session">
        <ReviewFinished
          totalCards={reviewCards.length}
          onRestart={() => {
            setCurrentIndex(0);
            setShowAnswer(false);
            setIsSessionFinished(false);
          }}
          onBackToDecks={() => {
            setSelectedTopic(null);
            setCurrentIndex(0);
            setShowAnswer(false);
            setIsSessionFinished(false);
          }}
        />
      </ReviewLayout>
    );
  }

  return (
    <ReviewLayout
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
    </ReviewLayout>
  );
}