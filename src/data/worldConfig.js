export const ISLAND_CONFIG = {
  radius: 17,
  maxWalkRadius: 15.5,
  centerHeight: 1.6,
  edgeHeight: 0.1,
  cliffDepth: 4.5,
};

// Ground height calculator given (x, z)
export function getIslandHeight(x, z) {
  const dist = Math.sqrt(x * x + z * z);
  if (dist > ISLAND_CONFIG.maxWalkRadius + 2) {
    return -10; // Fell off
  }
  
  // Smooth bell/radial curve for terrain
  const normalizedDist = Math.min(1, dist / ISLAND_CONFIG.radius);
  // Add some gentle undulating noise
  const undulation = Math.sin(x * 0.4) * 0.25 + Math.cos(z * 0.35) * 0.25;
  const baseH = (1 - normalizedDist * normalizedDist) * ISLAND_CONFIG.centerHeight;
  
  // Pond dip
  const pondDist = Math.hypot(x - 3.5, z - 7.5);
  if (pondDist < 3.2) {
    const pondDepth = Math.max(0, (3.2 - pondDist) * 0.45);
    return Math.max(0.05, baseH + undulation - pondDepth);
  }
  
  return Math.max(0.1, baseH + undulation);
}

export const POI_LOCATIONS = {
  npc: {
    id: "npc",
    name: "The Existential Guy",
    position: [-8, 0, -4],
    prompt: "Talk to existential guy",
  },
  rock: {
    id: "rock",
    name: "The Floating Rock",
    position: [7, 0, -6],
    prompt: "Feed the floating rock",
  },
  cloud: {
    id: "cloud",
    name: "Fluffy Cloud",
    position: [11.5, 0, 5],
    prompt: "Pet the cloud",
  },
  portal: {
    id: "portal",
    name: "Portal to Nowhere",
    position: [0, 0, -13],
    prompt: "Step into Portal",
  },
  house: {
    id: "house",
    name: "Tiny Useless House",
    position: [-10.5, 0, 7.5],
    prompt: "Enter the Useless House",
  },
  pond: {
    id: "pond",
    name: "Dramatic Pond",
    position: [3.5, 0, 7.5],
    prompt: "Contemplate water",
  },
  shrine: {
    id: "shrine",
    name: "Shrine of Absolute Null",
    position: [12, 0, -3],
    prompt: "Pray to nothing",
  },
  frog: {
    id: "frog",
    name: "The Solitary Frog",
    position: [6.2, 0, 8.8],
    prompt: "Inspect secret frog",
  },
  chair: {
    id: "chair",
    name: "Floating Sky Chair",
    position: [-13.5, 0, -8.5],
    prompt: "Examine floating chair",
  },
  message: {
    id: "message",
    name: "Ancient Inscription",
    position: [-2.5, 0, 13.5],
    prompt: "Read hidden message",
  },
  crystal: {
    id: "crystal",
    name: "Chromatic Crystal",
    position: [-6.5, 0, 11],
    prompt: "Touch sky crystal",
  }
};

export const COLLECTIBLE_SPAWNS = [
  { id: "blade_1", x: -4, z: -2, type: "grass" },
  { id: "blade_2", x: -2, z: -6, type: "grass" },
  { id: "blade_3", x: 3, z: -3, type: "grass" },
  { id: "blade_4", x: 5, z: 2, type: "grass" },
  { id: "blade_5", x: -5, z: 4, type: "grass" },
  { id: "blade_6", x: -9, z: -1, type: "flower" },
  { id: "blade_7", x: -1, z: 5, type: "grass" },
  { id: "blade_8", x: 8, z: 1, type: "grass" },
  { id: "blade_9", x: 9, z: -4, type: "pebble" },
  { id: "blade_10", x: -3, z: 9, type: "grass" },
  { id: "blade_11", x: 1, z: -10, type: "grass" },
  { id: "blade_12", x: 6, z: -9, type: "pebble" },
  { id: "blade_13", x: -11, z: 2, type: "flower" },
  { id: "blade_14", x: 10, z: 8, type: "cloud_frag" },
  { id: "blade_15", x: -7, z: -9, type: "grass" },
  { id: "blade_16", x: 4, z: 11, type: "flower" },
  { id: "blade_17", x: -1, z: 12, type: "grass" },
  { id: "blade_18", x: 11, z: -7, type: "grass" },
];
