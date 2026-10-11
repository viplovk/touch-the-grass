import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Sparkles, Heart, Apple } from 'lucide-react';

export function DialogModal() {
  const activeDialog = useGameStore(state => state.activeDialog);
  const closeDialog = useGameStore(state => state.closeDialog);
  const feedRock = useGameStore(state => state.feedRock);
  const petCloud = useGameStore(state => state.petCloud);
  const talkToNPC = useGameStore(state => state.talkToNPC);
  const inventory = useGameStore(state => state.inventory);

  if (!activeDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f172a]/90 border border-slate-700/60 shadow-2xl p-6 text-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with avatar & name */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xl shadow-inner">
              {activeDialog.avatar || '✨'}
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-white">
                {activeDialog.title}
              </h3>
              <p className="text-xs text-slate-400">
                {activeDialog.subtitle || 'Dweller of the Floating Archipelago'}
              </p>
            </div>
          </div>

          <button
            onClick={closeDialog}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dialog Prose / Thought */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <p className="font-serif italic text-base sm:text-lg text-pink-100 leading-relaxed">
            {activeDialog.text}
          </p>
        </div>

        {/* Contextual Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800">
          {activeDialog.character === 'rock' && (
            <>
              {/* Feeding options based on inventory */}
              {inventory.filter(item => item.count > 0).map(item => (
                <button
                  key={item.id}
                  onClick={() => feedRock(item.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-950/60 border border-amber-700/50 hover:bg-amber-900/60 text-amber-200 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Apple className="w-3.5 h-3.5 text-amber-400" />
                  Feed {item.name} ({item.count})
                </button>
              ))}
            </>
          )}

          {activeDialog.character === 'cloud' && (
            <button
              onClick={petCloud}
              className="px-4 py-2 rounded-lg bg-pink-900/60 border border-pink-700/50 hover:bg-pink-800/60 text-pink-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              Pet again (Squish gently)
            </button>
          )}

          {activeDialog.character === 'npc' && (
            <button
              onClick={talkToNPC}
              className="px-4 py-2 rounded-lg bg-purple-900/60 border border-purple-700/50 hover:bg-purple-800/60 text-purple-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Hear another thought
            </button>
          )}

          <button
            onClick={closeDialog}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            Peaceful silence
          </button>
        </div>
      </div>
    </div>
  );
}
