import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export function Portal({ position = [-16, 2.8, -14] }) {
  const ringRef = useRef();
  const vortexRef = useRef();
  const starsRef = useRef();
  const enterPortal = useGameStore(state => state.enterPortal);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (vortexRef.current) {
      vortexRef.current.rotation.z += delta * 1.5;
    }
    if (starsRef.current) {
      starsRef.current.rotation.z -= delta * 0.8;
    }
    if (ringRef.current) {
      ringRef.current.position.y = 2.4 + Math.sin(time * 1.2) * 0.08;
    }
  });

  return (
    <group position={position} rotation={[0, 0.45, 0]}>
      {/* Flight of Ancient Stone Steps Leading to the Portal */}
      {[0, 1, 2, 3].map((step, idx) => (
        <mesh key={idx} position={[0, -0.6 + idx * 0.22, 2.8 - idx * 0.75]}>
          <boxGeometry args={[3.2 - idx * 0.2, 0.24, 0.9]} />
          <meshStandardMaterial color="#78716c" roughness={0.85} />
        </mesh>
      ))}

      {/* Stone Pedestal Platform */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[2.8, 3.1, 0.4, 16]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>

      {/* Main Stone Stargate Arch Group */}
      <group ref={ringRef} position={[0, 2.4, 0]} onClick={enterPortal}>
        {/* Massive Outer Stone Torus Ring */}
        <mesh>
          <torusGeometry args={[2.5, 0.38, 16, 32]} />
          <meshStandardMaterial
            color="#44403c"
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>

        {/* Glowing Concentric Inner Runic Trim */}
        <mesh>
          <torusGeometry args={[2.22, 0.08, 12, 32]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#a855f7"
            emissiveIntensity={1.2}
            roughness={0.3}
          />
        </mesh>

        {/* Decorative Keystone Blocks around Ring */}
        {Array.from({ length: 8 }).map((_, i) => {
          const ang = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(ang) * 2.5, Math.sin(ang) * 2.5, 0]} rotation={[0, 0, ang]}>
              <boxGeometry args={[0.3, 0.7, 0.9]} />
              <meshStandardMaterial color="#292524" roughness={0.8} />
            </mesh>
          );
        })}

        {/* Swirling Mystical Energy Vortex (Center Disc) */}
        <mesh ref={vortexRef} position={[0, 0, 0]}>
          <circleGeometry args={[2.15, 32]} />
          <meshStandardMaterial
            color="#9333ea"
            emissive="#7e22ce"
            emissiveIntensity={0.9}
            roughness={0.2}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Cosmic Shimmer Star Disc */}
        <mesh ref={starsRef} position={[0, 0, 0.02]}>
          <ringGeometry args={[0.2, 2.05, 32]} />
          <meshBasicMaterial
            color="#f472b6"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Pulsing Luminous Violet Portal Light */}
        <pointLight
          color="#c084fc"
          intensity={3.5}
          distance={10}
          position={[0, 0, 0.5]}
        />
      </group>

      {/* Floating Crystal Pillars beside Portal */}
      <mesh position={[-2.8, 1.2, 0.5]} rotation={[0.1, 0.2, 0.1]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#e879f9"
          emissive="#c084fc"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[2.8, 1.4, 0.5]} rotation={[-0.1, -0.2, -0.1]}>
        <octahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color="#e879f9"
          emissive="#c084fc"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}
