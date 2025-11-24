import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Award, Star } from 'lucide-react';

export default function StreakCounter({ streak = 0, longestStreak = 0, showRing = false, progress = 0 }) {
  const getMilestone = (days) => {
    if (days >= 365) return { icon: Star, color: 'from-amber-400 via-orange-500 to-rose-500', size: 20, label: 'Eternal Flame!' };
    if (days >= 100) return { icon: Award, color: 'from-amber-500 via-orange-600 to-amber-700', size: 18, label: 'Bonfire!' };
    if (days >= 30) return { icon: Flame, color: 'from-orange-400 via-amber-500 to-orange-600', size: 16, label: 'Strong Flame!' };
    if (days >= 7) return { icon: Flame, color: 'from-amber-400 to-orange-500', size: 14, label: 'Growing Flame!' };
    return { icon: Flame, color: 'from-orange-300 to-amber-400', size: 12, label: 'New Ember!' };
  };

  const milestone = getMilestone(streak);
  const Icon = milestone.icon;
  const nextMilestone = streak < 7 ? 7 : streak < 30 ? 30 : streak < 100 ? 100 : 365;
  const progressToNext = streak >= 365 ? 100 : ((streak % nextMilestone) / nextMilestone) * 100;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br gradient-sunrise p-8 shadow-xl glow-warm texture-paper">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 3, -3, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl"></div>
            <Icon 
              className="relative drop-shadow-2xl text-white" 
              style={{ width: `${milestone.size * 4}px`, height: `${milestone.size * 4}px` }}
              fill="white" 
            />
          </motion.div>
          
          <div className="text-white">
            <p className="text-sm font-medium opacity-90 mb-1">Current Streak</p>
            <motion.p 
              className="text-5xl font-bold tracking-tight"
              key={streak}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {streak}
            </motion.p>
            <p className="text-sm opacity-90 mt-1">
              {streak === 1 ? 'day of growth' : 'days of growth'}
            </p>
          </div>
        </div>

        <div className="text-right text-white">
          <p className="text-xs opacity-75 mb-1">Personal Best</p>
          <p className="text-3xl font-bold">{longestStreak}</p>
          {nextMilestone > streak && (
            <p className="text-xs opacity-75 mt-2">
              {nextMilestone - streak} to {nextMilestone} days!
            </p>
          )}
        </div>
      </div>

      {showRing && (
        <div className="mt-6">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-white text-xs text-center mt-2 opacity-75">
            {progress}% complete today
          </p>
        </div>
      )}
    </div>
  );
}