import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HomePage from '../pages/HomePage';
import CardsPage from '../pages/CardsPage';
import CardForm from '../features/cards/components/CardForm';
import ReviewPage from '../pages/ReviewPage';
import QuizPage from '../pages/QuizPage';
import ProgressPage from '../pages/ProgressPage';

// Layout base persistente con Navbar y Outlet para las páginas hijas
function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Todo el flujo queda envuelto en el layout base */}
      <Route element={<Layout />}>
        {/* Rutas principales del Módulo I1 (D1) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/new" element={<CardForm />} />
        <Route path="/edit/:id" element={<CardForm />} />
        <Route path="/study/review" element={<ReviewPage />} />
        <Route path="/study/quiz" element={<QuizPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Route>
    </Routes>
  );
}
