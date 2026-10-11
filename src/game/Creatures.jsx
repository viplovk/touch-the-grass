import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export function Creatures() {
  return (
    <group>
      {/* 1. The Floating Rock ("feed me... 🌱") */}
      <FloatingRock position={[4.6, 3.2, -1]} />

      {/* 2. The Pet-able Fluffy Cloud ("pet me! ♡") */}
      <PetCloud position={[-5.5, 1.8, 2.5]} />

      {/* 3. Cyril the Existential Philosopher on Bench */}
      <ExistentialBench position={[0.5, 0.5, 6.8]} />

      {/* Hidden Discoveries & Secrets */}
      {/* Secret: Bartholomew the Frog */}
      <SecretFrog position={[-4.8, 0.55, -3.6]} />

      {/* Secret: The Floating Armchair */}
      <SecretChair position={[-9.2, 1.6, 0.4]} />

      {/* Secret: Waterfall Inscription */}
      <SecretWaterfallInscription position={[-2.8, 0.2, -5.2]} />

      {/* Secret: Shrine of Doing Nothing */}
      <SecretShrine position={[8.2, 0.55, -4.2]} />

      {/* Secret: Celestial Sky Lever */}
      <CelestialLever position={[-1.2, 0.55, -2.8]} />
    </group>
  );
}

// ==========================================
// 1. FLOATING ROCK CREATURE
// ==========================================
function FloatingRock({ position }) {
  const rockRef = useRef();
  const feedRock = useGameStore(state => state.feedRock);
  const [squish, setSquish] = useState(1);

  useFrame(({ clock }) => {
    if (rockRef.current) {
      const time = clock.getElapsedTime();
      // Gentle bobbing and floating sway
      rockRef.current.position.y = position[1] + Math.sin(time * 1.4) * 0.22;
      rockRef.current.rotation.y = Math.sin(time * 0.7) * 0.15;
      rockRef.current.rotation.z = Math.cos(time * 0.9) * 0.08;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setSquish(1.2);
    setTimeout(() => setSquish(1), 250);
    feedRock('grass');
  };

  return (
    <group ref={rockRef} position={position} onClick={handleClick} scale={[squish, 1 / squish, squish]}>
      {/* Main boulder body */}
      <mesh castShadow>
        <dodecahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#9ca3af" // Light stony grey
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Little Sprout & Leaves on Top of the Rock */}
      <group position={[0, 1.15, 0]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.25, 5]} />
          <meshStandardMaterial color="#84cc16" />
        </mesh>
        {/* Leaf 1 */}
        <mesh position={[0.1, 0.22, 0]} rotation={[0, 0, -0.6]} scale={[0.14, 0.04, 0.08]}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#84cc16" />
        </mesh>
        {/* Leaf 2 */}
        <mesh position={[-0.1, 0.22, 0]} rotation={[0, 0, 0.6]} scale={[0.14, 0.04, 0.08]}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#65a30d" />
        </mesh>

        {/* Tiny Resting Bird */}
        <group position={[0.18, 0.15, 0.15]} scale={[0.12, 0.12, 0.12]}>
          <mesh>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[0.8, 0.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.4, 0.8, 4]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
        </group>
      </group>

      {/* Cute Sleepy Face Features: Closed Curved Eyes & Little Smile */}
      {/* Left Eye: ( - ) */}
      <mesh position={[-0.32, 0.15, 1.08]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.22, 0.04, 0.02]} />
        <meshBasicMaterial color="#374151" />
      </mesh>
      {/* Right Eye: ( - ) */}
      <mesh position={[0.32, 0.15, 1.08]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.22, 0.04, 0.02]} />
        <meshBasicMaterial color="#374151" />
      </mesh>
      {/* Cute Mouth: ( v ) */}
      <mesh position={[0, -0.08, 1.15]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.07, 6, 6]} />
        <meshBasicMaterial color="#4b5563" />
      </mesh>

      {/* Rosy Cheeks */}
      <mesh position={[-0.45, -0.02, 1.05]}>
        <circleGeometry args={[0.1, 8]} />
        <meshBasicMaterial color="#f472b6" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.45, -0.02, 1.05]}>
        <circleGeometry args={[0.1, 8]} />
        <meshBasicMaterial color="#f472b6" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Subtle Warm Halo Glow */}
      <pointLight color="#fef08a" intensity={0.8} distance={4} />
    </group>
  );
}

// ==========================================
// 2. PET-ABLE FLUFFY CLOUD CREATURE
// ==========================================
function PetCloud({ position }) {
  const cloudRef = useRef();
  const petCloud = useGameStore(state => state.petCloud);
  const [squish, setSquish] = useState(1);

  useFrame(({ clock }) => {
    if (cloudRef.current) {
      const time = clock.getElapsedTime();
      // Gentle lazy breathing
      cloudRef.current.position.y = position[1] + Math.sin(time * 1.6) * 0.18;
      cloudRef.current.rotation.y = Math.sin(time * 0.5) * 0.12;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    // Squish animation on pet
    setSquish(0.65);
    setTimeout(() => setSquish(1.15), 180);
    setTimeout(() => setSquish(1), 360);
    petCloud();
  };

  return (
    <group
      ref={cloudRef}
      position={position}
      onClick={handleClick}
      scale={[1 / Math.sqrt(squish), squish, 1 / Math.sqrt(squish)]}
    >
      {/* Soft Overlapping Puffy Spheres (Cloud Body) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#fdf2f8" roughness={0.85} />
      </mesh>
      <mesh position={[0.9, -0.2, 0.2]}>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.85} />
      </mesh>
      <mesh position={[-0.85, -0.15, -0.1]}>
        <sphereGeometry args={[0.95, 12, 12]} />
        <meshStandardMaterial color="#fdf2f8" roughness={0.85} />
      </mesh>
      <mesh position={[0.3, 0.65, -0.2]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial color="#fff1f2" roughness={0.85} />
      </mesh>

      {/* Kawaii Cute Face: Big Sparkly Dark Eyes + Smile (Matching image.png) */}
      {/* Left Eye */}
      <mesh position={[-0.32, 0.15, 1.15]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color="#1e1b4b" />
      </mesh>
      {/* Left Eye Highlight Sparkle */}
      <mesh position={[-0.3, 0.18, 1.22]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Right Eye */}
      <mesh position={[0.32, 0.15, 1.15]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color="#1e1b4b" />
      </mesh>
      {/* Right Eye Highlight Sparkle */}
      <mesh position={[0.34, 0.18, 1.22]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Cute Cat Smile: ( 3 ) */}
      <mesh position={[0, -0.05, 1.18]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color="#475569" />
      </mesh>

      {/* Blushing Pink Cheeks */}
      <mesh position={[-0.55, -0.02, 0.98]}>
        <circleGeometry args={[0.15, 10]} />
        <meshBasicMaterial color="#fb7185" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.55, -0.02, 0.98]}>
        <circleGeometry args={[0.15, 10]} />
        <meshBasicMaterial color="#fb7185" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Soft Rosy Aura Light */}
      <pointLight color="#f472b6" intensity={1.5} distance={5} />
    </group>
  );
}

// ==========================================
// 3. EXISTENTIAL NPC ON CLIFF BENCH
// ==========================================
function ExistentialBench({ position }) {
  const talkToNPC = useGameStore(state => state.talkToNPC);

  return (
    <group position={position} rotation={[0, 0, 0]}>
      {/* Rustic Wooden Bench */}
      {/* Bench Seat */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.2, 0.08, 0.7]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.8} />
      </mesh>
      {/* Bench Backrest */}
      <mesh position={[0, 0.75, -0.32]}>
        <boxGeometry args={[2.2, 0.35, 0.06]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.8} />
      </mesh>
      {/* Bench Legs */}
      {[-0.85, 0.85].map((lx, i) => (
        <group key={i} position={[lx, 0.17, 0]}>
          <mesh position={[0, 0, -0.25]}>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 6]} />
            <meshStandardMaterial color="#4e342e" />
          </mesh>
          <mesh position={[0, 0, 0.25]}>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 6]} />
            <meshStandardMaterial color="#4e342e" />
          </mesh>
        </group>
      ))}

      {/* Cyril the Philosopher Character (Sitting) */}
      <group position={[-0.35, 0.38, 0.05]} onClick={talkToNPC}>
        {/* Legs / Pants */}
        <mesh position={[0, 0.08, 0.15]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.35, 0.18, 0.4]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Torso / Sweater */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.42, 0.45, 0.3]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        {/* Knitted Scarf */}
        <mesh position={[0, 0.65, 0.02]}>
          <torusGeometry args={[0.18, 0.07, 8, 16]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.88, 0]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.5} />
        </mesh>
        {/* Beanie Hat */}
        <mesh position={[0, 0.98, -0.02]} rotation={[-0.2, 0, 0]}>
          <sphereGeometry args={[0.21, 10, 10]} />
          <meshStandardMaterial color="#047857" />
        </mesh>
        {/* Clay Tea Cup held in hands */}
        <mesh position={[0, 0.42, 0.24]}>
          <cylinderGeometry args={[0.06, 0.05, 0.1, 8]} />
          <meshStandardMaterial color="#e0e7ff" />
        </mesh>
      </group>

      {/* Cute Round White Companion Pet (Beside him, matching image.png) */}
      <group position={[0.45, 0.42, 0.05]} onClick={talkToNPC}>
        {/* Round body */}
        <mesh>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </mesh>
        {/* Tiny dark ears */}
        <mesh position={[-0.14, 0.22, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.14, 0.22, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        {/* Tiny black tail */}
        <mesh position={[0, -0.05, -0.22]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        {/* Sleepy eye dots */}
        <mesh position={[-0.08, 0.04, 0.23]}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.08, 0.04, 0.23]}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// 4. SECRET: BARTHOLOMEW THE FROG
// ==========================================
function SecretFrog({ position }) {
  const discoverSecret = useGameStore(state => state.discoverSecret);
  const secrets = useGameStore(state => state.secrets);
  const [bounced, setBounced] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setBounced(true);
    setTimeout(() => setBounced(false), 500);
    discoverSecret('frog');
  };

  return (
    <group position={position} onClick={handleClick}>
      {/* Mossy Cover Rock */}
      <mesh position={[0.25, 0.18, 0]}>
        <dodecahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      {/* Green Frog Body */}
      <group position={[-0.15, bounced ? 0.35 : 0.1, 0]}>
        <mesh scale={[0.2, 0.15, 0.2]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#22c55e" roughness={0.6} />
        </mesh>
        {/* Frog Big Eyes */}
        <mesh position={[-0.1, 0.14, 0.1]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.1, 0.14, 0.1]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* Little Water Lily Leaf Hat */}
        <mesh position={[0, 0.18, 0]} rotation={[-0.2, 0, 0]}>
          <circleGeometry args={[0.14, 8]} />
          <meshStandardMaterial color="#84cc16" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// 5. SECRET: THE FLOATING ARMCHAIR
// ==========================================
function SecretChair({ position }) {
  const chairRef = useRef();
  const discoverSecret = useGameStore(state => state.discoverSecret);

  useFrame(({ clock }) => {
    if (chairRef.current) {
      chairRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.2) * 0.12;
      chairRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.1;
    }
  });

  return (
    <group ref={chairRef} position={position} onClick={() => discoverSecret('chair')}>
      {/* Plush Red Velvet Cushion */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.85, 0.3, 0.8]} />
        <meshStandardMaterial color="#be123c" roughness={0.6} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.55, -0.32]}>
        <boxGeometry args={[0.85, 0.85, 0.2]} />
        <meshStandardMaterial color="#9f1239" roughness={0.6} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.4, 0.25, 0]}>
        <boxGeometry args={[0.15, 0.35, 0.8]} />
        <meshStandardMaterial color="#9f1239" roughness={0.6} />
      </mesh>
      <mesh position={[0.4, 0.25, 0]}>
        <boxGeometry args={[0.15, 0.35, 0.8]} />
        <meshStandardMaterial color="#9f1239" roughness={0.6} />
      </mesh>
      {/* Golden accent legs (dangling without touching ground) */}
      {[-0.32, 0.32].map((x, i) => (
        <mesh key={i} position={[x, -0.22, 0]}>
          <cylinderGeometry args={[0.03, 0.02, 0.2, 6]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// 6. SECRET: WATERFALL INSCRIPTION
// ==========================================
function SecretWaterfallInscription({ position }) {
  const discoverSecret = useGameStore(state => state.discoverSecret);

  return (
    <group position={position} onClick={() => discoverSecret('message')}>
      {/* Wet Cliff Stone Slab */}
      <mesh rotation={[0, 0.3, 0]}>
        <boxGeometry args={[1.6, 1.2, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Glowing Ancient Carved Runes */}
      <mesh position={[0, 0, 0.12]} rotation={[0, 0.3, 0]}>
        <planeGeometry args={[1.3, 0.8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
      <pointLight color="#0284c7" intensity={0.8} distance={3} />
    </group>
  );
}

// ==========================================
// 7. SECRET: SHRINE OF DOING NOTHING
// ==========================================
function SecretShrine({ position }) {
  const symbolRef = useRef();
  const discoverSecret = useGameStore(state => state.discoverSecret);

  useFrame(({ clock }) => {
    if (symbolRef.current) {
      symbolRef.current.rotation.y += 0.02;
      symbolRef.current.position.y = 1.1 + Math.sin(clock.getElapsedTime() * 2) * 0.08;
    }
  });

  return (
    <group position={position} onClick={() => discoverSecret('shrine')}>
      {/* Stone Pedestal Base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.65, 0.8, 0.4, 8]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.45, 0.55, 0.4, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* Floating Golden Question Mark / Emblem */}
      <group ref={symbolRef} position={[0, 1.1, 0]}>
        <mesh>
          <torusGeometry args={[0.22, 0.06, 8, 16, Math.PI * 1.5]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} metalness={0.7} />
        </mesh>
      </group>
      <pointLight color="#f59e0b" intensity={1.2} distance={3.5} position={[0, 1.1, 0]} />
    </group>
  );
}

// ==========================================
// 8. SECRET: CELESTIAL SKY LEVER
// ==========================================
function CelestialLever({ position }) {
  const leverStickRef = useRef();
  const toggleSkyLever = useGameStore(state => state.toggleSkyLever);
  const [switched, setSwitched] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setSwitched(!switched);
    toggleSkyLever();
  };

  return (
    <group position={position} onClick={handleClick}>
      {/* Carved stone pillar */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.18, 0.25, 0.7, 6]} />
        <meshStandardMaterial color="#57534e" roughness={0.8} />
      </mesh>
      {/* Brass Lever Housing */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[0.25, 0.12, 0.25]} />
        <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Lever Handle */}
      <group position={[0, 0.75, 0]} rotation={[switched ? 0.6 : -0.6, 0, 0]}>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.45, 6]} />
          <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Luminous Orb on Lever Tip */}
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}
