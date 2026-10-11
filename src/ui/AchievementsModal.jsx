import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Trophy, CheckCircle2, Lock } from 'lucide-react';

export function AchievementsModal() {
  const activeModal = useGameStore(state => state.activeModal);
  const closeModal = useGameStore(state => state.closeModal);
  const achievements = useGameStore(state => state.achievements);

  if (activeModal !== 'achievements') return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl rounded-2xl bg-[#0f172a]/95 border border-slate-700/60 shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-light text-white">
                Achievements of Non-Ambition
              </h2>
              <p className="text-xs text-slate-400">
                Unlocked {unlockedCount} of {achievements.length} badges of honor.
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                ach.unlocked
                  ? 'bg-slate-900/80 border-amber-500/40'
                  : 'bg-slate-950/40 border-slate-800/50 opacity-60'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 text-xl shadow-inner ${
                  ach.unlocked
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800/60 text-slate-500 border border-slate-700/40'
                }`}
              >
                {ach.unlocked ? ach.icon : <Lock className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-medium text-sm text-slate-100 truncate">
                    {ach.name}
                  </h4>
                  {ach.unlocked && (
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono shrink-0">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {ach.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
