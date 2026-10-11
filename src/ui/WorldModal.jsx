import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X, MapPin, Compass } from 'lucide-react';

export function WorldModal() {
  const activeModal = useGameStore(state => state.activeModal);
  const closeModal = useGameStore(state => state.closeModal);
  const setGameMode = useGameStore(state => state.setGameMode);

  if (activeModal !== 'world') return null;

  const locations = [
    {
      name: 'The Central Meadow',
      desc: 'Lush mint-green grasses, wild daisies, and the resting spot of travelers who refuse to check their notifications.',
      icon: '🌿',
      coords: 'Center [0, 0]',
    },
    {
      name: 'The Cottage Porch',
      desc: 'Handcrafted timber dwelling with glowing amber lanterns, cedar shingles, and a fireplace that never burns out.',
      icon: '🏡',
      coords: 'East Terrace [x: +7]',
    },
    {
      name: 'The Portal Isle',
      desc: 'Ancient stone archway humming with luminous violet energy. Connects nowhere to nothing in record time.',
      icon: '🌀',
      coords: 'Northwest Archipelago [x: -16]',
    },
    {
      name: 'The Reflective Pond & Cascades',
      desc: 'Still azure waters with floating lily pads where Bartholomew the frog ponders the meaning of wetness.',
      icon: '💧',
      coords: 'West Cliff [x: -3.5]',
    },
    {
      name: 'The Celestial Verge',
      desc: 'The precipice of the world overlooking an ocean of pink clouds and the colossal ringed celestial sphere.',
      icon: '🪐',
      coords: 'South Edge [z: +7]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl rounded-2xl bg-[#0f172a]/95 border border-slate-700/60 shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-light text-white">
                Archipelago of Non-Urgency
              </h2>
              <p className="text-xs text-slate-400">
                A suspended sanctuary floating above an endless sea of twilight clouds.
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

        {/* Locations List */}
        <div className="flex flex-col gap-3">
          {locations.map((loc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                {loc.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-slate-100">
                    {loc.name}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-500">
                    {loc.coords}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {loc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Enter World Button */}
        <button
          onClick={() => {
            closeModal();
            setGameMode('playing');
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-sm transition-all shadow-md"
        >
          Explore Archipelago Now →
        </button>
      </div>
    </div>
  );
}
