import React from 'react';
import { GameCanvas } from './game/GameCanvas';
import { TitleScreen } from './ui/TitleScreen';
import { InGameHUD } from './ui/InGameHUD';
import { MobileControls } from './ui/MobileControls';
import { DialogModal } from './ui/DialogModal';
import { PortalSequence } from './ui/PortalSequence';
import { WorldModal } from './ui/WorldModal';
import { AboutModal } from './ui/AboutModal';
import { InventoryModal } from './ui/InventoryModal';
import { JournalModal } from './ui/JournalModal';
import { AchievementsModal } from './ui/AchievementsModal';
import { SettingsModal } from './ui/SettingsModal';
import { Toasts } from './ui/Toasts';

export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0d1e] font-sans antialiased">
      {/* Real-time 3D Three.js / React Three Fiber Canvas */}
      <GameCanvas />

      {/* Title Cover Screen (Matching concept image) */}
      <TitleScreen />

      {/* 3rd Person In-Game Exploration HUD */}
      <InGameHUD />

      {/* Mobile Virtual Joystick */}
      <MobileControls />

      {/* Interactive Character Dialogue Modal */}
      <DialogModal />

      {/* Stargate Cosmic Warp Sequence */}
      <PortalSequence />

      {/* Modals */}
      <WorldModal />
      <AboutModal />
      <InventoryModal />
      <JournalModal />
      <AchievementsModal />
      <SettingsModal />

      {/* Feedback & Achievement Toasts */}
      <Toasts />
    </div>
  );
}
