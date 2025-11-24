import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundManager } from './utils/soundManager';

export default function SoundToggle() {
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());

  const toggleSound = () => {
    const newValue = !soundEnabled;
    soundManager.setEnabled(newValue);
    setSoundEnabled(newValue);
  };

  return (
    <motion.button
      onClick={toggleSound}
      className="bg-white/20 backdrop-blur-md rounded-xl p-3 hover:bg-white/30 transition-all border border-white/40 shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {soundEnabled ? (
        <Volume2 className="w-6 h-6 text-white" />
      ) : (
        <VolumeX className="w-6 h-6 text-white" />
      )}
    </motion.button>
  );
}