import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LevelProgress({ userEmail }) {
  const { data: userLevels = [] } = useQuery({
    queryKey: ['userLevel', userEmail],
    queryFn: () => base44.entities.UserLevel.filter({ user_email: userEmail }),
    enabled: !!userEmail
  });

  const userLevel = userLevels[0] || { level: 1, experience_points: 0, points_to_next_level: 100 };
  const progress = ((userLevel.experience_points % 100) / 100) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-organic p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Level {userLevel.level}</h3>
            <p className="text-sm text-slate-600">{userLevel.experience_points} XP</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Next level</p>
          <p className="text-sm font-semibold text-indigo-600">
            {userLevel.points_to_next_level} XP
          </p>
        </div>
      </div>

      <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
        />
      </div>
      
      <p className="text-xs text-center text-slate-500 mt-2">
        {Math.round(progress)}% to Level {userLevel.level + 1}
      </p>
    </motion.div>
  );
}