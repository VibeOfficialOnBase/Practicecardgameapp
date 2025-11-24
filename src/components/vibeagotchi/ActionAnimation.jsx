import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Droplets, Heart, Wind, Pill, Moon, Gift, Star } from 'lucide-react';

const actionAnimations = {
  feed: { icon: Sparkles, color: '#F59E0B', label: '+15 Energy' },
  play: { icon: Star, color: '#EC4899', label: '+25 Happiness' },
  clean: { icon: Droplets, color: '#3B82F6', label: 'Sparkle Clean!' },
  breathe: { icon: Wind, color: '#10B981', label: '+20 Peace' },
  heal: { icon: Pill, color: '#EF4444', label: 'Fully Healed!' },
  sleep: { icon: Moon, color: '#8B5CF6', label: 'Sweet Dreams' },
  gift: { icon: Gift, color: '#F59E0B', label: 'Item Equipped' },
  tap: { icon: Heart, color: '#EC4899', label: '+1 Bond' }
};

export default function ActionAnimation({ action }) {
  if (!action) return null;

  const config = actionAnimations[action];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 0 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          scale: [0, 1.5, 1.5, 0],
          y: [0, -80, -100, -120]
        }}
        transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
      >
        <div 
          className="flex flex-col items-center gap-2 px-6 py-3 rounded-full shadow-2xl"
          style={{ backgroundColor: `${config.color}ee` }}
        >
          <Icon className="w-8 h-8 text-white" />
          <span className="text-white font-bold text-sm whitespace-nowrap">{config.label}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}