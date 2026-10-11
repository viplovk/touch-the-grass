import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from './Environment';
import { Vegetation } from './Vegetation';
import { Cottage } from './Cottage';
import { Portal } from './Portal';
import { Creatures } from './Creatures';
import { Player } from './Player';
import { Particles } from './Particles';

export function GameCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none bg-[#0a0d1e]">
      <Canvas
        shadows
        camera={{ position: [0, 2.1, 9.8], fov: 48, near: 0.1, far: 300 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
      >
        <Suspense fallback={null}>
          <Environment />
          <Vegetation />
          <Cottage />
          <Portal />
          <Creatures />
          <Player />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  );
}
