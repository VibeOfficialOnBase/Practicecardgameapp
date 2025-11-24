import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, CheckCircle, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ACHIEVEMENTS, achievementTracker } from '../components/games/chakra-blaster/AchievementSystem';

export default function ChakraAchievements() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    loadUser();

    // Get all progress from local storage
    const allProgress = achievementTracker.getAllProgress();
    setProgress(allProgress);
  }, []);

  const { data: completedAchievements = [] } = useQuery({
    queryKey: ['chakraAchievements', user?.email],
    queryFn: () => base44.entities.ChakraAchievement.filter({ user_email: user.email, completed: true }),
    enabled: !!user
  });

  const completedIds = new Set(completedAchievements.map(a => a.achievement_id));

  const totalAchievements = Object.keys(ACHIEVEMENTS).length;
  const completedCount = completedIds.size;
  const completionPercentage = (completedCount / totalAchievements) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 ensure-readable-strong">Chakra Blaster Achievements</h1>
        <p className="ensure-readable">Track your mastery of emotional transformation</p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30 mb-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <div>
              <h2 className="text-2xl font-bold ensure-readable-strong">
                {completedCount} / {totalAchievements}
              </h2>
              <p className="text-sm text-muted">Achievements Unlocked</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gradient-purple">
              {completionPercentage.toFixed(0)}%
            </p>
            <p className="text-xs text-muted">Complete</p>
          </div>
        </div>

        <div className="relative h-4 bg-black/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(ACHIEVEMENTS).map((achievement, index) => {
          const isCompleted = completedIds.has(achievement.id);
          const achievementProgress = progress[achievement.id] || { current: 0, goal: 0, percentage: 0 };

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative bg-black/40 backdrop-blur-md rounded-2xl p-5 border-2 transition-all ${
                isCompleted
                  ? 'border-amber-500/50 shadow-lg shadow-amber-500/20'
                  : 'border-purple-500/30'
              }`}
            >
              {isCompleted && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              )}

              <div className="flex items-start gap-4 mb-3">
                <div className={`text-4xl ${!isCompleted && 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-1 ${
                    isCompleted ? 'ensure-readable-strong' : 'text-muted'
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-label mb-2">
                    {achievement.description}
                  </p>
                  
                  {!isCompleted && (
                    <>
                      <div className="relative h-2 bg-black/50 rounded-full overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${achievementProgress.percentage}%` }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                        />
                      </div>
                      <p className="text-xs text-muted">
                        {achievementProgress.current} / {achievementProgress.goal}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                <div className="flex items-center gap-1">
                  <span className="text-amber-400">💰</span>
                  <span className="text-sm font-bold ensure-readable">
                    {achievement.coinReward} Coins
                  </span>
                </div>
                {isCompleted && (
                  <span className="text-xs text-green-400 font-medium">
                    Completed
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold ensure-readable-strong">Your Stats</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(achievementTracker.getStats()).slice(0, 8).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-black/30 rounded-xl">
              <p className="text-2xl font-bold text-gradient-purple">{value}</p>
              <p className="text-xs text-muted capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}