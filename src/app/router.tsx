import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CardList from '../features/cards/components/CardList';
import CardForm from '../features/cards/components/CardForm';

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
        <Route path="/" element={<CardList />} />
        <Route path="/new" element={<CardForm />} />
        <Route path="/edit/:id" element={<CardForm />} />

        {/* Placeholders reservados para el Módulo I2 (D2) */}
        <Route 
          path="/review" 
          element={
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
              <div className="max-w-md space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
                  <span className="font-bold">I2</span>
                </div>
                <h3 className="text-xl font-bold text-white">Módulo de Repaso</h3>
                <p className="text-sm text-slate-400">
                  La pantalla interactiva para ver y navegar entre tarjetas con revelación de respuestas será implementada aquí por el desarrollador **I2**.
                </p>
              </div>
            </div>
          } 
        />
        <Route 
          path="/quiz" 
          element={
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
              <div className="max-w-md space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <span className="font-bold">I2</span>
                </div>
                <h3 className="text-xl font-bold text-white">Módulo de Quiz</h3>
                <p className="text-sm text-slate-400">
                  La pantalla de adivinación de tarjetas, registro de resultados (`recordResult`) e informe final de sesión será construida aquí por el desarrollador **I2**.
                </p>
              </div>
            </div>
          } 
        />
      </Route>
    </Routes>
  );
}
