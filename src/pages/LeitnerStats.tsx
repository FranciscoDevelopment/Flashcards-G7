import { useDeckStore } from '../store/useDeckStore';
import { HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { isCardDue } from '../utils/leitner';

export default function LeitnerStats() {
  const cards = useDeckStore((state) => state.cards);
  
  // Calculate card distribution
  const totalCards = cards.length;
  const boxCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as { [key: number]: number };
  const boxDueCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as { [key: number]: number };

  cards.forEach((card) => {
    const boxNum = card.box as number;
    if (boxNum >= 1 && boxNum <= 5) {
      boxCounts[boxNum] = (boxCounts[boxNum] || 0) + 1;
      if (isCardDue(card)) {
        boxDueCounts[boxNum] = (boxDueCounts[boxNum] || 0) + 1;
      }
    }
  });

  const boxDetails = [
    {
      level: 1,
      name: 'Box 1: Active Learning',
      interval: 'Daily (1 Day)',
      desc: 'New or challenging items requiring immediate review. Cards reset here on incorrect recall.',
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-400',
      bgGlow: 'rgba(239, 68, 68, 0.1)',
    },
    {
      level: 2,
      name: 'Box 2: Short-Term Retention',
      interval: 'Every 2 Days',
      desc: 'Items with initial recall validation. Reviewed every other day to solidify associations.',
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      bgGlow: 'rgba(245, 158, 11, 0.1)',
    },
    {
      level: 3,
      name: 'Box 3: Medium-Term Retention',
      interval: 'Every 5 Days',
      desc: 'Conceptual connections are forming. Study frequency is decreased to test deeper memory pathways.',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      bgGlow: 'rgba(16, 185, 129, 0.1)',
    },
    {
      level: 4,
      name: 'Box 4: Long-Term Memory',
      interval: 'Every 9 Days',
      desc: 'High memory retention. Reviewed once a week to safeguard against trace decay.',
      color: 'from-blue-500 to-indigo-655',
      textColor: 'text-blue-400',
      bgGlow: 'rgba(59, 130, 246, 0.1)',
    },
    {
      level: 5,
      name: 'Box 5: Semi-Permanent Mastery',
      interval: 'Every 15 Days',
      desc: 'Nearing permanent semantic memory. Items are rarely tested but kept on calendar.',
      color: 'from-violet-500 to-fuchsia-600',
      textColor: 'text-violet-400',
      bgGlow: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-900 pb-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Leitner Progress Tracking</h2>
        <p className="text-slate-400 mt-1">Visualize how cards flow through the spaced repetition scheduling system.</p>
      </div>

      {/* Spaced Repetition explanation banner */}
      <div className="rounded-2xl border border-violet-900/40 bg-violet-950/10 p-6 flex flex-col md:flex-row gap-5 items-start">
        <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400 border border-violet-500/20 shrink-0">
          <HelpCircle size={24} />
        </div>
        <div className="space-y-2">
          <h4 className="text-base font-bold text-violet-300">How the Leitner Spaced Repetition System works</h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            Spaced repetition schedules items based on your recall accuracy. When you answer a card **Correctly**, it graduates to the **Next Box**, multiplying the duration before you see it again. If you answer **Incorrectly**, the card resets to **Box 1** for daily review. This ensures you spend your time reviewing cards you actually struggle with, rather than wasting time on items you already know.
          </p>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-slate-900/10 border border-slate-900 rounded-3xl p-6 md:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white tracking-tight">System Distribution Chart</h3>
        
        {totalCards > 0 ? (
          <div className="space-y-6">
            <div className="flex items-end justify-between h-48 pt-4 px-2 md:px-10 border-b border-slate-900">
              {boxDetails.map((box) => {
                const count = boxCounts[box.level] || 0;
                const percent = totalCards > 0 ? (count / totalCards) * 100 : 0;
                const dueCount = boxDueCounts[box.level] || 0;

                return (
                  <div key={box.level} className="flex flex-col items-center flex-1 group">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900 border border-slate-800 text-[10px] px-2 py-1 rounded mb-2 absolute translate-y-[-110px] text-center z-10">
                      <span className="font-bold text-white block">{count} cards</span>
                      <span className="text-amber-400">{dueCount} due reviews</span>
                    </div>

                    {/* Bar */}
                    <div className="w-8 md:w-16 bg-slate-900 rounded-t-lg relative overflow-hidden flex flex-col justify-end" style={{ height: '100%', minHeight: '8px' }}>
                      {/* Bar fill */}
                      <div 
                        className={`w-full rounded-t-lg bg-gradient-to-t ${box.color} transition-all duration-500`}
                        style={{ height: `${percent || 4}%` }} // Default 4% tiny fill for 0 count so user sees the bar container
                      />
                      
                      {/* Due fill (overlaid) */}
                      {dueCount > 0 && (
                        <div 
                          className="w-full bg-amber-500/30 absolute bottom-0 border-t border-amber-400/50" 
                          style={{ height: `${(dueCount / totalCards) * 100}%` }}
                        />
                      )}
                    </div>

                    <span className="mt-3 text-xs font-mono text-slate-500">Box {box.level}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-center gap-6 flex-wrap text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded bg-violet-600 border border-violet-500/20" />
                Cards in Box
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded bg-amber-500 border border-amber-400/20" />
                Due Cards
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 text-sm">
            Please add cards to your decks to view distribution metrics.
          </div>
        )}
      </div>

      {/* Detailed Box Breakdowns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {boxDetails.map((box) => {
          const count = boxCounts[box.level] || 0;
          const dueCount = boxDueCounts[box.level] || 0;
          const percent = totalCards > 0 ? Math.round((count / totalCards) * 100) : 0;

          return (
            <div 
              key={box.level}
              className="rounded-2xl border border-slate-900 bg-slate-900/10 p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300"
              style={{ boxShadow: `inset 0 0 20px ${box.bgGlow}` }}
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-bold text-white text-base tracking-tight">{box.name}</h4>
                    <span className={`text-xs font-semibold ${box.textColor} uppercase tracking-wider`}>
                      Review: {box.interval}
                    </span>
                  </div>
                  
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-400 font-bold border border-slate-850">
                    {percent}% of stack
                  </span>
                </div>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                  {box.desc}
                </p>
              </div>

              {/* Box stats progress indicator */}
              <div className="border-t border-slate-900 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white">{count}</span>
                  <span className="text-xs text-slate-500 font-semibold">cards</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-850/65">
                  {dueCount > 0 ? (
                    <>
                      <AlertCircle size={12} className="text-amber-500" />
                      <span className="text-amber-400">{dueCount} reviews due</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span className="text-slate-400">All caught up</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
