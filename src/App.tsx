import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppRouter from './app/router';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Core Content Area */}
        <main className="flex-1 flex flex-col min-w-0 min-h-screen">
          <AppRouter />
        </main>
      </div>
    </Router>
  );
}

export default App;

