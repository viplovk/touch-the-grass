import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { sound } from '../audio/soundEngine';
import { X, Sliders, Volume2, VolumeX, Sun, Moon, Sparkles, RefreshCw } from 'lucide-react';

export function SettingsModal() {
  const activeModal = useGameStore(state => state.activeModal);
  const closeModal = useGameStore(state => state.closeModal);
  const skyPreset = useGameStore(state => state.skyPreset);
  const isRadioPlaying = useGameStore(state => state.isRadioPlaying);
  const toggleRadio = useGameStore(state => state.toggleRadio);
  const resetProgress = useGameStore(state => state.resetProgress);

  const [masterVol, setMasterVol] = useState(70);
  const [musicVol, setMusicVol] = useState(50);
  const [sfxVol, setSfxVol] = useState(65);

  if (activeModal !== 'settings') return null;

  const handleMasterChange = (e) => {
    const val = Number(e.target.value);
    setMasterVol(val);
    sound.setMasterVolume(val / 100);
  };

  const handleMusicChange = (e) => {
    const val = Number(e.target.value);
    setMusicVol(val);
    sound.setMusicVolume(val / 100);
  };

  const handleSfxChange = (e) => {
    const val = Number(e.target.value);
    setSfxVol(val);
    sound.setSfxVolume(val / 100);
  };

  const presets = [
    { id: 'sunset', name: 'Sunset Dream', color: 'from-pink-500 to-purple-600' },
    { id: 'night', name: 'Deep Twilight', color: 'from-indigo-900 to-slate-900' },
    { id: 'dawn', name: 'Lavender Dawn', color: 'from-amber-400 to-pink-500' },
    { id: 'aurora', name: 'Teal Aurora', color: 'from-emerald-500 to-teal-800' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl rounded-2xl bg-[#0f172a]/95 border border-slate-700/60 shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-light text-white">
                Atmosphere & Controls
              </h2>
              <p className="text-xs text-slate-400">
                Adjust sound balance, celestial skies, and preferences.
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

        {/* Audio Sliders Section */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-slate-200 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-pink-400" />
              Procedural Soundscape
            </h4>
            <button
              onClick={toggleRadio}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isRadioPlaying
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {isRadioPlaying ? 'Synthesizer Active' : 'Sound Muted'}
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Master Volume</span>
                <span className="font-mono">{masterVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVol}
                onChange={handleMasterChange}
                className="w-full accent-pink-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Ambient Music & Wind</span>
                <span className="font-mono">{musicVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVol}
                onChange={handleMusicChange}
                className="w-full accent-pink-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Interaction Chimes (SFX)</span>
                <span className="font-mono">{sfxVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVol}
                onChange={handleSfxChange}
                className="w-full accent-pink-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Sky Preset Selector */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <h4 className="font-medium text-sm text-slate-200 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            Atmospheric Sky Presets
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => useGameStore.setState({ skyPreset: p.id })}
                className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
                  skyPreset === p.id
                    ? 'border-pink-400 bg-white/10 text-white shadow-sm'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`w-full h-3 rounded-sm bg-gradient-to-r ${p.color} mb-2`} />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Progress Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Saved automatically in localStorage
          </span>
          <button
            onClick={() => {
              if (window.confirm("Reset all grass touches and progress?")) {
                resetProgress();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400/80 hover:text-rose-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
}
