import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Users, TrendingUp, Flame, Trophy, Activity } from 'lucide-react';
import { useGlobalCommunityStats } from '@/hooks/useGlobalCommunityStats';
import { practiceCards } from '@/data/cardsWithRarity';

const achievementNames: Record<string, string> = {
  first_pull: 'First Card Pull',
  three_day_streak: '3-Day Streak',
  seven_day_streak: '7-Day Streak',
  thirty_day_streak: '30-Day Streak',
  hundred_day_streak: '100-Day Streak',
  first_journal: 'First Journal Entry',
  ten_journals: '10 Journal Entries',
  all_cards: 'Collected All Cards',
  social_sharer: 'Social Butterfly',
  community_builder: 'Community Builder',
};

const CommunityStatsWidgetComponent = () => {
  const stats = useGlobalCommunityStats();
  const [recentActivity, setRecentActivity] = useState<Array<{ id: string; text: string; timestamp: Date }>>([]);

  // Update activity feed from real data
  useEffect(() => {
    if (!stats.connected) return;

    const newActivities: Array<{ id: string; text: string; timestamp: Date }> = [];

    // Add recent pulls to activity feed
    stats.recentPulls.slice(0, 3).forEach(pull => {
      const card = practiceCards.find(c => c.id === pull.cardId);
      newActivities.push({
        id: `pull-${pull.username}-${pull.timestamp.getTime()}`,
        text: `🎴 ${pull.username} pulled their daily card`,
        timestamp: pull.timestamp,
      });
    });

    // Add recent achievements to activity feed
    stats.recentAchievements.slice(0, 2).forEach(achievement => {
      const achievementName = achievementNames[achievement.achievementId] || achievement.achievementId;
      newActivities.push({
        id: `achievement-${achievement.username}-${achievement.timestamp.getTime()}`,
        text: `🏆 ${achievement.username} earned ${achievementName}`,
        timestamp: achievement.timestamp,
      });
    });

    // Sort by timestamp and take the most recent
    newActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setRecentActivity(newActivities.slice(0, 5));
  }, [stats.recentPulls, stats.recentAchievements, stats.connected]);

  if (!stats.connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-slate-900/40 to-gray-900/40 border-white/20 backdrop-blur-sm p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-300 animate-spin" />
            <span className="text-white text-sm">Connecting to real-time community data...</span>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      {/* Stats Grid - Real Data from SpacetimeDB */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-400/30 backdrop-blur-sm p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-300" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
            </div>
            <motion.div
              key={stats.activeUsersToday}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-white"
            >
              {stats.activeUsersToday}
            </motion.div>
            <div className="text-green-200 text-xs">Active Today</div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-400/30 backdrop-blur-sm p-3 sm:p-4">
            <Users className="w-4 h-4 text-blue-300 mb-2" />
            <motion.div
              key={stats.totalPulls}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-white"
            >
              {stats.totalPulls.toLocaleString()}
            </motion.div>
            <div className="text-blue-200 text-xs">Total Pulls</div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-400/30 backdrop-blur-sm p-3 sm:p-4">
            <Flame className="w-4 h-4 text-orange-300 mb-2" />
            <motion.div
              key={stats.highestStreak}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-white"
            >
              {stats.highestStreak}
            </motion.div>
            <div className="text-orange-200 text-xs">Top Streak</div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-sm p-3 sm:p-4">
            <TrendingUp className="w-4 h-4 text-purple-300 mb-2" />
            <motion.div
              key={stats.pullsToday}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-white"
            >
              {stats.pullsToday}
            </motion.div>
            <div className="text-purple-200 text-xs">Today's Pulls</div>
          </Card>
        </motion.div>
      </div>

      {/* Live Activity Feed - Real Data */}
      <Card className="bg-gradient-to-br from-slate-900/40 to-gray-900/40 border-white/20 backdrop-blur-sm p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white font-bold text-sm">Live Activity</h3>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-400 rounded-full ml-auto"
          />
        </div>
        
        <div className="space-y-2 max-h-32 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {recentActivity.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4 space-y-1"
              >
                <p className="text-white/70 text-xs font-semibold">🌱 Growing the community...</p>
                <p className="text-white/50 text-xs italic">Be one of the first! Your activity will show up here.</p>
              </motion.div>
            ) : (
              recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/80 text-xs py-1 border-l-2 border-purple-400/50 pl-2"
                >
                  {activity.text}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const CommunityStatsWidget = memo(CommunityStatsWidgetComponent);
