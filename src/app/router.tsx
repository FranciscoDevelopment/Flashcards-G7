import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import FlashcardsPage from '../pages/FlashcardsPage';
import NewCardPage from '../pages/NewCardPage';
import EditCardPage from '../pages/EditCardPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/leitner" element={<HomePage />} />
      <Route path="/settings" element={<HomePage />} />
      <Route path="/deck/:deckId" element={<FlashcardsPage />} />
      <Route path="/deck/:deckId/new" element={<NewCardPage />} />
      <Route path="/deck/:deckId/edit/:cardId" element={<EditCardPage />} />
    </Routes>
  );
}
