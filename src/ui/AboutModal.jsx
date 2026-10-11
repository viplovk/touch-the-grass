import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Heart, Feather } from 'lucide-react';

export function AboutModal() {
  const activeModal = useGameStore(state => state.activeModal);
  const closeModal = useGameStore(state => state.closeModal);

  if (activeModal !== 'about') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl rounded-2xl bg-[#0f172a]/95 border border-slate-700/60 shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-950/60 border border-pink-800/60 flex items-center justify-center text-pink-300">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-light text-white">
                About Absolutely Nothing
              </h2>
              <p className="text-xs text-slate-400">
                A Manifesto for the Chronically Online.
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

        {/* Manifesto Prose */}
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-light">
          <p className="font-serif italic text-base text-pink-200">
            "We spend our days closing tabs, answering pings, beating deadlines, and optimizing every waking minute. Touch Grass Simulator is a sanctuary for doing the exact opposite."
          </p>

          <p>
            There is no timer ticking down. There is no leaderboard. No enemy will ever spawn, and no boss will demand your strategic reflexes.
          </p>

          <p>
            Here, on a handful of quiet floating islands suspended in a twilight dream, your only purpose is to exist.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="font-medium text-xs text-slate-200 uppercase tracking-wider font-mono">
              Core Principles of Play:
            </h4>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Touch grass as many or as few times as your soul desires.</li>
              <li>Offer snacks to the levitating stone (even if it remains emotionally unavailable).</li>
              <li>Pet the fluffy cloud creature when you need a gentle reminder that you exist.</li>
              <li>Enter the portal to nowhere and appreciate that arriving nowhere is completely okay.</li>
              <li>Listen to Cyril on the bench. Or don't. He won't hold a grudge.</li>
            </ul>
          </div>

          <p className="text-xs text-slate-400 italic">
            Built with procedural Web Audio, Three.js, and genuine creative intent.
          </p>
        </div>
      </div>
    </div>
  );
}
