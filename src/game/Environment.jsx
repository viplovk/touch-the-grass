import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export function Environment() {
  const skyPreset = useGameStore(state => state.skyPreset);
  const cloudSeaRef = useRef();
  const midCloudsRef = useRef();

  // Color schemes for presets
  const skyColors = useMemo(() => {
    switch (skyPreset) {
      case 'night':
        return {
          top: '#060814',
          middle: '#0e122b',
          bottom: '#181e40',
          fog: '#0a0d22',
          light: '#7986cb',
          ambient: '#1c2242',
          sun: '#e0e7ff',
          planet: '#9fa8da',
        };
      case 'dawn':
        return {
          top: '#1a103c',
          middle: '#5a3d7a',
          bottom: '#f49080',
          fog: '#5c3d70',
          light: '#ffb74d',
          ambient: '#4a2c6d',
          sun: '#ffe0b2',
          planet: '#f8bbd0',
        };
      case 'aurora':
        return {
          top: '#051824',
          middle: '#0f3844',
          bottom: '#1b635c',
          fog: '#0c2730',
          light: '#4dd0e1',
          ambient: '#09252e',
          sun: '#80cbc4',
          planet: '#80deea',
        };
      case 'sunset':
      default:
        return {
          top: '#0f1738',
          middle: '#382255',
          bottom: '#ea738d',
          fog: '#2d1b47',
          light: '#fca5a5',
          ambient: '#2f1947',
          sun: '#fed7aa',
          planet: '#f472b6',
        };
    }
  }, [skyPreset]);

  // Slowly drift cloud sea and mid-ground clouds
  useFrame((state, delta) => {
    if (cloudSeaRef.current) {
      cloudSeaRef.current.rotation.y += delta * 0.008;
    }
    if (midCloudsRef.current) {
      midCloudsRef.current.children.forEach((c, idx) => {
        c.position.x += delta * (0.3 + (idx % 3) * 0.15);
        if (c.position.x > 80) c.position.x = -80;
      });
    }
  });

  return (
    <group>
      {/* Fog for atmospheric depth */}
      <fog attach="fog" args={[skyColors.fog, 25, 120]} />

      {/* Ambient & Directional Lighting */}
      <ambientLight color={skyColors.ambient} intensity={0.9} />
      <directionalLight
        position={[30, 25, -20]}
        intensity={1.4}
        color={skyColors.sun}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-camera-near={1}
        shadow-camera-far={90}
      />
      <hemisphereLight
        args={[skyColors.top, skyColors.bottom, 0.6]}
      />

      {/* Massive Celestial Planet with Rings (Matching Cover Art) */}
      <group position={[-32, 28, -65]}>
        {/* Planet Sphere */}
        <mesh>
          <sphereGeometry args={[14, 32, 32]} />
          <meshStandardMaterial
            color={skyColors.planet}
            roughness={0.7}
            metalness={0.1}
            emissive={skyColors.planet}
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Subtle Celestial Ring */}
        <mesh rotation={[Math.PI / 3, 0.4, -0.2]}>
          <ringGeometry args={[18, 25, 48]} />
          <meshBasicMaterial
            color="#fbcfe8"
            side={THREE.DoubleSide}
            transparent
            opacity={0.35}
          />
        </mesh>
        {/* Glow halo */}
        <mesh scale={[1.05, 1.05, 1.05]}>
          <sphereGeometry args={[14.2, 24, 24]} />
          <meshBasicMaterial
            color="#f472b6"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      </group>

      {/* Distant Sun / Setting Orb on the Horizon */}
      <mesh position={[24, 4, -75]}>
        <sphereGeometry args={[6, 24, 24]} />
        <meshBasicMaterial color={skyColors.sun} />
      </mesh>
      {/* Sun glow ring */}
      <mesh position={[24, 4, -74]}>
        <ringGeometry args={[6.1, 12, 32]} />
        <meshBasicMaterial color="#fed7aa" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Distant Floating Islands (Background Silhouettes) */}
      <group>
        {/* Far Left Island */}
        <DistantIsland position={[-42, -2, -45]} scale={[1.4, 1.2, 1.4]} />
        {/* Mid Left Island */}
        <DistantIsland position={[-25, 4, -38]} scale={[0.8, 0.9, 0.8]} withRuin />
        {/* Far Center Island with Mill */}
        <DistantIsland position={[6, -4, -55]} scale={[1.2, 1.5, 1.2]} withWindmill />
        {/* Far Right Island */}
        <DistantIsland position={[45, 2, -48]} scale={[1.6, 1.4, 1.6]} />
      </group>

      {/* Infinite Bottom Ocean of Puffy Clouds */}
      <group ref={cloudSeaRef} position={[0, -14, 0]}>
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const radius = 28 + (i % 4) * 8;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = -1 + Math.sin(i * 1.5) * 1.8;
          const scale = 8 + (i % 3) * 4;
          return (
            <mesh key={i} position={[x, y, z]} scale={[scale * 1.5, scale * 0.5, scale * 1.2]}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#fbcfe8' : '#e0e7ff'}
                roughness={0.9}
                metalness={0.05}
                emissive="#f472b6"
                emissiveIntensity={0.08}
              />
            </mesh>
          );
        })}
      </group>

      {/* Mid-altitude Drifting Puffy Clouds */}
      <group ref={midCloudsRef}>
        <DriftingCloud position={[-35, 12, -20]} scale={[1.8, 1, 1.2]} />
        <DriftingCloud position={[15, 18, -30]} scale={[2.2, 1.2, 1.5]} />
        <DriftingCloud position={[-10, 8, -15]} scale={[1.5, 0.9, 1]} />
        <DriftingCloud position={[32, 14, -10]} scale={[2, 1.1, 1.3]} />
        <DriftingCloud position={[-45, 16, 15]} scale={[2.4, 1.3, 1.6]} />
      </group>

      {/* Twinkling Distant Stars in the Twilight Sky */}
      <StarField />

      {/* Main Floating Islands Group */}
      <IslandTerrain />
    </group>
  );
}

// Background Distant Island Silhouettes
function DistantIsland({ position, scale = [1, 1, 1], withWindmill = false, withRuin = false }) {
  return (
    <group position={position} scale={scale}>
      {/* Island Top */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[5, 4, 1.5, 7]} />
        <meshStandardMaterial color="#4a3764" roughness={0.9} />
      </mesh>
      {/* Inverted Earth Base */}
      <mesh position={[0, -3.2, 0]}>
        <coneGeometry args={[4.2, 5.5, 7]} />
        <meshStandardMaterial color="#2d1c42" roughness={0.9} />
      </mesh>
      {/* Decorative distant structure */}
      {withWindmill && (
        <group position={[0, 1.2, 0]}>
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.3, 0.5, 2, 5]} />
            <meshStandardMaterial color="#6b4c8a" />
          </mesh>
          <mesh position={[0, 2, 0.4]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[2.5, 0.15, 0.05]} />
            <meshStandardMaterial color="#9d7bb0" />
          </mesh>
        </group>
      )}
      {withRuin && (
        <group position={[0, 1.2, 0]}>
          <mesh position={[-0.6, 0.6, 0]}>
            <boxGeometry args={[0.4, 1.2, 0.4]} />
            <meshStandardMaterial color="#7c5c99" />
          </mesh>
          <mesh position={[0.6, 0.4, 0]}>
            <boxGeometry args={[0.4, 0.8, 0.4]} />
            <meshStandardMaterial color="#7c5c99" />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[1.8, 0.3, 0.5]} />
            <meshStandardMaterial color="#7c5c99" />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Procedural Puffy Cloud cluster
function DriftingCloud({ position, scale = [1, 1, 1] }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.2, 12, 12]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.8} />
      </mesh>
      <mesh position={[1.8, -0.3, 0.4]}>
        <sphereGeometry args={[1.6, 10, 10]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.8} />
      </mesh>
      <mesh position={[-1.7, -0.2, -0.3]}>
        <sphereGeometry args={[1.7, 10, 10]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.8} />
      </mesh>
      <mesh position={[0.5, 1.1, -0.2]}>
        <sphereGeometry args={[1.4, 10, 10]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Procedural Starfield
function StarField() {
  const points = useMemo(() => {
    const coords = [];
    for (let i = 0; i < 400; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 85 + Math.random() * 20;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = Math.abs(r * Math.cos(phi)) + 8; // stars in upper sky
      const z = r * Math.sin(phi) * Math.sin(theta);
      coords.push(x, y, z);
    }
    return new Float32Array(coords);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.65}
        color="#ffffff"
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

// Handcrafted Main Island & Portal Archipelago
function IslandTerrain() {
  const waterfallRef = useRef();

  useFrame((state, delta) => {
    if (waterfallRef.current) {
      waterfallRef.current.position.y -= delta * 3;
      if (waterfallRef.current.position.y < -12) {
        waterfallRef.current.position.y = -2;
      }
    }
  });

  return (
    <group>
      {/* =========================================
          MAIN CENTRAL FLOATING ISLAND
          ========================================= */}
      <group position={[0, -0.5, 0]}>
        {/* Top Lush Turf / Meadow Surface (Walkable) */}
        <mesh position={[0, 0, 0]} receiveShadow>
          {/* Flattened organic disc for the meadow */}
          <cylinderGeometry args={[12.5, 13.5, 1.2, 32]} />
          <meshStandardMaterial
            color="#5ca062" // Soft mint-green meadow
            roughness={0.75}
            metalness={0.05}
          />
        </mesh>

        {/* Outer Grassy Rim with gentle undulation */}
        <mesh position={[0, 0.4, 0]} receiveShadow>
          <cylinderGeometry args={[11.8, 12.6, 0.6, 32]} />
          <meshStandardMaterial
            color="#68ad6e"
            roughness={0.7}
          />
        </mesh>

        {/* Handcrafted Stone & Earth Underside (Inverted Crag Cone) */}
        <mesh position={[0, -3.8, 0]}>
          <coneGeometry args={[12.8, 7, 24]} />
          <meshStandardMaterial
            color="#3f3248" // Warm dark slate earth
            roughness={0.9}
            flatShading
          />
        </mesh>

        {/* Rocky Outcroppings & Hanging Roots on island bottom */}
        {[-4, 0, 4].map((x, i) => (
          <mesh key={i} position={[x, -7.5 - i * 0.4, (i % 2 === 0 ? 3 : -3)]}>
            <coneGeometry args={[1.4, 4.5, 6]} />
            <meshStandardMaterial color="#2d2235" roughness={0.95} flatShading />
          </mesh>
        ))}

        {/* Wooden Fence Rails on Meadow Cliff (Matching art) */}
        <group position={[2, 0.8, 7.5]} rotation={[0, -0.3, 0]}>
          {/* Fence Posts */}
          {[-3, -1, 1, 3].map((px, idx) => (
            <mesh key={idx} position={[px, 0.4, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 1.1, 6]} />
              <meshStandardMaterial color="#8d6e63" roughness={0.8} />
            </mesh>
          ))}
          {/* Horizontal Planks */}
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[6.4, 0.1, 0.06]} />
            <meshStandardMaterial color="#a1887f" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[6.4, 0.1, 0.06]} />
            <meshStandardMaterial color="#a1887f" roughness={0.8} />
          </mesh>
        </group>

        {/* Iconic Wooden Signboard: "touch grass be happier (maybe)" */}
        <group position={[-6.8, 0.6, 6.2]} rotation={[0, 0.4, -0.05]}>
          {/* Post */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.08, 0.09, 1.4, 6]} />
            <meshStandardMaterial color="#6d4c41" roughness={0.9} />
          </mesh>
          {/* Wooden Board */}
          <mesh position={[0, 1.1, 0.05]} rotation={[0, 0, 0.06]}>
            <boxGeometry args={[1.5, 1.1, 0.1]} />
            <meshStandardMaterial color="#8d6e63" roughness={0.8} />
          </mesh>
        </group>

        {/* Serene Reflective Meadow Pond */}
        <group position={[-3.5, 0.55, -2]}>
          {/* Water Surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.4, 24]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.1}
              metalness={0.8}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Lily Pads */}
          {[-0.8, 0.6, 0.2].map((lx, i) => (
            <mesh key={i} position={[lx, 0.02, (i === 1 ? -0.7 : 0.8)]} rotation={[-Math.PI / 2, 0, i]}>
              <circleGeometry args={[0.35, 12]} />
              <meshStandardMaterial color="#4ade80" roughness={0.6} />
            </mesh>
          ))}
          {/* River Stream heading toward Waterfall edge */}
          <mesh position={[0.8, 0.01, -3.2]} rotation={[-Math.PI / 2, 0, 0.2]}>
            <planeGeometry args={[1.4, 4]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.15}
              metalness={0.6}
              transparent
              opacity={0.75}
            />
          </mesh>
        </group>

        {/* Flowing Waterfall tumbling from cliff edge */}
        <group position={[-2.2, -1, -6]}>
          <mesh ref={waterfallRef} position={[0, -4, 0]}>
            <planeGeometry args={[2.2, 9]} />
            <meshStandardMaterial
              color="#e0f2fe"
              transparent
              opacity={0.7}
              roughness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Water Mist Cloud at Waterfall Base */}
          <mesh position={[0, -8.5, 0.5]} scale={[2.5, 1.2, 1.5]}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshStandardMaterial
              color="#bae6fd"
              transparent
              opacity={0.5}
              roughness={0.9}
            />
          </mesh>
        </group>

        {/* Ambient Warm Golden Lantern on Wooden Post */}
        <group position={[4.5, 0.6, 5]}>
          {/* Wooden Post */}
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 1.8, 6]} />
            <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </mesh>
          {/* Arm */}
          <mesh position={[0.2, 1.6, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.04, 0.04, 0.45, 6]} />
            <meshStandardMaterial color="#4e342e" />
          </mesh>
          {/* Lantern Body */}
          <mesh position={[0.4, 1.4, 0]}>
            <cylinderGeometry args={[0.16, 0.18, 0.42, 6]} />
            <meshStandardMaterial color="#2d2235" metalness={0.6} />
          </mesh>
          {/* Glowing Amber Glass */}
          <mesh position={[0.4, 1.4, 0]}>
            <cylinderGeometry args={[0.13, 0.15, 0.35, 6]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          {/* Warm Point Light */}
          <pointLight
            position={[0.4, 1.4, 0]}
            color="#fbbf24"
            intensity={2.2}
            distance={9}
          />
        </group>
      </group>

      {/* =========================================
          SECONDARY FLOATING ISLAND: THE PORTAL ISLE
          ========================================= */}
      <group position={[-16, 1.8, -14]}>
        {/* Island Top */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[5.5, 6.2, 1.4, 24]} />
          <meshStandardMaterial color="#4e9354" roughness={0.8} />
        </mesh>
        {/* Earth Base */}
        <mesh position={[0, -3.2, 0]}>
          <coneGeometry args={[6, 5.5, 18]} />
          <meshStandardMaterial color="#35263d" roughness={0.95} flatShading />
        </mesh>

        {/* Stepping Stones Bridge connecting Main Island to Portal Isle */}
        {[-3.5, -2, -0.5, 1].map((step, i) => (
          <mesh key={i} position={[5.5 + i * 2, -0.6 - i * 0.1, 4 + i * 1.8]} rotation={[0, i * 0.4, 0]}>
            <cylinderGeometry args={[0.75, 0.85, 0.3, 7]} />
            <meshStandardMaterial color="#78716c" roughness={0.8} />
          </mesh>
        ))}

        {/* Waterfall pouring from Portal Isle */}
        <mesh position={[0, -2.8, 4.8]} rotation={[0.1, 0, 0]}>
          <planeGeometry args={[1.4, 6]} />
          <meshStandardMaterial
            color="#e0f2fe"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
