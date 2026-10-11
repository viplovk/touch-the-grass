import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Particles() {
  const firefliesRef = useRef();
  const petalsRef = useRef();

  // Fireflies around meadow
  const fireflyCount = 45;
  const fireflyData = useMemo(() => {
    const data = [];
    for (let i = 0; i < fireflyCount; i++) {
      data.push({
        x: (Math.random() - 0.5) * 20,
        y: 0.8 + Math.random() * 3.5,
        z: (Math.random() - 0.5) * 20,
        speed: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, []);

  const fireflyPositions = useMemo(() => {
    const arr = new Float32Array(fireflyCount * 3);
    fireflyData.forEach((d, i) => {
      arr[i * 3] = d.x;
      arr[i * 3 + 1] = d.y;
      arr[i * 3 + 2] = d.z;
    });
    return arr;
  }, [fireflyData]);

  // Falling pink petals from cherry blossom
  const petalCount = 60;
  const petalData = useMemo(() => {
    const data = [];
    for (let i = 0; i < petalCount; i++) {
      data.push({
        x: -7.5 + (Math.random() - 0.5) * 6,
        y: 2 + Math.random() * 4,
        z: 1.5 + (Math.random() - 0.5) * 6,
        fallSpeed: 0.3 + Math.random() * 0.4,
        driftSpeed: 0.2 + Math.random() * 0.3,
      });
    }
    return data;
  }, []);

  const petalPositions = useMemo(() => {
    const arr = new Float32Array(petalCount * 3);
    petalData.forEach((d, i) => {
      arr[i * 3] = d.x;
      arr[i * 3 + 1] = d.y;
      arr[i * 3 + 2] = d.z;
    });
    return arr;
  }, [petalData]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Animate fireflies
    if (firefliesRef.current) {
      const posAttr = firefliesRef.current.geometry.attributes.position;
      for (let i = 0; i < fireflyCount; i++) {
        const d = fireflyData[i];
        posAttr.array[i * 3] = d.x + Math.sin(time * d.speed + d.phase) * 0.8;
        posAttr.array[i * 3 + 1] = d.y + Math.cos(time * d.speed * 0.8 + d.phase) * 0.4;
        posAttr.array[i * 3 + 2] = d.z + Math.sin(time * d.speed * 1.2 + d.phase) * 0.8;
      }
      posAttr.needsUpdate = true;
    }

    // Animate falling petals
    if (petalsRef.current) {
      const posAttr = petalsRef.current.geometry.attributes.position;
      for (let i = 0; i < petalCount; i++) {
        const d = petalData[i];
        posAttr.array[i * 3 + 1] -= d.fallSpeed * 0.016;
        posAttr.array[i * 3] += Math.sin(time * 1.5 + i) * 0.008;

        if (posAttr.array[i * 3 + 1] < 0.2) {
          posAttr.array[i * 3 + 1] = 5.5;
          posAttr.array[i * 3] = -7.5 + (Math.random() - 0.5) * 5;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Fireflies */}
      <points ref={firefliesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[fireflyPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          color="#fef08a"
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Falling Blossom Petals */}
      <points ref={petalsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[petalPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          color="#fbcfe8"
          transparent
          opacity={0.75}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
