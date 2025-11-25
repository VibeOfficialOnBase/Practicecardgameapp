import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Heart, Trophy, Zap, Award } from 'lucide-react';

export default function StatsWidget({ userProfile, achievements = [], level = 1 }) {
  const stats = [
    { label: 'Practices', value: userProfile?.total_practices_completed || 0, icon: BookOpen, color: 'text-blue-400' },
    { label: 'Streak', value: userProfile?.current_streak || 0, icon: Flame, color: 'text-orange-500' },
    { label: 'Level', value: level, icon: Zap, color: 'text-yellow-400' },
    { label: 'Awards', value: achievements.length, icon: Award, color: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-default"
          >
            <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-[var(--text-primary)] dark:text-white">
                {stat.value}
              </span>
              <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold">
                {stat.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
