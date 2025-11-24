import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Award } from 'lucide-react';

export default function EnhancedStreakDisplay({ currentStreak, longestStreak }) {
  const isOnFire = currentStreak >= 7;
  const isLegendary = currentStreak >= 30;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-organic p-6 relative overflow-hidden"
    >
      {isLegendary && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 animate-pulse" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: isOnFire ? [1, 1.2, 1] : 1,
                rotate: isOnFire ? [0, 5, -5, 0] : 0
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className={`w-8 h-8 ${isOnFire ? 'text-orange-500' : 'text-gray-400'}`} />
            </motion.div>
            <div>
              <p className="text-sm text-label">Current Streak</p>
              <p className="text-3xl font-bold ensure-readable-strong">{currentStreak} days</p>
            </div>
          </div>

          {isLegendary && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2 rounded-full"
            >
              <Award className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm">LEGENDARY</span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-label">
            Longest: <span className="font-bold ensure-readable">{longestStreak} days</span>
          </span>
        </div>

        {currentStreak > 0 && currentStreak % 7 === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
          >
            <p className="text-sm font-semibold text-center ensure-readable">
              🎉 Weekly Streak Bonus! +50 XP
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}