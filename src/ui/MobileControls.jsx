import React, { useRef, useState, useEffect } from 'react';
import { mobileInput } from '../game/Player';
import { useGameStore } from '../store/gameStore';

export function MobileControls() {
  const gameMode = useGameStore(state => state.gameMode);
  const containerRef = useRef(null);
  const [touchPos, setTouchPos] = useState(null);
  const [basePos, setBasePos] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect touch capability
    const checkTouch = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  if (!isMobile || gameMode !== 'playing') return null;

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setBasePos({ x: cx, y: cy });
    updateJoystick(touch.clientX, touch.clientY, cx, cy);
  };

  const handleTouchMove = (e) => {
    if (!basePos) return;
    const touch = e.touches[0];
    updateJoystick(touch.clientX, touch.clientY, basePos.x, basePos.y);
  };

  const handleTouchEnd = () => {
    setTouchPos(null);
    setBasePos(null);
    mobileInput.moveX = 0;
    mobileInput.moveY = 0;
  };

  const updateJoystick = (clientX, clientY, baseX, baseY) => {
    const maxRadius = 45;
    let dx = clientX - baseX;
    let dy = clientY - baseY;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setTouchPos({ x: dx, y: dy });
    // Normalize to -1 to 1 (inverting Y for forward movement)
    mobileInput.moveX = dx / maxRadius;
    mobileInput.moveY = -dy / maxRadius;
  };

  return (
    <div className="absolute bottom-6 left-6 z-20 pointer-events-auto select-none">
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="w-28 h-28 rounded-full bg-slate-900/60 border border-white/20 backdrop-blur-md flex items-center justify-center relative touch-none shadow-xl"
      >
        {/* Inner direction indicators */}
        <div className="absolute inset-2 rounded-full border border-white/10" />

        {/* Joystick Thumb Knob */}
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 border border-white/50 shadow-md transform transition-transform duration-75"
          style={{
            transform: touchPos
              ? `translate(${touchPos.x}px, ${touchPos.y}px)`
              : 'translate(0px, 0px)',
          }}
        />
      </div>
    </div>
  );
}
