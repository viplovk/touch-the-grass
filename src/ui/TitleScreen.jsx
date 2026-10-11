import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Volume2, VolumeX, Play, Compass, Sparkles, Hand, Trees, MessageCircle, Cloud, Disc, Menu } from 'lucide-react';

export function TitleScreen() {
  const gameMode = useGameStore(state => state.gameMode);
  const setGameMode = useGameStore(state => state.setGameMode);
  const openModal = useGameStore(state => state.openModal);
  const stats = useGameStore(state => state.stats);
  const isRadioPlaying = useGameStore(state => state.isRadioPlaying);
  const toggleRadio = useGameStore(state => state.toggleRadio);
  const currentLocation = useGameStore(state => state.currentLocation);
  const touchGrass = useGameStore(state => state.touchGrass);
  const petCloud = useGameStore(state => state.petCloud);
  const feedRock = useGameStore(state => state.feedRock);

  if (gameMode !== 'cover') return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-10 select-none">
      {/* =========================================================
          TOP NAVIGATION BAR (Matching concept image)
          ========================================================= */}
      <header className="flex items-center justify-between w-full pointer-events-auto">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setGameMode('cover')}>
          <div className="flex flex-col">
            <span className="font-serif text-2xl md:text-3xl font-light tracking-tight text-white group-hover:text-pink-200 transition-colors">
              touch grass<span className="text-pink-300 ml-1 text-lg">✦</span>
            </span>
            <span className="text-[10px] tracking-[0.25em] text-pink-200/80 uppercase font-sans font-medium -mt-1">
              simulator
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-light tracking-wide text-slate-200/90">
          <button
            onClick={() => setGameMode('cover')}
            className="hover:text-white border-b-2 border-pink-400 pb-0.5 transition-colors"
          >
            home
          </button>
          <button
            onClick={() => openModal('world')}
            className="hover:text-white border-b-2 border-transparent hover:border-pink-300/40 pb-0.5 transition-colors"
          >
            world
          </button>
          <button
            onClick={() => openModal('about')}
            className="hover:text-white border-b-2 border-transparent hover:border-pink-300/40 pb-0.5 transition-colors"
          >
            about nothing
          </button>
          <button
            onClick={() => openModal('journal')}
            className="hover:text-white border-b-2 border-transparent hover:border-pink-300/40 pb-0.5 transition-colors"
          >
            discoveries
          </button>
          <button
            onClick={() => setGameMode('playing')}
            className="hover:text-white border-b-2 border-transparent hover:border-pink-300/40 pb-0.5 transition-colors"
          >
            play
          </button>
        </nav>

        {/* Right Section: Cloud Radio & Menu Button */}
        <div className="flex items-center gap-4">
          {/* Cloud Radio Player */}
          <button
            onClick={toggleRadio}
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-full subtle-glass hover:bg-white/10 transition-all text-xs text-slate-200"
            title="Toggle procedural ambient lo-fi synth"
          >
            {/* Equalizer animation */}
            <div className="flex items-end gap-0.5 h-3.5 w-4">
              <span className={`w-0.5 bg-pink-400 rounded-full transition-all duration-300 ${isRadioPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
              <span className={`w-0.5 bg-pink-300 rounded-full transition-all duration-200 ${isRadioPlaying ? 'h-3.5 animate-bounce' : 'h-1.5'}`} />
              <span className={`w-0.5 bg-purple-300 rounded-full transition-all duration-400 ${isRadioPlaying ? 'h-2 animate-pulse' : 'h-1'}`} />
              <span className={`w-0.5 bg-pink-400 rounded-full transition-all duration-300 ${isRadioPlaying ? 'h-3 animate-bounce' : 'h-1.5'}`} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] tracking-wider text-slate-400 uppercase">now playing</span>
              <span className="font-medium text-pink-100 text-xs whitespace-nowrap">cloud radio</span>
            </div>
          </button>

          {/* Quick Menu Button */}
          <button
            onClick={() => openModal('settings')}
            className="w-9 h-9 rounded-full subtle-glass flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/15 transition-all"
            title="Settings & Controls"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================================================
          HERO STATEMENT & EDITORIAL POETRY (Matching image.png)
          ========================================================= */}
      <div className="my-auto max-w-xl pointer-events-auto pt-8">
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-tight leading-[1.05] text-glow mb-4">
          a game<br />
          about<br />
          absolutely<br />
          nothing.
        </h1>

        <p className="text-slate-300/80 font-light tracking-[0.2em] text-xs sm:text-sm uppercase mb-8">
          explore · touch · collect · exist
        </p>

        {/* Primary CTA: ENTER THE WORLD */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setGameMode('playing')}
            className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-500/80 via-pink-500/80 to-purple-600/80 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-sm tracking-wide shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
            </div>
            <span>enter the world</span>
            <span className="text-pink-200 group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button
            onClick={touchGrass}
            className="px-5 py-3 rounded-full subtle-glass hover:bg-white/10 text-pink-200 font-light text-xs tracking-wider transition-all hover:scale-105"
            title="Quick grass touch"
          >
            🌱 touch grass now
          </button>
        </div>
      </div>

      {/* Floating Whimsical Text Callouts pointing toward 3D creatures */}
      <div className="hidden lg:block absolute left-[24%] top-[48%] pointer-events-auto">
        <button
          onClick={petCloud}
          className="text-pink-200/90 hover:text-white font-serif italic text-sm transition-transform hover:scale-110 flex items-center gap-1.5"
        >
          <span className="text-xs">⤹</span> pet me! ♡
        </button>
      </div>

      <div className="hidden lg:block absolute right-[28%] top-[30%] pointer-events-auto">
        <button
          onClick={() => feedRock('grass')}
          className="text-pink-200/90 hover:text-white font-serif italic text-sm transition-transform hover:scale-110 flex items-center gap-1.5"
        >
          feed me... 🌱 <span className="text-xs">⤦</span>
        </button>
      </div>

      <div className="hidden xl:block absolute right-16 top-1/3 text-right">
        <p className="text-[11px] tracking-[0.3em] text-pink-200/70 font-sans font-light uppercase leading-loose">
          same<br />
          sky<br />
          different<br />
          thoughts<br />
          //
        </p>
      </div>

      {/* Wooden Sign Callout (Bottom Left) */}
      <div className="hidden sm:block absolute left-8 bottom-32 pointer-events-auto">
        <div
          onClick={touchGrass}
          className="cursor-pointer group p-3.5 rounded-lg bg-amber-950/60 border border-amber-800/40 backdrop-blur-sm text-amber-200/90 max-w-[140px] transform -rotate-3 hover:rotate-0 transition-transform shadow-md"
        >
          <p className="font-serif text-sm leading-tight group-hover:text-amber-100">
            touch grass
          </p>
          <p className="text-[10px] text-amber-300/70 italic mt-0.5">
            be happier (maybe)
          </p>
        </div>
      </div>

      {/* =========================================================
          BOTTOM METRICS STRIP & LOCATION DOCK (Matching image.png)
          ========================================================= */}
      <footer className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
        {/* Main Stats Strip */}
        <div className="flex flex-wrap items-center justify-around md:justify-start gap-4 sm:gap-8 px-6 py-3 rounded-2xl subtle-glass text-slate-200 max-w-full">
          {/* Grass Blades */}
          <div className="flex items-center gap-2.5 cursor-pointer hover:text-emerald-300 transition-colors" onClick={() => openModal('inventory')}>
            <span className="text-emerald-400 text-lg">🌾</span>
            <div className="flex flex-col">
              <span className="font-mono text-base font-medium leading-none text-white">{stats.grassBlades}</span>
              <span className="text-[10px] text-slate-400 font-light mt-0.5 whitespace-nowrap">grass blades</span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          {/* Times Touched */}
          <div className="flex items-center gap-2.5 cursor-pointer hover:text-pink-300 transition-colors" onClick={touchGrass}>
            <span className="text-pink-400 text-base">✋</span>
            <div className="flex flex-col">
              <span className="font-mono text-base font-medium leading-none text-white">{stats.timesTouched}</span>
              <span className="text-[10px] text-slate-400 font-light mt-0.5 whitespace-nowrap">times touched</span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          {/* Cloud Pets */}
          <div className="flex items-center gap-2.5 cursor-pointer hover:text-purple-300 transition-colors" onClick={petCloud}>
            <span className="text-purple-300 text-base">☁️</span>
            <div className="flex flex-col">
              <span className="font-mono text-base font-medium leading-none text-white">{stats.cloudPets}</span>
              <span className="text-[10px] text-slate-400 font-light mt-0.5 whitespace-nowrap">cloud pets</span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          {/* Rock Meals */}
          <div className="flex items-center gap-2.5 cursor-pointer hover:text-amber-300 transition-colors" onClick={() => feedRock('grass')}>
            <span className="text-amber-400 text-base">🪨</span>
            <div className="flex flex-col">
              <span className="font-mono text-base font-medium leading-none text-white">{stats.rockMeals}</span>
              <span className="text-[10px] text-slate-400 font-light mt-0.5 whitespace-nowrap">rock meals</span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          {/* Secrets Found */}
          <div className="flex items-center gap-2.5 cursor-pointer hover:text-pink-300 transition-colors" onClick={() => openModal('journal')}>
            <span className="text-pink-400 text-base">✦</span>
            <div className="flex flex-col">
              <span className="font-mono text-base font-medium leading-none text-white">{stats.secretsFoundCount} / 5</span>
              <span className="text-[10px] text-slate-400 font-light mt-0.5 whitespace-nowrap">secrets found</span>
            </div>
          </div>
        </div>

        {/* Location Badge (Matching bottom-right of concept image) */}
        <div
          onClick={() => openModal('world')}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl subtle-glass hover:bg-white/10 cursor-pointer transition-all text-xs"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center text-sm shadow-inner">
            🏝️
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] tracking-wider text-slate-400 uppercase">current location</span>
            <span className="font-medium text-slate-100 whitespace-nowrap">{currentLocation}</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-slate-400 ml-1">
            →
          </div>
        </div>
      </footer>
    </div>
  );
}
