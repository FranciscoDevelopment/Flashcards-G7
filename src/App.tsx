import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DeckDetails from './pages/DeckDetails';
import StudySession from './pages/StudySession';
import LeitnerStats from './pages/LeitnerStats';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Core Content Area */}
        <main className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/deck/:deckId" element={<DeckDetails />} />
            <Route path="/study/:deckId" element={<StudySession />} />
            <Route path="/leitner" element={<LeitnerStats />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
