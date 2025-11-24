import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Heart, Palette, BookOpen, Trophy } from 'lucide-react';

const gameModes = {
  chakra_blaster: [
    { id: 'normal', name: 'Classic Mode', icon: Zap, description: 'Battle through 20 levels', unlockLevel: 1 },
    { id: 'zen', name: 'Zen Mode', icon: Heart, description: 'Meditative reflection gameplay', unlockLevel: 5 },
    { id: 'survival', name: 'Survival', icon: Trophy, description: 'Endless challenge', unlockLevel: 10 }
  ],
  challenge_bubbles: [
    { id: 'normal', name: 'Classic Mode', icon: Zap, description: 'Match bubbles to clear', unlockLevel: 1 },
    { id: 'creative', name: 'Creative Mode', icon: Palette, description: 'Design your own patterns', unlockLevel: 5 },
    { id: 'time_attack', name: 'Time Attack', icon: Trophy, description: 'Race against the clock', unlockLevel: 8 }
  ],
  memory_match: [
    { id: 'normal', name: 'Classic Mode', icon: Brain, description: 'Match affirmation pairs', unlockLevel: 1 },
    { id: 'story', name: 'Story Mode', icon: BookOpen, description: 'Unlock narrative snippets', unlockLevel: 5 },
    { id: 'speed', name: 'Speed Mode', icon: Zap, description: 'Quick memory challenges', unlockLevel: 10 }
  ]
};

export default function GameModeSelector({ gameType, playerLevel, onSelectMode, currentMode }) {
  const modes = gameModes[gameType] || [];

  return (
    <div className="grid gap-4">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isLocked = playerLevel < mode.unlockLevel;
        const isActive = currentMode === mode.id;

        return (
          <motion.button
            key={mode.id}
            onClick={() => !isLocked && onSelectMode(mode.id)}
            disabled={isLocked}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              isActive
                ? 'border-purple-500 bg-purple-500/20'
                : isLocked
                ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                : 'border-white/20 bg-white/5 hover:border-white/40 cursor-pointer'
            }`}
            whileHover={!isLocked ? { scale: 1.02 } : {}}
            whileTap={!isLocked ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isLocked ? 'bg-gray-600' : 'bg-gradient-to-br from-purple-600 to-indigo-600'
              }`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold ensure-readable">{mode.name}</p>
                  {isLocked && (
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                      Level {mode.unlockLevel}
                    </span>
                  )}
                </div>
                <p className="text-sm text-label">{mode.description}</p>
              </div>
              {isActive && (
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}