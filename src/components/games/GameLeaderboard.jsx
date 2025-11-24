import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trophy, Medal, Crown, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GameLeaderboard({ gameType, mode = 'global' }) {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: scores = [] } = useQuery({
    queryKey: ['leaderboard', gameType, mode],
    queryFn: async () => {
      const allScores = await base44.entities.GameScore.filter({ game_type: gameType });
      
      // Group by user and get their best score
      const userBestScores = {};
      allScores.forEach(score => {
        if (!userBestScores[score.user_email] || score.score > userBestScores[score.user_email].score) {
          userBestScores[score.user_email] = score;
        }
      });
      
      return Object.values(userBestScores)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }
  });

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300 fill-gray-300" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600 fill-amber-600" />;
    return <Trophy className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div className="w-full max-w-md">
      <h3 className="text-2xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Top Players
      </h3>
      
      <div className="space-y-2">
        {scores.map((score, index) => {
          const isCurrentUser = score.user_email === user?.email;
          
          return (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-xl backdrop-blur-md ${
                isCurrentUser 
                  ? 'bg-purple-500/30 border-2 border-purple-400' 
                  : 'bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(index)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-300" />
                  <span className={`font-semibold ${isCurrentUser ? 'text-white' : 'text-purple-200'}`}>
                    {score.user_email.split('@')[0]}
                    {isCurrentUser && ' (You)'}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{score.score}</p>
                {score.level_reached && (
                  <p className="text-xs text-purple-300">Lvl {score.level_reached}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {scores.length === 0 && (
        <p className="text-center text-purple-300 py-8">No scores yet. Be the first!</p>
      )}
    </div>
  );
}