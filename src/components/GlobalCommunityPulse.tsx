import { useState, useEffect, memo } from 'react';
import { Globe, Users, TrendingUp, Award, Flame, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const GlobalCommunityPulseComponent = () => {
  const stats = useGlobalCommunityStats();
  const [showShareModal, setShowShareModal] = useState(false);
  const [activityFeed, setActivityFeed] = useState<Array<{ id: string; text: string; timestamp: Date }>>([]);

  // Update activity feed when new data comes in
  useEffect(() => {
    if (!stats.connected) return;

    const newActivities: Array<{ id: string; text: string; timestamp: Date }> = [];

    // Add recent pulls
    stats.recentPulls.slice(0, 5).forEach(pull => {
      const card = practiceCards.find(c => c.id === pull.cardId);
      newActivities.push({
        id: `pull-${pull.username}-${pull.timestamp.getTime()}`,
        text: `${pull.username} pulled "${card?.affirmation.substring(0, 30) || 'a card'}..."`,
        timestamp: pull.timestamp,
      });
    });

    // Add recent achievements
    stats.recentAchievements.slice(0, 3).forEach(achievement => {
      const achievementName = achievementNames[achievement.achievementId] || achievement.achievementId;
      newActivities.push({
        id: `achievement-${achievement.username}-${achievement.timestamp.getTime()}`,
        text: `${achievement.username} earned ${achievementName}`,
        timestamp: achievement.timestamp,
      });
    });

    // Sort by timestamp and take the most recent
    newActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setActivityFeed(newActivities.slice(0, 8));
  }, [stats.recentPulls, stats.recentAchievements, stats.connected]);

  if (!stats.connected) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-purple-600 animate-spin" />
          <h3 className="text-lg font-bold text-gray-900">Connecting to Community...</h3>
        </div>
        <p className="text-sm text-gray-600">Loading real-time community data...</p>
      </div>
    );
  }

  const mostPopularCard = stats.mostPopularCardToday
    ? practiceCards.find(c => c.id === stats.mostPopularCardToday?.cardId)
    : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gentle-pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 0 rgba(168, 85, 247, 0);
            }
            50% {
              transform: scale(1.01);
              box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 10px rgba(168, 85, 247, 0.1);
            }
          }
          .pulse-container {
            animation: gentle-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `
      }} />
      
      <div className="pulse-container bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-200 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl -z-0"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-purple-600 animate-[spin_20s_linear_infinite]" />
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Global Community Pulse
                </h3>
                <p className="text-xs text-purple-600 font-semibold">✨ Real-time community data</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1 hover:bg-purple-100"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>

          {/* Real-time Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Active Today */}
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600">TODAY</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.activeUsersToday}</div>
              <div className="text-xs text-gray-600">Active Users</div>
            </div>

            {/* Cards Today */}
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-purple-100">
              <Users className="w-4 h-4 text-purple-600 mb-1" />
              <div className="text-2xl font-bold text-purple-600">{stats.pullsToday}</div>
              <div className="text-xs text-gray-600">Cards Today</div>
            </div>

            {/* This Week */}
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-purple-100">
              <TrendingUp className="w-4 h-4 text-pink-600 mb-1" />
              <div className="text-2xl font-bold text-pink-600">{stats.pullsThisWeek}</div>
              <div className="text-xs text-gray-600">Cards This Week</div>
            </div>

            {/* Total Community */}
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-1 mb-1">
                <Globe className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-xs text-gray-600">Total Members</div>
            </div>
          </div>

          {/* Most Popular Card */}
          {mostPopularCard && stats.mostPopularCardToday && (
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-purple-100 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">Today's Most Popular Card</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">{mostPopularCard.affirmation}</div>
                  <div className="text-sm text-gray-600">{mostPopularCard.mission}</div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.mostPopularCardToday.count}
                  <span className="text-xs text-gray-600 ml-1">pulls</span>
                </div>
              </div>
            </div>
          )}

          {/* Activity Stream */}
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">Live Activity</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {activityFeed.length === 0 ? (
                <div className="text-center py-4 space-y-2">
                  <p className="text-xs text-gray-600 font-semibold">🌱 Growing the community...</p>
                  <p className="text-xs text-gray-500 italic">Be one of the first! Pull a card to show up here.</p>
                </div>
              ) : (
                activityFeed.map(activity => (
                  <div
                    key={activity.id}
                    className="text-sm text-gray-700 flex items-center justify-between p-2 hover:bg-white/40 rounded-lg transition-colors"
                  >
                    <span>{activity.text}</span>
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Share Community Stats</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-4 border border-purple-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stats.pullsToday}</div>
                <div className="text-sm text-gray-700 mb-4">
                  cards pulled today by {stats.activeUsersToday} active users
                </div>
                <div className="text-xs text-gray-600">
                  Join the PRACTICE movement — daily card pulls for self-improvement 🌟
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const text = `I'm part of the PRACTICE community — ${stats.pullsToday} cards pulled today by ${stats.activeUsersToday} active users! Join us for daily self-improvement 🌟`;
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                    '_blank'
                  );
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share on X
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

// Memoize component to prevent unnecessary re-renders
export const GlobalCommunityPulse = memo(GlobalCommunityPulseComponent);
