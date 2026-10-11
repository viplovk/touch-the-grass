import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export function Vegetation() {
  const bladesRef = useRef();
  const touchParticlesRef = useRef();

  // Generate instanced meadow grass positions
  const grassCount = 650;
  const { positions, rotations, scales } = useMemo(() => {
    const pos = [];
    const rot = [];
    const scl = [];

    for (let i = 0; i < grassCount; i++) {
      // Distribute in circle within island radius ~11.5, avoiding center pond
      const radius = Math.sqrt(Math.random()) * 11;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Avoid pond area around x: -3.5, z: -2 and cottage around x: 7, z: 2
      const distToPond = Math.hypot(x - (-3.5), z - (-2));
      const distToCottage = Math.hypot(x - 7, z - 2);

      if (distToPond < 2.5 || distToCottage < 3.2) {
        continue;
      }

      pos.push([x, 0.45, z]);
      rot.push([0, Math.random() * Math.PI, (Math.random() - 0.5) * 0.2]);
      scl.push([0.8 + Math.random() * 0.4, 0.7 + Math.random() * 0.6, 0.8 + Math.random() * 0.4]);
    }
    return { positions: pos, rotations: rot, scales: scl };
  }, []);

  // Update instanced grass matrices
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    if (!bladesRef.current) return;
    const time = clock.getElapsedTime();

    for (let i = 0; i < positions.length; i++) {
      const [x, y, z] = positions[i];
      const [rx, ry, rz] = rotations[i];
      const [sx, sy, sz] = scales[i];

      tempObject.position.set(x, y, z);
      // Gentle breeze wave
      const wind = Math.sin(time * 2.2 + x * 0.5 + z * 0.5) * 0.12;
      tempObject.rotation.set(rx + wind, ry, rz + wind * 0.6);
      tempObject.scale.set(sx, sy, sz);
      tempObject.updateMatrix();

      bladesRef.current.setMatrixAt(i, tempObject.matrix);
    }
    bladesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Instanced Grass Blades */}
      <instancedMesh
        ref={bladesRef}
        args={[null, null, positions.length]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[0.07, 0.65, 3]} />
        <meshStandardMaterial
          color="#6ee7b7" // Soft mint green
          roughness={0.65}
        />
      </instancedMesh>

      {/* Prominent Interactive Touch Grass Patches (Front Center Cliff Meadow) */}
      <InteractiveGrassPatch position={[0, 0.48, 5.2]} label="Lush Meadow Crest" />
      <InteractiveGrassPatch position={[-4.5, 0.48, 3.8]} label="Dewy Clover Patch" />
      <InteractiveGrassPatch position={[3.5, 0.48, 2.2]} label="Sunlit Buttercup Tufts" />
      <InteractiveGrassPatch position={[-2, 0.48, 1]} label="Central Respite Patch" />

      {/* Handcrafted Dream Trees */}
      {/* 1. Grand Cherry Blossom Tree (Left Cliffside) */}
      <CherryBlossomTree position={[-7.5, 0.5, 1.5]} scale={[1.1, 1.1, 1.1]} />

      {/* 2. Cozy Weeping Willow / Cottage Pine (Right of Cottage) */}
      <MiniPineTree position={[9.5, 0.5, 5]} scale={[1.2, 1.2, 1.2]} />
      <MiniPineTree position={[-8.5, 0.5, -5.5]} scale={[0.9, 0.9, 0.9]} />

      {/* Meadow Wildflowers Clusters (Daisies, Lavender) */}
      <FlowerBed position={[1.5, 0.48, 4.2]} count={12} />
      <FlowerBed position={[-5.8, 0.48, 5]} count={10} />
      <FlowerBed position={[-1.2, 0.48, -1.5]} count={8} />
      <FlowerBed position={[5, 0.48, -3.5]} count={14} />

      {/* Glowing Bioluminescent Mushrooms */}
      <GlowMushroom position={[-6.2, 0.48, 0.8]} color="#a855f7" />
      <GlowMushroom position={[-3.8, 0.48, -4.2]} color="#06b6d4" />
      <GlowMushroom position={[6.8, 0.48, -2.5]} color="#f43f5e" />
      <GlowMushroom position={[1.8, 0.48, -4.8]} color="#38bdf8" />
    </group>
  );
}

// Interactive Grass Patch Component with Proximity Trigger
function InteractiveGrassPatch({ position, label }) {
  const meshRef = useRef();
  const touchGrass = useGameStore(state => state.touchGrass);
  const nearTarget = useGameStore(state => state.nearTarget);
  const setNearTarget = useGameStore(state => state.setNearTarget);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Gentle idle sway
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 3 + position[0]) * 0.08;
    }
  });

  return (
    <group position={position}>
      {/* Grass cluster tufts */}
      <group ref={meshRef} onClick={touchGrass}>
        {[-0.25, 0, 0.25].map((offX, i) => (
          <group key={i} position={[offX, 0, (i === 1 ? 0.15 : -0.1)]}>
            <mesh position={[0, 0.35, 0]}>
              <coneGeometry args={[0.14, 0.75, 4]} />
              <meshStandardMaterial color="#34d399" roughness={0.6} />
            </mesh>
            {/* Small Daisy bloom on top */}
            <mesh position={[0, 0.72, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={0.3} />
            </mesh>
            {/* White petals */}
            {Array.from({ length: 5 }).map((_, p) => {
              const ang = (p / 5) * Math.PI * 2;
              return (
                <mesh key={p} position={[Math.cos(ang) * 0.1, 0.72, Math.sin(ang) * 0.1]} scale={[0.06, 0.02, 0.06]}>
                  <sphereGeometry args={[1, 6, 6]} />
                  <meshStandardMaterial color="#ffffff" />
                </mesh>
              );
            })}
          </group>
        ))}

        {/* Subtle gentle ground glow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[0.65, 16]} />
          <meshBasicMaterial color="#a7f3d0" transparent opacity={0.25} />
        </mesh>
      </group>
    </group>
  );
}

// Handcrafted Dream Tree (Cherry Blossom)
function CherryBlossomTree({ position, scale = [1, 1, 1] }) {
  const leavesRef = useRef();

  useFrame(({ clock }) => {
    if (leavesRef.current) {
      leavesRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.04;
      leavesRef.current.position.y = 2.8 + Math.sin(clock.getElapsedTime() * 1.5) * 0.05;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Twisted Stylized Wood Trunk */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.3, 0.55, 2.4, 7]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.85} />
      </mesh>
      <mesh position={[0.3, 2.2, 0.1]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.2, 0.3, 1.4, 6]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.85} />
      </mesh>
      <mesh position={[-0.25, 2.3, -0.1]} rotation={[0, 0, 0.45]}>
        <cylinderGeometry args={[0.18, 0.28, 1.2, 6]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.85} />
      </mesh>

      {/* Fluffy Volumetric Pink Blossom Canopies */}
      <group ref={leavesRef} position={[0, 2.8, 0]}>
        {/* Center main puff */}
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[1.6, 12, 12]} />
          <meshStandardMaterial color="#f472b6" roughness={0.7} />
        </mesh>
        {/* Left puff */}
        <mesh position={[-1.1, 0.1, 0.4]} scale={[0.85, 0.8, 0.85]}>
          <sphereGeometry args={[1.3, 10, 10]} />
          <meshStandardMaterial color="#f9a8d4" roughness={0.7} />
        </mesh>
        {/* Right puff */}
        <mesh position={[1.2, 0.2, -0.3]} scale={[0.9, 0.85, 0.9]}>
          <sphereGeometry args={[1.4, 10, 10]} />
          <meshStandardMaterial color="#f472b6" roughness={0.7} />
        </mesh>
        {/* Top small puff */}
        <mesh position={[0.2, 1.3, 0.1]} scale={[0.7, 0.65, 0.7]}>
          <sphereGeometry args={[1.2, 10, 10]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// Handcrafted Pine / Autumn Meadow Tree
function MiniPineTree({ position, scale = [1, 1, 1] }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.2, 0.35, 1.6, 6]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      {/* Tiered foliage */}
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[1.4, 1.5, 6]} />
        <meshStandardMaterial color="#365314" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[1.1, 1.4, 6]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.3, 0]}>
        <coneGeometry args={[0.75, 1.2, 6]} />
        <meshStandardMaterial color="#65a30d" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Flower Bed with scattered blossoms
function FlowerBed({ position, count = 10 }) {
  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      x: (Math.random() - 0.5) * 1.8,
      z: (Math.random() - 0.5) * 1.8,
      color: i % 3 === 0 ? '#ffffff' : (i % 3 === 1 ? '#c084fc' : '#fef08a'),
      scale: 0.6 + Math.random() * 0.4,
    }));
  }, [count]);

  return (
    <group position={position}>
      {items.map((it, idx) => (
        <group key={idx} position={[it.x, 0, it.z]} scale={[it.scale, it.scale, it.scale]}>
          {/* Stem */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
          {/* Flower Center */}
          <mesh position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color={it.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Glowing Bioluminescent Forest Mushroom
function GlowMushroom({ position, color = '#a855f7' }) {
  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 0.35, 6]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.22, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.65}
          roughness={0.4}
        />
      </mesh>
      {/* Soft Glow */}
      <pointLight color={color} intensity={0.7} distance={2.5} position={[0, 0.35, 0]} />
    </group>
  );
}
