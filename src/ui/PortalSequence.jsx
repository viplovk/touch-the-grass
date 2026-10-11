import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Atom, Compass, Sparkles } from 'lucide-react';

export function PortalSequence() {
  const isPortalWarping = useGameStore(state => state.isPortalWarping);
  const warpStep = useGameStore(state => state.warpStep);

  if (!isPortalWarping) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl text-white select-none overflow-hidden">
      {/* Cosmic Energy Background Glow */}
      <div className="absolute inset-0 bg-radial from-purple-900/60 via-pink-950/40 to-black animate-pulse" />

      {/* Rotating Stargate Distortion Rings */}
      <div className="absolute w-[500px] h-[500px] rounded-full border border-purple-500/30 animate-spin" style={{ animationDuration: '6s' }} />
      <div className="absolute w-[360px] h-[360px] rounded-full border-2 border-pink-400/40 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
      <div className="absolute w-[220px] h-[220px] rounded-full border-4 border-violet-300/50 animate-ping" />

      {/* Main Narrative Card */}
      <div className="relative z-10 max-w-md mx-auto text-center p-8 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-pink-300">
          <Atom className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        <div className="space-y-3">
          <span className="text-[11px] tracking-[0.3em] uppercase text-pink-300 font-mono">
            {warpStep === 1 && "COLLAPSING QUANTUM TRAJECTORY..."}
            {warpStep === 2 && "EVALUATING COSMIC IRRELEVANCE..."}
            {warpStep === 3 && "CONVERGING ONTO ORIGINAL MANIFOLD..."}
          </span>

          <h2 className="font-serif text-3xl md:text-4xl font-light text-white leading-tight">
            {warpStep === 1 && "Traversing the Void of Nowhere"}
            {warpStep === 2 && "Calculating Meaning of Life"}
            {warpStep === 3 && "Returning to the Island"}
          </h2>

          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 font-mono text-xs text-purple-200/90 text-left space-y-1">
            <p>⟩ Target Coordinates: [ x: 0.00, y: 0.00, z: 0.00 ]</p>
            <p>⟩ Distance Traveled: 994,200 light-years</p>
            <p>⟩ Net Displacement: 0.00000 meters</p>
            <p className="text-pink-300 font-semibold">⟩ Conclusion: You were already where you needed to be.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
