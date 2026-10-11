import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { sound } from '../audio/soundEngine';

// Key states
const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  shift: false,
  jump: false,
};

// Global mobile joystick vector [x, y] (-1 to 1)
export const mobileInput = {
  moveX: 0,
  moveY: 0,
  jumpPressed: false,
};

export function Player() {
  const playerRef = useRef();
  const bodyMeshRef = useRef();
  const legsRef = useRef();
  const { camera } = useThree();

  const gameMode = useGameStore(state => state.gameMode);
  const touchGrass = useGameStore(state => state.touchGrass);
  const petCloud = useGameStore(state => state.petCloud);
  const feedRock = useGameStore(state => state.feedRock);
  const talkToNPC = useGameStore(state => state.talkToNPC);
  const enterPortal = useGameStore(state => state.enterPortal);
  const discoverSecret = useGameStore(state => state.discoverSecret);
  const toggleSkyLever = useGameStore(state => state.toggleSkyLever);
  const setNearTarget = useGameStore(state => state.setNearTarget);

  // Character physics state
  const pos = useRef(new THREE.Vector3(0, 0.45, 4.2));
  const velocityY = useRef(0);
  const isGrounded = useRef(true);
  const playerRotation = useRef(0);
  const cameraYaw = useRef(0);
  const cameraPitch = useRef(0.25);

  // Setup keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.shift = true;
          break;
        case 'Space':
          if (isGrounded.current) {
            velocityY.current = 6.2;
            isGrounded.current = false;
            sound.playJump();
          }
          break;
        case 'KeyE': {
          // Trigger contextual interaction
          const near = useGameStore.getState().nearTarget;
          if (near) {
            triggerContextAction(near);
          } else {
            // Default touch grass if near grass
            touchGrass();
          }
          break;
        }
        case 'Escape':
          // Toggle menu
          const currentModal = useGameStore.getState().activeModal;
          if (currentModal) {
            useGameStore.getState().closeModal();
          } else if (useGameStore.getState().gameMode === 'playing') {
            useGameStore.getState().openModal('settings');
          }
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.shift = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse orbit dragging
  useEffect(() => {
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e) => {
      // Only drag if not clicking on UI buttons
      if (e.target.tagName === 'CANVAS') {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        cameraYaw.current -= dx * 0.005;
        cameraPitch.current = Math.max(-0.2, Math.min(0.9, cameraPitch.current + dy * 0.004));
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const triggerContextAction = (target) => {
    switch (target.type) {
      case 'grass':
        touchGrass();
        break;
      case 'rock':
        feedRock('grass');
        break;
      case 'cloud':
        petCloud();
        break;
      case 'npc':
        talkToNPC();
        break;
      case 'portal':
        enterPortal();
        break;
      case 'frog':
      case 'chair':
      case 'message':
      case 'shrine':
        discoverSecret(target.type);
        break;
      case 'sky_switch':
        toggleSkyLever();
        break;
      default:
        touchGrass();
        break;
    }
  };

  // Main game physics & camera tick
  useFrame((state, delta) => {
    // ---------------------------------------------
    // 1. COVER CAMERA MODE (Matching concept image)
    // ---------------------------------------------
    if (gameMode === 'cover') {
      // In cover mode, character sits calmly on the grass cliff with companion
      pos.current.set(0, 0.45, 6.2);
      if (playerRef.current) {
        playerRef.current.position.copy(pos.current);
        playerRef.current.rotation.y = Math.PI; // Face outwards toward the sunset
      }

      // Exact majestic cover camera viewpoint
      const targetCamPos = new THREE.Vector3(0, 2.1, 9.8);
      const targetLookAt = new THREE.Vector3(0, 2.4, -18);

      camera.position.lerp(targetCamPos, delta * 2.5);
      camera.lookAt(targetLookAt);
      return;
    }

    // ---------------------------------------------
    // 2. PLAYING 3RD-PERSON MOVEMENT MODE
    // ---------------------------------------------
    let moveForward = 0;
    let moveRight = 0;

    if (keys.forward) moveForward -= 1;
    if (keys.backward) moveForward += 1;
    if (keys.left) moveRight -= 1;
    if (keys.right) moveRight += 1;

    // Mobile input blending
    if (Math.abs(mobileInput.moveY) > 0.1) moveForward -= mobileInput.moveY;
    if (Math.abs(mobileInput.moveX) > 0.1) moveRight += mobileInput.moveX;

    if (mobileInput.jumpPressed && isGrounded.current) {
      velocityY.current = 6.2;
      isGrounded.current = false;
      mobileInput.jumpPressed = false;
      sound.playJump();
    }

    const isMoving = Math.abs(moveForward) > 0.05 || Math.abs(moveRight) > 0.05;
    const speed = (keys.shift ? 7.2 : 4.4) * delta;

    if (isMoving) {
      // Calculate movement angle relative to camera yaw
      const moveAngle = Math.atan2(moveRight, moveForward) + cameraYaw.current;
      pos.current.x += Math.sin(moveAngle) * speed;
      pos.current.z += Math.cos(moveAngle) * speed;
      playerRotation.current = moveAngle + Math.PI;

      // Animate leg walk bobbing
      if (legsRef.current) {
        legsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 12) * 0.4;
      }
    } else {
      if (legsRef.current) {
        legsRef.current.rotation.x = 0;
      }
      // Idle breathing
      if (bodyMeshRef.current) {
        bodyMeshRef.current.position.y = 0.45 + Math.sin(state.clock.getElapsedTime() * 2) * 0.02;
      }
    }

    // Gravity & Vertical physics
    if (!isGrounded.current) {
      velocityY.current -= 16 * delta;
      pos.current.y += velocityY.current * delta;
    }

    // Ground level clamp
    const baseGroundY = 0.45;
    if (pos.current.y <= baseGroundY) {
      pos.current.y = baseGroundY;
      velocityY.current = 0;
      isGrounded.current = true;
    }

    // Island boundary clamp (keep player on terrain)
    const distToCenter = Math.hypot(pos.current.x, pos.current.z);
    const distToPortalIsle = Math.hypot(pos.current.x - (-16), pos.current.z - (-14));

    // If beyond main island and not on portal island, clamp gently
    if (distToCenter > 12.2 && distToPortalIsle > 6.0) {
      // Allow pathway between main island and portal isle
      const onBridge = pos.current.x < -6 && pos.current.x > -16 && pos.current.z < -4 && pos.current.z > -15;
      if (!onBridge) {
        const angle = Math.atan2(pos.current.z, pos.current.x);
        pos.current.x = Math.cos(angle) * 12.0;
        pos.current.z = Math.sin(angle) * 12.0;
      }
    }

    // If somehow fallen into void, respawn peacefully
    if (pos.current.y < -8) {
      pos.current.set(0, 0.45, 3.5);
      velocityY.current = 0;
      isGrounded.current = true;
    }

    // Update 3D player mesh
    if (playerRef.current) {
      playerRef.current.position.copy(pos.current);
      playerRef.current.rotation.y = playerRotation.current;
    }

    // Camera follow (3rd person chase camera)
    const camDist = 5.2;
    const camHeight = 2.4 + cameraPitch.current * 2.5;
    const cx = pos.current.x - Math.sin(cameraYaw.current) * camDist;
    const cz = pos.current.z - Math.cos(cameraYaw.current) * camDist;
    const cy = pos.current.y + camHeight;

    const targetCameraPos = new THREE.Vector3(cx, cy, cz);
    camera.position.lerp(targetCameraPos, delta * 8.5);

    const lookTarget = new THREE.Vector3(pos.current.x, pos.current.y + 1.2, pos.current.z);
    camera.lookAt(lookTarget);

    // ---------------------------------------------
    // 3. PROXIMITY DETECTION
    // ---------------------------------------------
    checkProximities(pos.current, setNearTarget);
  });

  const checkProximities = (playerPos, setTarget) => {
    const targets = [
      { type: 'cloud', name: 'Cumulus Softling', label: 'Pet Cloud', pos: [-5.5, 1.8, 2.5], radius: 2.8 },
      { type: 'rock', name: 'Geode the Levitating Stone', label: 'Feed Rock', pos: [4.6, 3.2, -1], radius: 3.2 },
      { type: 'npc', name: 'Cyril the Philosopher', label: 'Talk with Cyril', pos: [0.5, 0.5, 6.8], radius: 2.5 },
      { type: 'portal', name: 'Portal to Nowhere', label: 'Step Through Portal', pos: [-16, 2.8, -14], radius: 4.5 },
      { type: 'frog', name: 'Bartholomew the Frog', label: 'Examine Frog', pos: [-4.8, 0.55, -3.6], radius: 2.2 },
      { type: 'chair', name: 'The Floating Armchair', label: 'Sit on Armchair', pos: [-9.2, 1.6, 0.4], radius: 2.2 },
      { type: 'message', name: 'Waterfall Inscription', label: 'Read Inscription', pos: [-2.8, 0.2, -5.2], radius: 2.5 },
      { type: 'shrine', name: 'Shrine of Doing Nothing', label: 'Meditate at Shrine', pos: [8.2, 0.55, -4.2], radius: 2.5 },
      { type: 'sky_switch', name: 'Celestial Sky Lever', label: 'Pull Sky Lever', pos: [-1.2, 0.55, -2.8], radius: 2.0 },
      { type: 'grass', name: 'Lush Mint Grass', label: 'Touch Grass', pos: [0, 0.48, 5.2], radius: 2.2 },
    ];

    let closest = null;
    let minD = Infinity;

    for (const t of targets) {
      const d = Math.hypot(playerPos.x - t.pos[0], playerPos.z - t.pos[2]);
      if (d < t.radius && d < minD) {
        minD = d;
        closest = t;
      }
    }

    setTarget(closest);
  };

  return (
    <group ref={playerRef}>
      {/* =========================================
          STYLIZED TRAVELER CHARACTER (Matching image.png)
          ========================================= */}
      <group ref={bodyMeshRef} position={[0, 0.45, 0]}>
        {/* Legs / Boots */}
        <group ref={legsRef} position={[0, -0.2, 0]}>
          <mesh position={[-0.12, -0.15, 0]}>
            <cylinderGeometry args={[0.07, 0.08, 0.35, 6]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0.12, -0.15, 0]}>
            <cylinderGeometry args={[0.07, 0.08, 0.35, 6]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Boots */}
          <mesh position={[-0.12, -0.32, 0.04]}>
            <boxGeometry args={[0.16, 0.12, 0.22]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0.12, -0.32, 0.04]}>
            <boxGeometry args={[0.16, 0.12, 0.22]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        </group>

        {/* Torso / Warm Explorer Poncho & Jacket */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.42, 0.48, 0.28]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>

        {/* Backpack with Cute Paw Badge (Matching image.png!) */}
        <group position={[0, 0.2, -0.18]}>
          <mesh>
            <boxGeometry args={[0.3, 0.36, 0.16]} />
            <meshStandardMaterial color="#573824" roughness={0.8} />
          </mesh>
          {/* Paw print badge on backpack */}
          <mesh position={[0, 0, -0.09]}>
            <circleGeometry args={[0.08, 12]} />
            <meshBasicMaterial color="#fbcfe8" side={THREE.DoubleSide} />
          </mesh>
          {/* 3 tiny paw toe pads */}
          {[-0.04, 0, 0.04].map((tx, idx) => (
            <mesh key={idx} position={[tx, 0.06, -0.092]}>
              <circleGeometry args={[0.025, 8]} />
              <meshBasicMaterial color="#f472b6" side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>

        {/* Fluffy Cozy Scarf */}
        <mesh position={[0, 0.45, 0]}>
          <torusGeometry args={[0.18, 0.08, 8, 16]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.68, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.5} />
        </mesh>

        {/* Hair / Traveler Cap */}
        <mesh position={[0, 0.74, -0.04]}>
          <sphereGeometry args={[0.21, 12, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Antennas / Hair Tufts */}
        <mesh position={[0, 0.92, 0]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.18, 4]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Cute Face Dots (When facing forward) */}
        <mesh position={[-0.07, 0.68, 0.18]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.07, 0.68, 0.18]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
}
