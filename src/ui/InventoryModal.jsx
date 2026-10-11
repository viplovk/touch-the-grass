import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Backpack, Sparkles, Sprout } from 'lucide-react';

export function InventoryModal() {
  const activeModal = useGameStore(state => state.activeModal);
  const closeModal = useGameStore(state => state.closeModal);
  const inventory = useGameStore(state => state.inventory);
  const showToast = useGameStore(state => state.showToast);

  if (activeModal !== 'inventory') return null;

  const itemIcons = {
    grass: '🌾',
    daisy: '🌼',
    pebble: '🪨',
    cloud_fluff: '☁️',
    clover: '🍀',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl rounded-2xl bg-[#0f172a]/95 border border-slate-700/60 shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-300">
              <Backpack className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-light text-white">
                Explorer's Knapsack
              </h2>
              <p className="text-xs text-slate-400">
                Priceless treasures that serve absolutely no productive purpose.
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

        {/* Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {inventory.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3.5 group"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                {itemIcons[item.id] || '✨'}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-sm text-slate-100 truncate">
                    {item.name}
                  </h4>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-white/10 text-pink-300 font-bold shrink-0">
                    x{item.count}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Collectible
                  </span>
                  <button
                    onClick={() => showToast(`You held ${item.name} up to the sunset. It looked serene.`)}
                    className="text-[11px] text-pink-300 hover:text-pink-200 transition-colors"
                  >
                    Admire →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
