import { create } from 'zustand';
import { sound } from '../audio/soundEngine';

const STORAGE_KEY = 'touch_grass_simulator_save_v1';

const INITIAL_SECRETS = {
  frog: { id: 'frog', name: 'Bartholomew the Frog', found: false, desc: 'Resting calmly under a mossy boulder, thinking about pond physics.' },
  chair: { id: 'chair', name: 'The Floating Armchair', found: false, desc: 'A plush velvet chair hovering behind the cherry blossom tree with no explanation.' },
  message: { id: 'message', name: 'The Waterfall Inscription', found: false, desc: 'Carved into the wet rockface: "Nothing was lost here. Nothing was found. Enjoy the breeze."' },
  shrine: { id: 'shrine', name: 'Shrine of Doing Nothing', found: false, desc: 'An ancient monument erected by someone who had literally nothing better to do.' },
  sky_switch: { id: 'sky_switch', name: 'The Celestial Brass Lever', found: false, desc: 'A mysterious antique lever protruding from the stone that commands the atmosphere.' },
};

const INITIAL_ACHIEVEMENTS = [
  { id: 'first_touch', name: 'First Contact', desc: 'Touched grass once in a virtual realm.', unlocked: false, icon: '🌱' },
  { id: 'certified_botanist', name: 'Certified Botanist', desc: 'Touched grass 15 times. Your desktop misses you.', unlocked: false, icon: '🌿' },
  { id: 'cloud_therapist', name: 'Cloud Therapist', desc: 'Pet the sweet cloud creature 5 times.', unlocked: false, icon: '☁️' },
  { id: 'rock_whisperer', name: 'Rock Whisperer', desc: 'Offered delicious snacks to the floating stone 3 times.', unlocked: false, icon: '🪨' },
  { id: 'deep_thinker', name: 'Existential Resonance', desc: 'Spoke with the bench philosopher 5 times.', unlocked: false, icon: '🧘' },
  { id: 'lost_in_clouds', name: 'Lost in the Clouds', desc: 'Entered the portal to nowhere and returned intact.', unlocked: false, icon: '🌀' },
  { id: 'cosmic_architect', name: 'Master of the Sky', desc: 'Used the celestial lever to manipulate atmospheric daylight.', unlocked: false, icon: '✨' },
  { id: 'touch_become_grass', name: 'Touch Grass, Become Grass', desc: 'Reached 50 grass touches. You are practically photosynthesis itself.', unlocked: false, icon: '🌸' },
  { id: 'all_secrets', name: 'Grand Explorer of Nothing', desc: 'Discovered all 5 hidden secrets on the floating islands.', unlocked: false, icon: '🏆' },
];

const GRASS_MESSAGES = [
  "You have briefly reconnected with reality.",
  "Your screen time has decreased by 0.0001 seconds.",
  "The grass remembers your gentle touch.",
  "You are now officially qualified to stand outside.",
  "Nature has accepted your friend request.",
  "Silicon Valley hates this one simple, peaceful trick.",
  "Cellular regeneration: +0.0%. Inner calm: +100%.",
  "Warning: Continued grass touching may cause serene happiness.",
  "You feel slightly more hydrated in spirit.",
  "The blade gently leaned towards your fingertip.",
  "A tiny dewdrop reflected the entire sky.",
  "Productivity guilt has been converted into chlorophyll.",
  "You paused. The world continued. Everything is okay.",
  "An ant just gave you a respectful nod.",
  "Achievement unlocked: Being present in the current moment.",
];

const ROCK_RESPONSES = [
  { text: "Munch. The grass blade tasted like 3:00 PM on a Tuesday.", emotion: "satisfied" },
  { text: "Crunch. Thank you. I remain emotionally unavailable.", emotion: "stoic" },
  { text: "Pebble received. It is my cousin twice removed. Delicious.", emotion: "crunchy" },
  { text: "Daisy consumed. I feel 2% more romantic and 98% stone.", emotion: "poetic" },
  { text: "Nom. Do you ever think about the tectonic plates underneath everything?", emotion: "deep" },
  { text: "Gulp. I have no digestive tract, yet I crave snacks.", emotion: "mysterious" },
  { text: "I have floated here for 4,000 years. This snack was adequate.", emotion: "ancient" },
];

const CLOUD_THOUGHTS = [
  "I used to be rain in another life.",
  "I think the sky might be a simulation, but the sunset is pretty.",
  "I have completely forgotten how to precipitate, and I prefer it this way.",
  "Please do not perceive me too intensely; I am merely vapor.",
  "Your hand feels warm, like sunlit mist.",
  "Sometimes I pretend I am a fluffy sleeping sheep.",
  "If I drift too far, will you remind me which way is up?",
  "I am composed of 99% humidity and 1% sweet daydreams.",
];

const NPC_LINES = [
  "If a floating island falls and nobody is underneath, does gravity still complain?",
  "I came up here to avoid emails. Turns out clouds don't have Wi-Fi. It's bliss.",
  "I've been staring at that portal for three years. It goes to the exact spot it started from. Pure poetry.",
  "The rock doesn't talk much, but it's a great listener.",
  "Have you ever noticed that trees don't rush? Yet they grow anyway.",
  "I wrote an entire novel in my head yesterday. Today I decided to forget it.",
  "Someone told me time is money. I threw my watch off the cliff. Now I'm rich in minutes.",
  "The clouds smell like peppermint today. Or maybe I sat on a herb bush.",
  "Do you think the stars look at us and wonder if we have jobs?",
  "I like sitting here. The edge isn't scary once you realize falling is just spicy flying.",
  "The grass is exceptionally soft today. I gave it a five-star review.",
  "Yesterday a butterfly landed on my nose. We reached a mutual non-aggression pact.",
  "Why do people always want to arrive somewhere? Isn't being right here enough?",
  "I had an existential crisis this morning, but then the tea finished brewing.",
  "That celestial sphere in the sky... I wonder if someone is sitting on its grass looking back at us.",
  "Bartholomew the frog knows things. He won't tell you, but he knows.",
  "Don't worry about being productive. Even the waterfall takes breaks when nobody is watching.",
  "The secret to happiness is low expectations and plenty of daisies.",
  "Sometimes doing nothing is the hardest and most important work of all.",
  "I tried meditating, but my brain just started composing jazz music.",
  "Are we real, or are we just three-dimensional polygons drawn by a friendly coder?",
  "The wind told me a joke, but the punchline blew away.",
  "If you find that brass switch, pull it. It won't fix your life, but the sky looks miraculous.",
  "Drink water. Pet the cloud. Let the emails pile up like autumn leaves.",
  "You're doing great. Truly. Keep breathing.",
];

const loadInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        stats: {
          grassBlades: parsed.stats?.grassBlades ?? 23,
          timesTouched: parsed.stats?.timesTouched ?? 17,
          cloudPets: parsed.stats?.cloudPets ?? 5,
          rockMeals: parsed.stats?.rockMeals ?? 3,
          secretsFoundCount: parsed.stats?.secretsFoundCount ?? 1,
          portalTrips: parsed.stats?.portalTrips ?? 0,
          npcConversations: parsed.stats?.npcConversations ?? 0,
        },
        secrets: { ...INITIAL_SECRETS, ...(parsed.secrets || {}) },
        achievements: INITIAL_ACHIEVEMENTS.map(a => {
          const saved = parsed.achievements?.find(s => s.id === a.id);
          return saved ? { ...a, unlocked: saved.unlocked } : a;
        }),
        inventory: parsed.inventory || [
          { id: 'grass', name: 'Fresh Grass Blade', count: 23, desc: 'A tiny green blade that smells faintly of rain and peace.' },
          { id: 'daisy', name: 'Dewy Daisy', count: 4, desc: 'Picked from the meadow. Radiant and unbothered.' },
          { id: 'pebble', name: 'Floating Pebble', count: 2, desc: 'Weightless stone. The floating rock finds it moderately tasty.' },
          { id: 'cloud_fluff', name: 'Cloud Fluff', count: 1, desc: 'Condensed water vapor shaped like a marshmallow.' },
        ],
        skyPreset: parsed.skyPreset || 'sunset',
      };
    }
  } catch (e) {
    console.warn('Failed to load save state:', e);
  }
  return {
    stats: {
      grassBlades: 23,
      timesTouched: 17,
      cloudPets: 5,
      rockMeals: 3,
      secretsFoundCount: 1,
      portalTrips: 0,
      npcConversations: 0,
    },
    secrets: {
      ...INITIAL_SECRETS,
      message: { ...INITIAL_SECRETS.message, found: true }, // 1 secret discovered initially to match concept image (4/12 or 1/5)
    },
    achievements: INITIAL_ACHIEVEMENTS,
    inventory: [
      { id: 'grass', name: 'Fresh Grass Blade', count: 23, desc: 'A tiny green blade that smells faintly of rain and peace.' },
      { id: 'daisy', name: 'Dewy Daisy', count: 4, desc: 'Picked from the meadow. Radiant and unbothered.' },
      { id: 'pebble', name: 'Floating Pebble', count: 2, desc: 'Weightless stone. The floating rock finds it moderately tasty.' },
      { id: 'cloud_fluff', name: 'Cloud Fluff', count: 1, desc: 'Condensed water vapor shaped like a marshmallow.' },
    ],
    skyPreset: 'sunset',
  };
};

const savedState = loadInitialState();

export const useGameStore = create((set, get) => ({
  // Navigation & View Mode
  gameMode: 'cover', // 'cover' (cinematic title vista) | 'playing' (direct 3rd-person controls)
  currentLocation: 'The Floating Meadow',
  
  // Real stats
  stats: savedState.stats,
  secrets: savedState.secrets,
  achievements: savedState.achievements,
  inventory: savedState.inventory,

  // Environmental
  skyPreset: savedState.skyPreset, // 'sunset' | 'night' | 'dawn' | 'aurora'
  timeOfDay: 0.75, // 0 to 1

  // Active overlays
  activeModal: null, // null | 'world' | 'about' | 'journal' | 'inventory' | 'achievements' | 'settings' | 'controls'
  activeDialog: null,
  toastMessage: null,
  toastTimeout: null,
  unlockedAchievementToast: null,

  // Audio Radio
  isRadioPlaying: false,
  currentRadioTrack: sound.tracks[0].name,
  radioWaveActive: false,

  // Cinematic Sequences
  isPortalWarping: false,
  warpStep: 0,

  // Proximity interaction targets (set by 3D triggers)
  nearTarget: null, // { type: 'grass' | 'rock' | 'cloud' | 'npc' | 'portal' | 'frog' | 'chair' | 'message' | 'shrine' | 'sky_switch' | 'cottage', name, label, position }

  // Actions
  setGameMode: (mode) => {
    set({ gameMode: mode });
    if (mode === 'playing') {
      sound.ensureContext();
      if (!get().isRadioPlaying) {
        sound.startMusic();
        set({ isRadioPlaying: true, radioWaveActive: true });
      }
    }
  },

  openModal: (modalName) => set({ activeModal: modalName }),
  closeModal: () => set({ activeModal: null }),

  setNearTarget: (target) => set({ nearTarget: target }),

  showToast: (msg, duration = 3500) => {
    const { toastTimeout } = get();
    if (toastTimeout) clearTimeout(toastTimeout);
    const timeout = setTimeout(() => {
      set({ toastMessage: null, toastTimeout: null });
    }, duration);
    set({ toastMessage: msg, toastTimeout: timeout });
  },

  toggleRadio: () => {
    sound.ensureContext();
    const isPlaying = sound.toggleMusic();
    set({
      isRadioPlaying: isPlaying,
      radioWaveActive: isPlaying,
      currentRadioTrack: sound.tracks[sound.currentTrackIndex].name,
    });
  },

  nextRadioTrack: () => {
    sound.ensureContext();
    const track = sound.nextTrack();
    set({
      currentRadioTrack: track.name,
      isRadioPlaying: true,
      radioWaveActive: true,
    });
  },

  // Grass interaction
  touchGrass: () => {
    sound.playGrassTouch();
    const randomMsg = GRASS_MESSAGES[Math.floor(Math.random() * GRASS_MESSAGES.length)];
    const state = get();

    const newTimesTouched = state.stats.timesTouched + 1;
    const newGrassBlades = state.stats.grassBlades + 1;

    // Update inventory
    const newInventory = [...state.inventory];
    const grassItem = newInventory.find(i => i.id === 'grass');
    if (grassItem) {
      grassItem.count += 1;
    } else {
      newInventory.push({ id: 'grass', name: 'Fresh Grass Blade', count: 1, desc: 'A tiny green blade that smells faintly of rain and peace.' });
    }

    set(prev => ({
      stats: {
        ...prev.stats,
        timesTouched: newTimesTouched,
        grassBlades: newGrassBlades,
      },
      inventory: newInventory,
    }));

    state.showToast(randomMsg);
    state.checkAchievements();
    state.saveGame();
  },

  // Pet cloud
  petCloud: () => {
    sound.playCloudPet();
    const randomThought = CLOUD_THOUGHTS[Math.floor(Math.random() * CLOUD_THOUGHTS.length)];
    const state = get();
    const newCount = state.stats.cloudPets + 1;

    set(prev => ({
      stats: {
        ...prev.stats,
        cloudPets: newCount,
      },
      activeDialog: {
        character: 'cloud',
        title: 'Cumulus Softling',
        avatar: '☁️',
        text: `"${randomThought}"`,
        subtitle: 'The cloud gently ripples with lilac warmth and sighs peacefully.',
      },
    }));

    state.checkAchievements();
    state.saveGame();
  },

  // Feed rock
  feedRock: (foodId = 'grass') => {
    sound.playRockMunch();
    const state = get();
    const response = ROCK_RESPONSES[Math.floor(Math.random() * ROCK_RESPONSES.length)];
    const newCount = state.stats.rockMeals + 1;

    // Deduct food if available
    const newInventory = [...state.inventory];
    const item = newInventory.find(i => i.id === foodId);
    if (item && item.count > 0) {
      item.count -= 1;
    }

    set(prev => ({
      stats: {
        ...prev.stats,
        rockMeals: newCount,
      },
      inventory: newInventory,
      activeDialog: {
        character: 'rock',
        title: 'Geode the Levitating Stone',
        avatar: '🪨',
        text: `"${response.text}"`,
        subtitle: 'The stone chews slowly in midair, completely unfazed by your admiration.',
      },
    }));

    state.checkAchievements();
    state.saveGame();
  },

  // Speak with Existential NPC
  talkToNPC: () => {
    sound.ensureContext();
    sound.playBell(392.00, 0.04);
    const state = get();
    const lineIndex = Math.floor(Math.random() * NPC_LINES.length);
    const line = NPC_LINES[lineIndex];
    const newCount = state.stats.npcConversations + 1;

    set(prev => ({
      stats: {
        ...prev.stats,
        npcConversations: newCount,
      },
      activeDialog: {
        character: 'npc',
        title: 'Cyril the Bench Philosopher',
        avatar: '☕',
        text: `"${line}"`,
        subtitle: 'He sips fragrant tea from a tiny clay cup while contemplating the horizon.',
      },
    }));

    state.checkAchievements();
    state.saveGame();
  },

  // Step through portal to nowhere
  enterPortal: () => {
    sound.playPortalWarp();
    const state = get();
    set({
      isPortalWarping: true,
      warpStep: 1,
    });

    setTimeout(() => {
      set({ warpStep: 2 });
    }, 1800);

    setTimeout(() => {
      set({ warpStep: 3 });
    }, 3600);

    setTimeout(() => {
      set(prev => ({
        isPortalWarping: false,
        warpStep: 0,
        stats: {
          ...prev.stats,
          portalTrips: prev.stats.portalTrips + 1,
        },
      }));
      state.showToast("Cosmic journey complete: You arrived exactly where you belong.", 4000);
      state.checkAchievements();
      state.saveGame();
    }, 5400);
  },

  // Discover a secret
  discoverSecret: (secretKey) => {
    const state = get();
    const current = state.secrets[secretKey];
    if (current && !current.found) {
      sound.playSecretUnlock();
      const updatedSecrets = {
        ...state.secrets,
        [secretKey]: { ...current, found: true },
      };
      const foundCount = Object.values(updatedSecrets).filter(s => s.found).length;

      set(prev => ({
        secrets: updatedSecrets,
        stats: {
          ...prev.stats,
          secretsFoundCount: foundCount,
        },
      }));

      state.showToast(`Secret Discovered: ${current.name}!`, 4500);
      state.checkAchievements();
      state.saveGame();
    }
  },

  // Toggle sky lever
  toggleSkyLever: () => {
    sound.playSwitchLever();
    const state = get();
    const presets = ['sunset', 'night', 'dawn', 'aurora'];
    const currentIdx = presets.indexOf(state.skyPreset);
    const nextPreset = presets[(currentIdx + 1) % presets.length];

    state.discoverSecret('sky_switch');

    set({ skyPreset: nextPreset });
    state.showToast(`Atmosphere Shifted: ${nextPreset.toUpperCase()} glow cast upon the islands!`, 3000);
    state.saveGame();
  },

  // Close dialog
  closeDialog: () => set({ activeDialog: null }),

  // Achievements evaluation
  checkAchievements: () => {
    const state = get();
    const { stats, secrets } = state;
    const updated = state.achievements.map(ach => {
      if (ach.unlocked) return ach;
      let shouldUnlock = false;

      if (ach.id === 'first_touch' && stats.timesTouched >= 1) shouldUnlock = true;
      if (ach.id === 'certified_botanist' && stats.timesTouched >= 15) shouldUnlock = true;
      if (ach.id === 'cloud_therapist' && stats.cloudPets >= 5) shouldUnlock = true;
      if (ach.id === 'rock_whisperer' && stats.rockMeals >= 3) shouldUnlock = true;
      if (ach.id === 'deep_thinker' && stats.npcConversations >= 5) shouldUnlock = true;
      if (ach.id === 'lost_in_clouds' && stats.portalTrips >= 1) shouldUnlock = true;
      if (ach.id === 'cosmic_architect' && secrets.sky_switch?.found) shouldUnlock = true;
      if (ach.id === 'touch_become_grass' && stats.timesTouched >= 50) shouldUnlock = true;
      if (ach.id === 'all_secrets' && Object.values(secrets).every(s => s.found)) shouldUnlock = true;

      if (shouldUnlock) {
        sound.playSecretUnlock();
        set({ unlockedAchievementToast: ach });
        setTimeout(() => {
          set({ unlockedAchievementToast: null });
        }, 5000);
        return { ...ach, unlocked: true };
      }
      return ach;
    });

    set({ achievements: updated });
  },

  // Save game
  saveGame: () => {
    try {
      const state = get();
      const payload = {
        stats: state.stats,
        secrets: state.secrets,
        achievements: state.achievements,
        inventory: state.inventory,
        skyPreset: state.skyPreset,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },

  // Reset game
  resetProgress: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      stats: {
        grassBlades: 0,
        timesTouched: 0,
        cloudPets: 0,
        rockMeals: 0,
        secretsFoundCount: 0,
        portalTrips: 0,
        npcConversations: 0,
      },
      secrets: INITIAL_SECRETS,
      achievements: INITIAL_ACHIEVEMENTS,
      inventory: [
        { id: 'grass', name: 'Fresh Grass Blade', count: 0, desc: 'A tiny green blade that smells faintly of rain and peace.' },
      ],
      skyPreset: 'sunset',
    });
    get().showToast("Progress peacefully reset to blank slate.", 3000);
  },
}));
