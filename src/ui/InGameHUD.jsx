import React from 'react';
import { useGameStore } from '../store/gameStore';
import { mobileInput } from '../game/Player';
import { Sparkles, Backpack, BookOpen, Trophy, Sliders, Eye, Volume2, VolumeX, Hand, ArrowUp } from 'lucide-react';

export function InGameHUD() {
  const gameMode = useGameStore(state => state.gameMode);
  const setGameMode = useGameStore(state => state.setGameMode);
  const openModal = useGameStore(state => state.openModal);
  const nearTarget = useGameStore(state => state.nearTarget);
  const stats = useGameStore(state => state.stats);
  const isRadioPlaying = useGameStore(state => state.isRadioPlaying);
  const toggleRadio = useGameStore(state => state.toggleRadio);
  const currentLocation = useGameStore(state => state.currentLocation);

  const touchGrass = useGameStore(state => state.touchGrass);
  const petCloud = useGameStore(state => state.petCloud);
  const feedRock = useGameStore(state => state.feedRock);
  const talkToNPC = useGameStore(state => state.talkToNPC);
  const enterPortal = useGameStore(state => state.enterPortal);
  const discoverSecret = useGameStore(state => state.discoverSecret);
  const toggleSkyLever = useGameStore(state => state.toggleSkyLever);

  if (gameMode !== 'playing') return null;

  const handleAction = () => {
    if (!nearTarget) {
      touchGrass();
      return;
    }
    switch (nearTarget.type) {
      case 'grass':
        touchGrass();
        break;
      case 'rock':
        feedRock('grass');
        break;
      case 'cloud':
        petCloud();
        break;
      case 'npc':
        talkToNPC();
        break;
      case 'portal':
        enterPortal();
        break;
      case 'frog':
      case 'chair':
      case 'message':
      case 'shrine':
        discoverSecret(nearTarget.type);
        break;
      case 'sky_switch':
        toggleSkyLever();
        break;
      default:
        touchGrass();
        break;
    }
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-6 select-none">
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        {/* Left: Quick Switch to Panoramic Cover View */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGameMode('cover')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full subtle-glass hover:bg-white/10 text-xs text-pink-200 transition-all shadow-sm"
            title="Switch back to title view"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="font-serif italic">Cover Panorama</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full subtle-glass text-[11px] text-slate-300">
            <span>📍 {currentLocation}</span>
          </div>
        </div>

        {/* Center: Live Quick Metrics */}
        <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full subtle-glass text-xs text-slate-200 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-300">
            🌾 {stats.grassBlades}
          </span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1.5 text-pink-300">
            ✋ {stats.timesTouched}
          </span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1.5 text-purple-300">
            ☁️ {stats.cloudPets}
          </span>
        </div>

        {/* Right: Quick Menu Buttons */}
        <div className="flex items-center gap-2">
          {/* Radio */}
          <button
            onClick={toggleRadio}
            className="w-8 h-8 rounded-full subtle-glass flex items-center justify-center text-pink-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Toggle Cloud Radio"
          >
            {isRadioPlaying ? <Volume2 className="w-4 h-4 text-pink-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Inventory */}
          <button
            onClick={() => openModal('inventory')}
            className="w-8 h-8 rounded-full subtle-glass flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Inventory Bag"
          >
            <Backpack className="w-4 h-4" />
          </button>

          {/* Journal */}
          <button
            onClick={() => openModal('journal')}
            className="w-8 h-8 rounded-full subtle-glass flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Discoveries Journal"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Achievements */}
          <button
            onClick={() => openModal('achievements')}
            className="w-8 h-8 rounded-full subtle-glass flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Achievements"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={() => openModal('settings')}
            className="w-8 h-8 rounded-full subtle-glass flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Settings & Controls"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Proximity Interaction Prompt (Center Screen) */}
      <div className="my-auto mx-auto pointer-events-auto">
        {nearTarget ? (
          <div className="flex flex-col items-center gap-2 animate-fade-in">
            <button
              onClick={handleAction}
              className="group flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900/80 border border-pink-500/50 backdrop-blur-md text-white shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <kbd className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-mono font-bold text-pink-200 border border-white/20">
                E
              </kbd>
              <span className="font-serif italic text-base text-pink-100">
                {nearTarget.label}
              </span>
              <span className="text-pink-300 text-xs opacity-75">
                ({nearTarget.name})
              </span>
            </button>
          </div>
        ) : (
          /* Subtle default prompt if wandering meadow */
          <div className="hidden sm:block opacity-40 hover:opacity-100 transition-opacity">
            <button
              onClick={touchGrass}
              className="px-4 py-1.5 rounded-full subtle-glass text-[11px] text-pink-200"
            >
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">E</kbd> or click to touch grass anywhere
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls Legend & Mobile Action Bar */}
      <div className="flex items-end justify-between w-full">
        {/* Desktop Controls Legend */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl subtle-glass text-[11px] text-slate-400 font-light pointer-events-auto">
          <span><strong className="text-slate-200">WASD</strong> Move</span>
          <span>·</span>
          <span><strong className="text-slate-200">Space</strong> Jump</span>
          <span>·</span>
          <span><strong className="text-slate-200">Shift</strong> Sprint</span>
          <span>·</span>
          <span><strong className="text-slate-200">E</strong> Interact</span>
          <span>·</span>
          <span><strong className="text-slate-200">Drag</strong> Rotate View</span>
        </div>

        {/* Mobile Action Buttons (Right Bottom) */}
        <div className="flex md:hidden items-center gap-3 ml-auto pointer-events-auto">
          {/* Jump Button */}
          <button
            onTouchStart={() => { mobileInput.jumpPressed = true; }}
            onClick={() => { mobileInput.jumpPressed = true; }}
            className="w-14 h-14 rounded-full subtle-glass active:bg-pink-500/40 flex flex-col items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
          >
            <ArrowUp className="w-5 h-5 text-pink-300" />
            <span className="text-[9px] uppercase tracking-wider text-slate-300">Jump</span>
          </button>

          {/* Action / Touch Button */}
          <button
            onClick={handleAction}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <Hand className="w-6 h-6" />
            <span className="text-[9px] uppercase tracking-wider font-medium">Touch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
