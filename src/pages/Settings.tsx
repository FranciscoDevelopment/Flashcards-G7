import React, { useRef, useState } from 'react';
import { useDeckStore } from '../store/useDeckStore';
import { Download, Upload, RotateCcw, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function Settings() {
  const { decks, cards, resetAll, importData } = useDeckStore((state) => ({
    decks: state.decks,
    cards: state.cards,
    resetAll: state.resetAll,
    importData: state.importData,
  }));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Backup downloader
  const handleBackup = () => {
    try {
      const backupData = {
        decks,
        cards,
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flashcards_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccessMsg('Backup generated and downloaded successfully!');
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg('Failed to generate backup.');
      setSuccessMsg(null);
    }
  };

  // Restore importer
  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        // Basic format check
        if (!parsed.decks || !parsed.cards || !Array.isArray(parsed.decks) || !Array.isArray(parsed.cards)) {
          throw new Error('Invalid file format. Backup must contain decks and cards array.');
        }

        importData(parsed.decks, parsed.cards);
        setSuccessMsg(`Successfully restored database with ${parsed.decks.length} decks and ${parsed.cards.length} cards!`);
        setErrorMsg(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to parse JSON file.');
        setSuccessMsg(null);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all data? This will delete custom decks and reset progress, seeding initial demo data.'
      )
    ) {
      resetAll();
      setSuccessMsg('Database reset to initial demo seeds.');
      setErrorMsg(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-900 pb-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">System Settings</h2>
        <p className="text-slate-400 mt-1">Manage card databases, export data backups, or restore local settings.</p>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="rounded-2xl border border-emerald-900/35 bg-emerald-950/15 p-4 flex gap-3 text-emerald-400 items-start text-sm">
          <CheckCircle className="shrink-0 mt-0.5" size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="rounded-2xl border border-rose-900/35 bg-rose-950/15 p-4 flex gap-3 text-rose-400 items-start text-sm">
          <AlertTriangle className="shrink-0 mt-0.5" size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Database Utilities */}
        <div className="bg-slate-900/10 border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white tracking-tight">Backup & Sync</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-white text-sm">Download Backup</h4>
                <p className="text-slate-500 text-xs mt-1">Save your custom decks, cards, and Leitner history to a local JSON file.</p>
              </div>
              <button
                onClick={handleBackup}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-slate-700 hover:text-white"
              >
                <Download size={14} />
                Export Data
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-white text-sm">Import Database</h4>
                <p className="text-slate-500 text-xs mt-1">Restore your cards or load external decks from a previously saved JSON backup.</p>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleRestore}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 border border-slate-850 hover:bg-slate-900 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                >
                  <Upload size={14} />
                  Upload JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-slate-900/10 border border-rose-950/20 rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-rose-400 tracking-tight">Danger Zone</h3>
          
          <div className="p-4 rounded-2xl bg-rose-950/5 border border-rose-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-rose-300 text-sm">Reset Everything</h4>
              <p className="text-slate-500 text-xs mt-1">Wipes your study logs, deletes all custom decks/cards, and re-seeds standard demo decks.</p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-rose-600/10"
            >
              <RotateCcw size={14} />
              Reset Database
            </button>
          </div>
        </div>

        {/* Tech Stack Info */}
        <div className="lg:col-span-2 bg-slate-900/10 border border-slate-900 rounded-3xl p-6 md:p-8 flex gap-5">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 shrink-0 self-start">
            <Info size={22} />
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-200">System Technical Specification</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              This Spaced Repetition study manager is written entirely in React 19 + TypeScript + Vite, using Tailwind CSS v3 for high-performance visual styling. Global states, including user data persistence and Leitner calculations, are handled atomically using Zustand, saving session logs instantly inside your browser's persistent `localStorage`.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
