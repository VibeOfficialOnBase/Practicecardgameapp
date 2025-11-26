import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Eye } from 'lucide-react';
import { useGlobalCommunityStats } from '@/hooks/useGlobalCommunityStats';
import { practiceCards } from '@/data/cardsWithRarity';

import { Button } from '@/components/ui/button';

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

interface ActivityItem {
  id: string;
  type: 'pull' | 'achievement';
  username: string;
  cardId?: number;
  achievementId?: string;
  timestamp: Date;
}

export function EnhancedActivityFeed() {
  const stats = useGlobalCommunityStats();
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [selectedCard, setSelectedCard] = useState<typeof practiceCards[0] | null>(null);

  useEffect(() => {
    if (!stats.connected) return;

    const newActivities: ActivityItem[] = [];

    // Add recent pulls
    stats.recentPulls.slice(0, 8).forEach(pull => {
      newActivities.push({
        id: `pull-${pull.username}-${pull.timestamp.getTime()}`,
        type: 'pull',
        username: pull.username,
        cardId: pull.cardId,
        timestamp: pull.timestamp,
      });
    });

    // Add recent achievements
    stats.recentAchievements.slice(0, 5).forEach(achievement => {
      newActivities.push({
        id: `achievement-${achievement.username}-${achievement.timestamp.getTime()}`,
        type: 'achievement',
        username: achievement.username,
        achievementId: achievement.achievementId,
        timestamp: achievement.timestamp,
      });
    });

    // Sort by timestamp
    newActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setActivityFeed(newActivities.slice(0, 10));
  }, [stats.recentPulls, stats.recentAchievements, stats.connected]);

  if (!stats.connected) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
          <h3 className="text-lg font-bold text-gray-900">Live Activity</h3>
        </div>
        <p className="text-sm text-gray-600">Connecting to community...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">Live Activity</h3>
          <span className="text-xs text-purple-600 font-semibold ml-auto">Real-time</span>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {activityFeed.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-semibold">🌱 Be the first!</p>
              <p className="text-xs text-gray-500">Pull a card to show up in the live feed</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {activityFeed.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    if (activity.type === 'pull' && activity.cardId) {
                      const card = practiceCards.find(c => c.id === activity.cardId);
                      if (card) setSelectedCard(card);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* User Avatar or Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-md">
                      {activity.username.charAt(0).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-gray-900 font-semibold truncate">
                          {activity.username}
                        </p>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>

                      {activity.type === 'pull' && activity.cardId && (
                        <div className="mt-1">
                          {(() => {
                            const card = practiceCards.find(c => c.id === activity.cardId);
                            return (
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-3 h-3 text-purple-500 flex-shrink-0" />
                                <p className="text-xs text-gray-700 line-clamp-2 flex-1">
                                  Pulled: <span className="font-semibold">{card?.affirmation.substring(0, 40)}...</span>
                                </p>
                                <Eye className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {activity.type === 'achievement' && activity.achievementId && (
                        <div className="mt-1 flex items-center gap-2">
                          <Award className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          <p className="text-xs text-gray-700">
                            Earned <span className="font-semibold">{achievementNames[activity.achievementId]}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {activityFeed.length > 0 && (
          <div className="mt-4 pt-4 border-t border-purple-200 text-center">
            <p className="text-xs text-purple-600 font-semibold">
              🎉 {stats.activeUsersToday} active users today · {stats.pullsToday} cards pulled
            </p>
          </div>
        )}
      </div>

      {/* Card Preview Modal */}
      {selectedCard && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCard(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Card Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCard(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Affirmation</p>
                <p className="text-sm font-bold text-gray-900">{selectedCard.affirmation}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Mission</p>
                <p className="text-sm text-gray-800">{selectedCard.mission}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Inspiration</p>
                <p className="text-sm italic text-gray-700">"{selectedCard.inspiration}"</p>
              </div>
            </div>

            <Button
              variant="gradient"
              className="w-full"
              onClick={() => setSelectedCard(null)}
            >
              ✨ Inspired! Close ✨
            </Button>
          </motion.div>
        </div>
      )}
    </>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return date.toLocaleDateString();
}
