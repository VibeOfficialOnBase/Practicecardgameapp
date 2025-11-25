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
    <div className="grid grid-cols-4 gap-2 px-2">
      {stats.map((stat, index) => {
        const Icon = statIcons[stat.key];
        const color = statColors[stat.key];
        
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center gap-1 bg-[var(--bg-secondary)]/80 backdrop-blur-sm rounded-xl p-2 shadow-sm border border-white/10"
          >
            <Icon className="w-4 h-4" style={{ color }} />
            
            <div className="w-full h-1 bg-[var(--bg-primary)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${stat.value}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
              />
            </div>
            
            <span className="text-[10px] font-bold text-[var(--text-secondary)]">
              {Math.round(stat.value)}%
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
