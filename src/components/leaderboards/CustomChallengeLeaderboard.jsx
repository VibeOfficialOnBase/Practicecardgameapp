import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trophy, Target, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CustomChallengeLeaderboard() {
  const { data: challenges = [] } = useQuery({
    queryKey: ['completedCustomChallenges'],
    queryFn: async () => {
      const all = await base44.entities.CustomChallenge.filter({ status: 'completed' });
      return all.sort((a, b) => (b.completed_value || 0) - (a.completed_value || 0));
    }
  });

  const topChallenges = challenges.slice(0, 10);

  return (
    <div className="card-organic p-6">
      <h3 className="text-2xl font-bold mb-4 ensure-readable-strong flex items-center gap-2">
        <Target className="w-6 h-6 text-purple-400" />
        Top Challenge Completions
      </h3>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {topChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 bg-white/5 rounded-xl p-4"
            >
              <div className="flex-shrink-0">
                {index === 0 && <Trophy className="w-6 h-6 text-yellow-400" />}
                {index === 1 && <Trophy className="w-6 h-6 text-gray-300" />}
                {index === 2 && <Trophy className="w-6 h-6 text-amber-600" />}
                {index > 2 && (
                  <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold ensure-readable truncate">
                  {challenge.creator_email.split('@')[0]}
                </p>
                <p className="text-xs text-label">
                  {challenge.game_type} • {challenge.challenge_type}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-purple-400">{challenge.completed_value}</p>
                {challenge.badge_earned && <Medal className="w-4 h-4 text-amber-400 ml-auto" />}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}