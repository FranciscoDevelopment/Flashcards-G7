'use client';

import { useEffect, useState } from 'react';
import { useCardStore } from '../features/cards/store';
import StudyLayout from '../features/study/components/StudyLayout';
import DeckSelector from '../features/study/components/DeckSelector';
import QuizSession from '../features/study/components/QuizSession';
import StudyFinished from '../features/study/components/StudyFinished';
import '../features/study/styles/study.css';
import { useProgressStore } from '../features/progress/store/useProgresseStore';

function shuffleCards<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function QuizPage() {
  const cards = useCardStore((state) => state.cards);
  const hasHydrated = useCardStore((state) => state.hasHydrated);
  const registerSession = useProgressStore((state) => state.registerSession);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizCards, setQuizCards] = useState<typeof cards>([]);
  const [canRevealAnswer, setCanRevealAnswer] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [sessionHits, setSessionHits] = useState(0);
  const [sessionMisses, setSessionMisses] = useState(0);

  useEffect(() => {
    if (selectedTopic === null || isSessionFinished) return;

    const timer = setTimeout(() => {
      setCanRevealAnswer(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [currentIndex, selectedTopic, isSessionFinished]);

  if (!hasHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <p className="text-slate-500 text-sm" role="status" aria-live="polite">
          Cargando tarjetas...
        </p>
      </div>
    );
  }

  const topics = Array.from(new Set(cards.map((card) => card.topic))).filter(Boolean);

  const deckOptions = [
    {
      id: 'all',
      title: 'Todas las tarjetas',
      count: cards.length,
    },
    ...topics.map((topic) => ({
      id: topic,
      title: topic,
      count: cards.filter((card) => card.topic === topic).length,
    })),
  ];

  const currentCard = quizCards[currentIndex];
  const completedCards = currentIndex;
  const progress = (completedCards / quizCards.length) * 100;
  const visibleProgress = Math.max(progress, 1);

  const handleSelectDeck = (deckId: string) => {
    const selectedCards =
      deckId === 'all'
        ? cards
        : cards.filter((card) => card.topic === deckId);

    setQuizCards(shuffleCards(selectedCards));
    setSelectedTopic(deckId);
    setCurrentIndex(0);
    setShowAnswer(false);
    setCanRevealAnswer(false);
    setIsSessionFinished(false);
    setSessionHits(0);
    setSessionMisses(0);
  };

  const handleNextCard = () => {
    if (currentIndex < quizCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setCanRevealAnswer(false);
    } else {
      setIsSessionFinished(true);
    }
  };

  const handleRecordResult = (result: 'hit' | 'miss') => {
    const nextHits = result === 'hit' ? sessionHits + 1 : sessionHits;
    const nextMisses = result === 'miss' ? sessionMisses + 1 : sessionMisses;

    setSessionHits(nextHits);
    setSessionMisses(nextMisses);

    if (currentIndex === quizCards.length - 1) {
      registerSession(nextHits, nextMisses);
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
          description="Tu conocimiento sigue creciendo."
          primaryLabel="Repetir quiz"
          secondaryLabel="Elegir otro mazo"
          sessionHits={sessionHits}
          sessionMisses={sessionMisses}
          onPrimary={() => {
            setQuizCards(shuffleCards(quizCards));
            setCurrentIndex(0);
            setShowAnswer(false);
            setCanRevealAnswer(false);
            setIsSessionFinished(false);
            setSessionHits(0);
            setSessionMisses(0);
          }}
          onSecondary={() => {
            setSelectedTopic(null);
            setCurrentIndex(0);
            setShowAnswer(false);
            setCanRevealAnswer(false);
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
        setCanRevealAnswer(false);
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
        canRevealAnswer={canRevealAnswer}
        onShowAnswer={() => setShowAnswer((prev) => !prev)}
        onNextCard={handleNextCard}
        onRecordResult={handleRecordResult}
      />
    </StudyLayout>
  );
}
