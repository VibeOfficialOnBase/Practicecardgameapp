import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';

export default function GameMasteryDisplay({ userEmail, gameType }) {
  const { data: mastery } = useQuery({
    queryKey: ['gameMastery', userEmail, gameType],
    queryFn: async () => {
      const masteries = await base44.entities.GameMastery.filter({
        user_email: userEmail,
        game_type: gameType
      });
      
      if (masteries.length === 0) {
        const newMastery = await base44.entities.GameMastery.create({
          user_email: userEmail,
          game_type: gameType,
          mastery_level: 1,
          mastery_xp: 0,
          total_plays: 0,
          total_score: 0
        });
        return newMastery;
      }
      
      return masteries[0];
    },
    enabled: !!userEmail && !!gameType
  });

  if (!mastery) return null;

  const xpForNextLevel = mastery.mastery_level * 200;
  const progress = (mastery.mastery_xp / xpForNextLevel) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-purple-500/30"
    >
      <div className="flex items-center gap-3 mb-2">
        <Star className="w-5 h-5 text-amber-400" />
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            Mastery Level {mastery.mastery_level}
          </p>
          <div className="relative h-1.5 bg-black/30 rounded-full overflow-hidden mt-1">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          {mastery.mastery_xp}/{xpForNextLevel}
        </span>
      </div>
      
      <div className="flex items-center gap-3 text-xs" style={{ color: '#C7B1FF', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
        <span>{mastery.total_plays} plays</span>
        <span>•</span>
        <span>{mastery.unlocked_cosmetics?.length || 0} cosmetics</span>
      </div>
    </motion.div>
  );
}