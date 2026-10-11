// Procedural Web Audio Ambient Synthesizer & Sound FX Engine
// Generates warm, calming indie chords, gentle breeze, water streams, and charming interaction effects.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.ambientNodes = [];
    this.isPlayingMusic = false;
    this.currentTrackIndex = 0;
    this.droneInterval = null;
    this.windNode = null;
    
    this.tracks = [
      { id: 'drift', name: '01. Cloud Sea Drift', bpm: 60, scale: [196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00] }, // G Major pentatonic
      { id: 'reverie', name: '02. Sunset Reverie', bpm: 52, scale: [174.61, 220.00, 261.63, 329.63, 349.23, 440.00, 523.25] }, // F Maj7 / Dm
      { id: 'nothing', name: '03. The Meadow of Doing Nothing', bpm: 48, scale: [164.81, 196.00, 246.94, 293.66, 329.63, 392.00, 493.88] }, // E Minor pentatonic
    ];
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music Gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.startWindAmbience();
    } catch (e) {
      console.warn('AudioContext failed to initialize:', e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startWindAmbience() {
    if (!this.ctx || this.windNode) return;
    try {
      // Pink/Brown noise generator for gentle high-altitude wind
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      // Low frequency oscillator to breathe the wind
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(windGain);
      windGain.connect(this.musicGain);
      whiteNoise.start();

      this.windNode = { whiteNoise, lfo, windGain };
    } catch (e) {
      console.warn('Wind ambience error:', e);
    }
  }

  toggleMusic() {
    this.ensureContext();
    if (this.isPlayingMusic) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.isPlayingMusic;
  }

  startMusic() {
    this.ensureContext();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    this.playAmbientChord();
    this.droneInterval = setInterval(() => {
      if (this.isPlayingMusic) {
        this.playAmbientChord();
      }
    }, 4500);
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.droneInterval) {
      clearInterval(this.droneInterval);
      this.droneInterval = null;
    }
    this.ambientNodes.forEach(node => {
      try {
        node.gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
        setTimeout(() => node.osc.stop(), 1600);
      } catch (e) {}
    });
    this.ambientNodes = [];
  }

  setTrack(index) {
    this.currentTrackIndex = index % this.tracks.length;
    if (this.isPlayingMusic) {
      this.playAmbientChord();
    }
  }

  nextTrack() {
    this.setTrack((this.currentTrackIndex + 1) % this.tracks.length);
    return this.tracks[this.currentTrackIndex];
  }

  playAmbientChord() {
    if (!this.ctx || !this.isPlayingMusic) return;
    const track = this.tracks[this.currentTrackIndex];
    const scale = track.scale;

    // Pick 3-4 harmonic notes
    const rootIdx = Math.floor(Math.random() * (scale.length - 2));
    const chordNotes = [
      scale[rootIdx],
      scale[(rootIdx + 2) % scale.length],
      scale[(rootIdx + 4) % scale.length],
      (Math.random() > 0.4 ? scale[(rootIdx + 1) % scale.length] * 2 : null)
    ].filter(Boolean);

    const now = this.ctx.currentTime;
    chordNotes.forEach((freq, i) => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = i === 0 ? 'sine' : (Math.random() > 0.5 ? 'triangle' : 'sine');
        // Detune slightly for lush warmth
        osc.frequency.setValueAtTime(freq * (1 + (Math.random() * 0.008 - 0.004)), now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600 + Math.random() * 400, now);

        gain.gain.setValueAtTime(0.001, now);
        // Soft envelope: attack 1.5s, sustain, release 2.5s
        const attack = 1.2 + Math.random() * 0.8;
        const sustainDuration = 2.0 + Math.random() * 1.5;
        const targetGain = 0.045 / (i + 1);

        gain.gain.exponentialRampToValueAtTime(targetGain, now + attack);
        gain.gain.setValueAtTime(targetGain, now + attack + sustainDuration);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + sustainDuration + 2.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + attack + sustainDuration + 2.6);

        this.ambientNodes.push({ osc, gain });
        // Clean up old nodes
        setTimeout(() => {
          this.ambientNodes = this.ambientNodes.filter(n => n.osc !== osc);
        }, (attack + sustainDuration + 2.8) * 1000);
      } catch (e) {}
    });

    // Occasional gentle bell chime
    if (Math.random() > 0.35) {
      setTimeout(() => {
        if (this.isPlayingMusic) {
          const highNote = scale[Math.floor(Math.random() * scale.length)] * 2;
          this.playBell(highNote, 0.03);
        }
      }, 1800 + Math.random() * 1200);
    }
  }

  playBell(freq, volume = 0.05) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 1.85);
    } catch (e) {}
  }

  // --- Sound Effects ---

  playGrassTouch() {
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Soft organic rustle + resonant fairy chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      
      const pentatonic = [523.25, 659.25, 783.99, 880.00, 1046.50];
      const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      osc.frequency.setValueAtTime(note, now);
      osc.frequency.exponentialRampToValueAtTime(note * 1.33, now + 0.18);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {}
  }

  playCloudPet() {
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Soft cute bubbly squish
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.28);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.33);

      // Sparkle chime
      setTimeout(() => {
        this.playBell(1318.51, 0.06);
      }, 90);
    } catch (e) {}
  }

  playRockMunch() {
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Low stony crunch & hollow clonk
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  playJump() {
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.16);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.21);
    } catch (e) {}
  }

  playPortalWarp() {
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Cosmic shimmering sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 1.4);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 2.1);
    } catch (e) {}
  }

  playSecretUnlock() {
    this.ensureContext();
    if (!this.ctx) return;
    try {
      // Arpeggiated mystery chime chord
      const notes = [440.00, 554.37, 659.25, 880.00, 1108.73];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playBell(freq, 0.08);
        }, idx * 110);
      });
    } catch (e) {}
  }

  playSwitchLever() {
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  setMasterVolume(val) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  setMusicVolume(val) {
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  setSfxVolume(val) {
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

export const sound = new SoundEngine();
