import { useState } from 'react';
import { useCardStore } from '../features/cards/store';
import StudyLayout from '../features/study/components/StudyLayout';
import DeckSelector from '../features/study/components/DeckSelector';
import QuizSession from '../features/study/components/QuizSession';
import StudyFinished from '../features/study/components/StudyFinished';
import '../features/study/styles/study.css';
import { useProgressStore } from '../features/progress/store/useProgresseStore';

export default function QuizPage() {
  const cards = useCardStore((state) => state.cards);
  const registerSession = useProgressStore((state) => state.registerSession);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [sessionHits, setSessionHits] = useState(0);
  const [sessionMisses, setSessionMisses] = useState(0);

  const orderedCards = [...cards].sort(() => Math.random() - 0.5);
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
    setSessionHits(0);
    setSessionMisses(0);
  };

  const handleNextCard = () => {
    if (currentIndex < quizCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setIsSessionFinished(true);
      registerSession(sessionHits, sessionMisses); // ← D5: registra la sesión
    }
  };

  const handleRecordResult = (result: 'hit' | 'miss') => {
    if (result === 'hit') setSessionHits((prev) => prev + 1);
    else setSessionMisses((prev) => prev + 1);
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
          description="Tu conocimiento sigue creciendo."
          primaryLabel="Repetir quiz"
          secondaryLabel="Elegir otro mazo"
          sessionHits={sessionHits}
          sessionMisses={sessionMisses}
          onPrimary={() => {
            setCurrentIndex(0);
            setShowAnswer(false);
            setIsSessionFinished(false);
            setSessionHits(0);
            setSessionMisses(0);
          }}
          onSecondary={() => {
            setSelectedTopic(null);
            setCurrentIndex(0);
            setShowAnswer(false);
            setIsSessionFinished(false);
            setSessionHits(0);
            setSessionMisses(0);
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
        setSessionHits(0);
        setSessionMisses(0);
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
        onRecordResult={handleRecordResult}
      />
    </StudyLayout>
  );
}