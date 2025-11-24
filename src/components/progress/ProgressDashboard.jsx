import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Heart, BookOpen, Trophy } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function ProgressDashboard({ userEmail }) {
  const { data: practices = [] } = useQuery({
    queryKey: ['recentPractices', userEmail],
    queryFn: async () => {
      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const allPractices = await base44.entities.DailyPractice.filter({
        created_by: userEmail
      });
      return allPractices.filter(p => {
        const practiceDate = new Date(p.created_date);
        const cutoff = new Date(thirtyDaysAgo);
        return practiceDate >= cutoff;
      });
    },
    enabled: !!userEmail
  });

  const { data: scores = [] } = useQuery({
    queryKey: ['recentScores', userEmail],
    queryFn: () => base44.entities.GameScore.filter({ user_email: userEmail }),
    enabled: !!userEmail
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', userEmail],
    queryFn: () => base44.entities.Achievement.filter({ created_by: userEmail }),
    enabled: !!userEmail
  });

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd');
    const practiced = practices.some(p => p.practice_date === date);
    return { date, practiced };
  });

  const gameStats = scores.reduce((acc, score) => {
    acc[score.game_type] = (acc[score.game_type] || 0) + 1;
    return acc;
  }, {});

  const mostPlayedGame = Object.entries(gameStats).sort((a, b) => b[1] - a[1])[0];

  const avgReflectionLength = practices.reduce((sum, p) => 
    sum + (p.reflection?.length || 0), 0
  ) / (practices.length || 1);

  const completionRate = (practices.filter(p => p.completed).length / (practices.length || 1)) * 100;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-organic p-6"
      >
        <h2 className="text-2xl font-bold ensure-readable-strong mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          30-Day Activity
        </h2>

        <div className="grid grid-cols-10 gap-1 mb-4">
          {last30Days.map((day, i) => (
            <div
              key={i}
              className={`aspect-square rounded transition-all ${
                day.practiced
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg'
                  : 'bg-white/10'
              }`}
              title={day.date}
            />
          ))}
        </div>

        <p className="text-sm text-label text-center">
          {practices.length} practices completed in the last 30 days
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-organic p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-label">Most Played Game</p>
              <p className="text-xl font-bold ensure-readable-strong">
                {mostPlayedGame ? mostPlayedGame[0].replace('_', ' ') : 'None yet'}
              </p>
            </div>
          </div>
          <p className="text-sm text-label">
            Played {mostPlayedGame?.[1] || 0} times
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-organic p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-label">Completion Rate</p>
              <p className="text-xl font-bold ensure-readable-strong">
                {completionRate.toFixed(0)}%
              </p>
            </div>
          </div>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-600 to-rose-600"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-organic p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-label">Avg Reflection</p>
              <p className="text-xl font-bold ensure-readable-strong">
                {avgReflectionLength.toFixed(0)} chars
              </p>
            </div>
          </div>
          <p className="text-sm text-label">
            Keep sharing your insights
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-organic p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-label">Achievements</p>
              <p className="text-xl font-bold ensure-readable-strong">
                {achievements.length}
              </p>
            </div>
          </div>
          <p className="text-sm text-label">
            Unlocked badges
          </p>
        </motion.div>
      </div>
    </div>
  );
}