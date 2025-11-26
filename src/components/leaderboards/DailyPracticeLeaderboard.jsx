
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { appApi } from '@/api/supabaseClient';
import { motion } from 'framer-motion';
import { Crown, Trophy, User } from 'lucide-react';
import Card from '../common/Card';

const DailyPracticeLeaderboard = () => {
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['dailyPracticeLeaderboard'],
    queryFn: async () => {
      // This is a simplified mock. In a real app, you'd have a dedicated function
      // or RPC call to get ranked user profiles based on streak or points.
      const profiles = await appApi.entities.UserProfile.list('-current_streak', 10);
      return profiles;
    },
  });

  if (isLoading) {
    return <div className="text-center p-4">Loading Leaderboard...</div>;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-400" />
        Top Practitioners
      </h3>
      <div className="space-y-3">
        {leaderboardData && leaderboardData.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm w-6 text-center">{index + 1}</span>
              <img
                src={user.profile_image_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.id}`}
                alt={user.display_name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium text-sm">{user.display_name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2">
              {index === 0 && <Crown className="w-4 h-4 text-yellow-400" />}
              <span className="font-bold text-sm">{user.current_streak || 0} days</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default DailyPracticeLeaderboard;
