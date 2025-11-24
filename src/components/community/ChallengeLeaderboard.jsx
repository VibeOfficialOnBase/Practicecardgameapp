import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function ChallengeLeaderboard({ challengeId }) {
  const { data: leaderboard = [] } = useQuery({
    queryKey: ['challengeLeaderboard', challengeId],
    queryFn: async () => {
      const points = await base44.entities.ChallengePoints.filter({ challenge_id: challengeId });
      const profiles = await base44.entities.UserProfile.list();
      
      return points
        .sort((a, b) => b.points - a.points)
        .slice(0, 10)
        .map(p => ({
          ...p,
          profile: profiles.find(prof => prof.created_by === p.user_email)
        }));
    }
  });

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-amber-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-orange-600" />;
    return <Award className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-400" />
        Challenge Leaderboard
      </h4>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/5 rounded-xl p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {getRankIcon(index)}
              <div>
                <p className="text-white font-medium">
                  {entry.profile?.display_name || 'Anonymous'}
                </p>
                <p className="text-xs text-slate-400">
                  {entry.badges_earned?.length || 0} badges earned
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-purple-400">{entry.points}</p>
              <p className="text-xs text-slate-400">points</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}