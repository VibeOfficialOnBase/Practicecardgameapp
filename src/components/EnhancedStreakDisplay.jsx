import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Star, Trophy } from 'lucide-react';

// Streak Tiers Configuration
const TIERS = [
  { min: 365, name: 'LEGENDARY', color: 'from-yellow-500 to-red-600', icon: Trophy, message: "Year-long commitment! 🏆" },
  { min: 100, name: 'DIAMOND', color: 'from-blue-500 via-purple-500 to-pink-500', icon: Star, message: "100+ days of excellence! 💎" },
  { min: 30, name: 'GOLD', color: 'from-yellow-400 to-orange-500', icon: Zap, message: "One month strong! ⚡" },
  { min: 7, name: 'SILVER', color: 'from-slate-400 to-slate-600', icon: Flame, message: "One week streak! 🔥" },
  { min: 0, name: 'BRONZE', color: 'from-orange-400 to-orange-600', icon: Flame, message: "Start your fire!" }
];

export default function EnhancedStreakDisplay({ currentStreak = 0, longestStreak = 0 }) {
  const currentTier = TIERS.find(t => currentStreak >= t.min) || TIERS[TIERS.length - 1];
  const nextTier = [...TIERS].reverse().find(t => t.min > currentStreak);

  const progress = nextTier
    ? ((currentStreak - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const Icon = currentTier.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-[32px] p-6 shadow-xl bg-gradient-to-br ${currentTier.color}`}
    >
      {/* Animated Shimmer Overlay */}
      <div className="absolute inset-0 opacity-30 shimmer" />

      {/* Content */}
      <div className="relative z-10 text-white">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg"
            >
              <Icon className="w-8 h-8 text-white fill-current" />
            </motion.div>
            <div>
              <motion.span
                key={currentStreak}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="block text-5xl font-black tracking-tight drop-shadow-lg"
              >
                {currentStreak}
              </motion.span>
              <span className="text-sm font-medium opacity-90 uppercase tracking-widest">Day Streak</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
              <span className="text-xs font-bold tracking-wider">{currentTier.name}</span>
            </div>
            <span className="text-xs opacity-80">Best: {longestStreak}</span>
          </div>
        </div>

        <p className="text-center font-bold text-lg mb-6 drop-shadow-md">
          {currentTier.message}
        </p>

        {/* Progress Bar */}
        <div className="relative h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />
        </div>
        {nextTier && (
          <p className="text-xs text-center mt-2 opacity-80">
            {nextTier.min - currentStreak} days to {nextTier.name}
          </p>
        )}
      </div>

      {/* Fire Particles */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-[-20px] w-2 h-2 bg-white rounded-full opacity-0"
            style={{ left: `${20 + i * 15}%` }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.6, 0],
              scale: [1, 2, 0]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
