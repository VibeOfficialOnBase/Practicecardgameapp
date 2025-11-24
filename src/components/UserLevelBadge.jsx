import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const getLevelColor = (level) => {
  if (level >= 50) return 'from-purple-600 to-pink-600';
  if (level >= 30) return 'from-indigo-600 to-purple-600';
  if (level >= 20) return 'from-blue-600 to-indigo-600';
  if (level >= 10) return 'from-cyan-600 to-blue-600';
  return 'from-green-600 to-cyan-600';
};

const getLevelTitle = (level) => {
  if (level >= 50) return 'Master';
  if (level >= 30) return 'Expert';
  if (level >= 20) return 'Advanced';
  if (level >= 10) return 'Intermediate';
  return 'Beginner';
};

export default function UserLevelBadge({ level, compact = false }) {
  const colorGradient = getLevelColor(level);
  const title = getLevelTitle(level);

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${colorGradient} text-white text-xs font-bold shadow-lg`}
      >
        <Zap className="w-3.5 h-3.5 fill-white" />
        <span>Lv.{level}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${colorGradient} text-white font-bold shadow-xl`}
    >
      <Zap className="w-5 h-5 fill-white" />
      <div className="text-left">
        <div className="text-sm opacity-90">{title}</div>
        <div className="text-lg">Level {level}</div>
      </div>
    </motion.div>
  );
}