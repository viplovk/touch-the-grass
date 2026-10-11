import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X, BookOpen, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export function JournalModal() {
  const activeModal = useGameStore(state => state.activeModal);
  const closeModal = useGameStore(state => state.closeModal);
  const secrets = useGameStore(state => state.secrets);
  const stats = useGameStore(state => state.stats);

  if (activeModal !== 'journal') return null;

  const secretList = Object.values(secrets);
  const foundCount = secretList.filter(s => s.found).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl rounded-2xl bg-[#0f172a]/95 border border-slate-700/60 shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-950/60 border border-pink-800/60 flex items-center justify-center text-pink-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-light text-white">
                Chronicle of Hidden Wonders
              </h2>
              <p className="text-xs text-slate-400">
                Discovered {foundCount} of {secretList.length} secret anomalies on the islands.
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

        {/* Secrets List */}
        <div className="flex flex-col gap-3">
          {secretList.map((secret, idx) => (
            <div
              key={secret.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                secret.found
                  ? 'bg-slate-900/80 border-pink-500/30'
                  : 'bg-slate-950/40 border-slate-800/50 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-lg ${
                  secret.found
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                    : 'bg-slate-800/60 text-slate-500 border border-slate-700/40'
                }`}
              >
                {secret.found ? (
                  idx === 0 ? '🐸' : idx === 1 ? '🪑' : idx === 2 ? '📜' : idx === 3 ? '🏛️' : '✨'
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-slate-100 flex items-center gap-2">
                    {secret.found ? secret.name : `Unrecorded Anomaly #${idx + 1}`}
                    {secret.found && (
                      <span className="text-[10px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full font-mono">
                        Discovered
                      </span>
                    )}
                  </h4>
                </div>

                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {secret.found ? secret.desc : 'Explore secluded cliffs, strange trees, boulders, and water edges to discover this secret.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
