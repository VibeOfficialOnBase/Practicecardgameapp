import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function XPBar({ userEmail }) {
  const { data: userLevel } = useQuery({
    queryKey: ['userLevel', userEmail],
    queryFn: async () => {
      const levels = await base44.entities.UserLevel.filter({ user_email: userEmail });
      if (levels.length === 0) {
        const newLevel = await base44.entities.UserLevel.create({
          user_email: userEmail,
          level: 1,
          experience_points: 0,
          points_to_next_level: 100
        });
        return newLevel;
      }
      return levels[0];
    },
    enabled: !!userEmail
  });

  if (!userLevel) return null;

  const xpForNextLevel = userLevel.level * 100;
  const progress = (userLevel.experience_points / xpForNextLevel) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3 border border-purple-500/40 shadow-lg"
    >
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400" />
        <span className="font-bold text-sm" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Lv {userLevel.level}</span>
      </div>

      <div className="flex-1 min-w-[120px]">
        <div className="relative h-2 bg-black/50 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg"
            style={{ boxShadow: '0 0 12px rgba(251, 191, 36, 0.6)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <span className="text-xs whitespace-nowrap font-semibold" style={{ color: '#F0F0F0', textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
        {userLevel.experience_points}/{xpForNextLevel}
      </span>
    </motion.div>
  );
}