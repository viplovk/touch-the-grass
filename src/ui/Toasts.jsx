import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Sparkles, Trophy } from 'lucide-react';

export function Toasts() {
  const toastMessage = useGameStore(state => state.toastMessage);
  const unlockedAchievementToast = useGameStore(state => state.unlockedAchievementToast);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-3 w-full max-w-md px-4 select-none">
      {/* Grass / Humorous Notification Toast */}
      {toastMessage && (
        <div className="px-5 py-3 rounded-full bg-slate-900/90 border border-pink-500/40 backdrop-blur-md shadow-2xl text-pink-100 text-xs sm:text-sm font-serif italic text-center animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-pink-400 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Achievement Unlocked Toast */}
      {unlockedAchievementToast && (
        <div className="p-4 rounded-2xl bg-amber-950/90 border border-amber-500/60 backdrop-blur-md shadow-2xl text-amber-100 flex items-center gap-3.5 animate-in fade-in slide-in-from-top-6 duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
            {unlockedAchievementToast.icon || '🏆'}
          </div>
          <div>
            <div className="text-[10px] tracking-widest uppercase font-mono text-amber-400 font-bold">
              Achievement Unlocked!
            </div>
            <h4 className="font-serif font-medium text-sm text-white">
              {unlockedAchievementToast.name}
            </h4>
            <p className="text-xs text-amber-200/80">
              {unlockedAchievementToast.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
