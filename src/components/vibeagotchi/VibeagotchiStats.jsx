import React from 'react';
import { motion } from 'framer-motion';

import { Zap, Target, Heart, Sparkles, Smile, Shield } from 'lucide-react';

const statIcons = {
  energy: Zap,
  happiness: Smile,
  health: Shield,
  focus: Target,
  peace: Heart,
  bond: Sparkles
};

const statColors = {
  energy: '#F59E0B',
  happiness: '#FCD34D',
  health: '#EF4444',
  focus: '#3B82F6',
  peace: '#10B981',
  bond: '#EC4899'
};

export default function VibeagotchiStats({ state }) {
  const stats = [
    { key: 'energy', label: 'Energy', value: state.energy || 0 },
    { key: 'happiness', label: 'Happy', value: state.happiness || 0 },
    { key: 'health', label: 'Health', value: state.health || 100 },
    { key: 'bond', label: 'Bond', value: state.bond || 0 }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = statIcons[stat.key];
        const color = statColors[stat.key];
        
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20"
          >
            <div className="flex items-center gap-1 md:gap-2 mb-2">
              <Icon className="w-3 h-3 md:w-4 md:h-4" style={{ color }} />
              <span className="text-xs md:text-sm font-semibold ensure-readable">{stat.label}</span>
            </div>
            
            <div className="relative h-1.5 md:h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${stat.value}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
            
            <p className="text-right text-xs mt-1 font-bold" style={{ color }}>
              {stat.value}/100
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}