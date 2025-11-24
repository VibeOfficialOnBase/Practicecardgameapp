import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Flame, Trophy, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DailyPracticeLeaderboard() {
  const { data: topPractitioners = [] } = useQuery({
    queryKey: ['dailyPracticeLeaderboard'],
    queryFn: async () => {
      const sessions = await base44.entities.DailyPracticeSession.filter({ completed: true });
      
      // Group by user and calculate stats
      const userStats = {};
      sessions.forEach(session => {
        if (!userStats[session.user_email]) {
          userStats[session.user_email] = {
            email: session.user_email,
            totalXP: 0,
            maxStreak: 0,
            completedDays: 0
          };
        }
        userStats[session.user_email].totalXP += session.total_xp_earned + session.bonus_xp;
        userStats[session.user_email].maxStreak = Math.max(
          userStats[session.user_email].maxStreak,
          session.current_streak
        );
        userStats[session.user_email].completedDays += 1;
      });

      return Object.values(userStats)
        .sort((a, b) => b.totalXP - a.totalXP)
        .slice(0, 10);
    }
  });

  return (
    <div className="card-organic p-6">
      <h3 className="text-2xl font-bold mb-4 ensure-readable-strong flex items-center gap-2">
        <Flame className="w-6 h-6 text-orange-500" />
        Daily Practice Champions
      </h3>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {topPractitioners.map((user, index) => (
            <motion.div
              key={user.email}
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
                  {user.email.split('@')[0]}
                </p>
                <div className="flex items-center gap-2 text-xs text-label">
                  <Flame className="w-3 h-3 text-orange-500" />
                  {user.maxStreak} day streak
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-purple-400">{user.totalXP} XP</p>
                <p className="text-xs text-label">{user.completedDays} days</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}