import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Cottage({ position = [7, 0.5, 2] }) {
  const smokeParticlesRef = useRef();

  // Chimney smoke particle motion
  useFrame((state, delta) => {
    if (smokeParticlesRef.current) {
      smokeParticlesRef.current.children.forEach((p, idx) => {
        p.position.y += delta * 0.45;
        p.position.x += Math.sin(state.clock.getElapsedTime() * 1.5 + idx) * 0.005;
        const scale = 0.15 + (p.position.y * 0.08);
        p.scale.set(scale, scale, scale);
        if (p.position.y > 2.5) {
          p.position.y = 0;
          p.position.x = 0;
        }
      });
    }
  });

  return (
    <group position={position} rotation={[0, -0.4, 0]}>
      {/* Wooden Deck & Foundation Planks */}
      <mesh position={[0, 0.15, 0.4]}>
        <boxGeometry args={[4.2, 0.3, 4.4]} />
        <meshStandardMaterial color="#78553f" roughness={0.8} />
      </mesh>
      {/* Front Steps */}
      <mesh position={[-1.2, 0.08, 2.5]}>
        <boxGeometry args={[1.4, 0.15, 0.6]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.8} />
      </mesh>

      {/* Main Cabin Walls (Handcrafted Wood Log look) */}
      {/* Back Wall */}
      <mesh position={[0, 1.4, -1.3]}>
        <boxGeometry args={[3.6, 2.2, 0.2]} />
        <meshStandardMaterial color="#5d4037" roughness={0.85} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[1.7, 1.4, 0]}>
        <boxGeometry args={[0.2, 2.2, 2.8]} />
        <meshStandardMaterial color="#5d4037" roughness={0.85} />
      </mesh>
      {/* Left Wall (with window opening) */}
      <mesh position={[-1.7, 1.4, 0]}>
        <boxGeometry args={[0.2, 2.2, 2.8]} />
        <meshStandardMaterial color="#5d4037" roughness={0.85} />
      </mesh>
      {/* Front Wall (Right side of door) */}
      <mesh position={[1, 1.4, 1.3]}>
        <boxGeometry args={[1.6, 2.2, 0.2]} />
        <meshStandardMaterial color="#5d4037" roughness={0.85} />
      </mesh>
      {/* Front Wall (Doorway lintel above door) */}
      <mesh position={[-0.8, 2.1, 1.3]}>
        <boxGeometry args={[1.4, 0.6, 0.2]} />
        <meshStandardMaterial color="#5d4037" roughness={0.85} />
      </mesh>

      {/* Gable Roof (Pitched Wooden Shingles) */}
      <mesh position={[0, 2.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[2.8, 2.8, 3.4]} />
        <meshStandardMaterial color="#4e342e" roughness={0.8} />
      </mesh>

      {/* Porch Overhang Canopy */}
      <mesh position={[0, 2.1, 2.1]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[3.8, 0.12, 1.4]} />
        <meshStandardMaterial color="#3e2723" roughness={0.85} />
      </mesh>
      {/* Porch Support Pillars */}
      <mesh position={[-1.7, 1.1, 2.4]}>
        <cylinderGeometry args={[0.07, 0.08, 1.9, 6]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.8} />
      </mesh>
      <mesh position={[1.7, 1.1, 2.4]}>
        <cylinderGeometry args={[0.07, 0.08, 1.9, 6]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.8} />
      </mesh>

      {/* Cozy Golden Window with Pane Divider */}
      <group position={[1.72, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
        {/* Frame */}
        <mesh>
          <boxGeometry args={[1.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.05, 1.2, 0.05]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
      </group>

      {/* Stone Chimney */}
      <group position={[-1.2, 2.7, -0.6]}>
        <mesh>
          <boxGeometry args={[0.65, 1.8, 0.65]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
        {/* Chimney Cap */}
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshStandardMaterial color="#57534e" roughness={0.9} />
        </mesh>

        {/* Puffing Smoke Particles */}
        <group ref={smokeParticlesRef} position={[0, 1.1, 0]}>
          {[0, 0.6, 1.2, 1.8].map((initY, idx) => (
            <mesh key={idx} position={[0, initY, 0]}>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshStandardMaterial color="#f1f5f9" transparent opacity={0.4} roughness={1} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Cozy Interior Furnishings */}
      {/* Warm Floor Rug */}
      <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 16]} />
        <meshStandardMaterial color="#be185d" roughness={0.8} />
      </mesh>
      {/* Wooden Table */}
      <group position={[0.7, 0.55, -0.4]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 0.06, 12]} />
          <meshStandardMaterial color="#a1887f" />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.45, 6]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>
        {/* Clay Teapot */}
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#e07a5f" />
        </mesh>
      </group>

      {/* Interior Warm Point Light */}
      <pointLight position={[0, 1.6, 0]} color="#fde047" intensity={2.5} distance={6} />

      {/* Hanging Porch Lantern (Matching image.png) */}
      <group position={[1.5, 1.8, 2.3]}>
        {/* Chain */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 4]} />
          <meshStandardMaterial color="#2d2235" />
        </mesh>
        {/* Lantern frame */}
        <mesh>
          <boxGeometry args={[0.22, 0.3, 0.22]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
        {/* Glow Core */}
        <mesh>
          <boxGeometry args={[0.16, 0.24, 0.16]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        {/* Warm Porch Point Light */}
        <pointLight color="#f59e0b" intensity={3.0} distance={7} />
      </group>

      {/* Cute banner/sign hanging on the porch: cute doodle like image.png */}
      <mesh position={[-0.2, 1.7, 2.3]} rotation={[0.05, 0, 0]}>
        <planeGeometry args={[0.65, 0.55]} />
        <meshStandardMaterial color="#fef3c7" side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
    </group>
  );
}
