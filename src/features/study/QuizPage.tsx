import { useState } from 'react';
import { useCardStore } from '../cards/store';
import { getOrderedCards } from './utils/getOrderedCards';
import StudyLayout from './components/StudyLayout';
import DeckSelector from './components/DeckSelector';
import QuizSession from './components/QuizSession';
import StudyFinished from './components/StudyFinished';
import './styles/review.css';

export default function QuizPage() {
  const cards = useCardStore((state) => state.cards);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  const orderedCards = getOrderedCards(cards);

  const topics = Array.from(
    new Set(cards.map((card) => card.topic))
  ).filter(Boolean);

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

  const quizCards =
    selectedTopic === 'all'
      ? orderedCards
      : orderedCards.filter((card) => card.topic === selectedTopic);
  const currentCard = quizCards[currentIndex];
  const completedCards = currentIndex;
  const progress = (completedCards / quizCards.length) * 100;
  const visibleProgress = Math.max(progress, 1);

  const handleSelectDeck = (deckId: string) => {
    setSelectedTopic(deckId);
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsSessionFinished(false);
  };

  const handleNextCard = () => {
    if (currentIndex < quizCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setIsSessionFinished(true);
    }
  };

  if (selectedTopic === null) {
    return (
      <StudyLayout
        title="Modo Quiz"
        variant="selector"
        subtitle="Elegí un mazo para poner a prueba tus conocimientos."
      >
        <DeckSelector
          decks={deckOptions}
          onSelectDeck={handleSelectDeck}
        />
      </StudyLayout>
    );
  }

  if (isSessionFinished) {
    return (
      <StudyLayout title="Modo Quiz" variant="finished">
        <StudyFinished
          eyebrow="Quiz terminado"
          title="🎯 ¡Sesión completada!"
          description={`Tu conocimiento sigue creciendo.`}
          primaryLabel="Repetir quiz"
          secondaryLabel="Elegir otro mazo"
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
      title="Modo Quiz"
      backLabel="Cambiar mazo"
      onBack={() => {
        setSelectedTopic(null);
        setCurrentIndex(0);
        setShowAnswer(false);
        setIsSessionFinished(false);
      }}
    >
      <QuizSession
        currentCard={currentCard}
        currentIndex={currentIndex}
        totalCards={quizCards.length}
        progress={visibleProgress}
        selectedTopic={selectedTopic}
        showAnswer={showAnswer}
        onShowAnswer={() => setShowAnswer((prev) => !prev)}
        onNextCard={handleNextCard}
      />
    </StudyLayout>
  );
}