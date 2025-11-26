import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  Target, 
  Flame,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { getUserPulls } from '@/utils/pullTracking';
import { getUserXP, getLevelInfo, getUserXPTransactions } from '@/utils/xpTracking';
import { getUserAchievements, ACHIEVEMENTS } from '@/utils/achievementsTracking';
import { getJournalStats } from '@/utils/journalTracking';

import { getCompletedChallengesCount } from '@/utils/challengeTracking';
import { motion } from 'framer-motion';
import { EmptyState } from '@/components/EmptyState';

interface AnalyticsDashboardProps {
  username: string;
}

export default function AnalyticsDashboard({ username }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState({
    totalPulls: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalXP: 0,
    level: 1,
    achievementsUnlocked: 0,
    journalEntries: 0,
    challengesCompleted: 0,
    favoriteCards: 0
  });

  const [timelineData, setTimelineData] = useState<{ date: string; pulls: number; xp: number }[]>([]);
  const [xpBreakdown, setXpBreakdown] = useState<{ source: string; amount: number }[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [username]);

  const loadAnalytics = () => {
    if (!username) return;
    const pulls = getUserPulls(username);
    const xpData = getUserXP(username);
    const levelInfo = getLevelInfo(username);
    const achievements = getUserAchievements(username);
    const journalStats = getJournalStats(username);
    // Get favorite cards count
    const favoriteCardsCount = 0; // Will be calculated from favorites tracking
    const challengesCompleted = getCompletedChallengesCount(username);

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    if (pulls.length > 0) {
      currentStreak = 1;
      tempStreak = 1;
      
      for (let i = pulls.length - 1; i > 0; i--) {
        const current = new Date(pulls[i].date);
        const prev = new Date(pulls[i - 1].date);
        const diffTime = Math.abs(current.getTime() - prev.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) longestStreak = tempStreak;
          tempStreak = 1;
        }
      }
      
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    }

    setStats({
      totalPulls: pulls.length,
      currentStreak,
      longestStreak,
      totalXP: xpData.totalXP,
      level: levelInfo.level,
      achievementsUnlocked: achievements.length,
      journalEntries: journalStats.totalEntries,
      challengesCompleted,
      favoriteCards: favoriteCardsCount
    });

    // Build timeline (last 30 days)
    const timeline: { date: string; pulls: number; xp: number }[] = [];
    const xpTransactions = getUserXPTransactions(username);
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const pullsOnDay = pulls.filter((p) => {
        const pullDate = new Date(p.date);
        return pullDate.toDateString() === date.toDateString();
      }).length;

      const xpOnDay = xpTransactions
        .filter((t) => {
          const txDate = new Date(t.timestamp);
          return txDate.toDateString() === date.toDateString();
        })
        .reduce((sum, t) => sum + t.amount, 0);

      timeline.push({ date: dateStr, pulls: pullsOnDay, xp: xpOnDay });
    }

    setTimelineData(timeline);

    // XP Breakdown by source
    const breakdown: Record<string, number> = {};
    xpTransactions.forEach((tx) => {
      const source = tx.reason.split(' ')[0]; // Get first word as category
      breakdown[source] = (breakdown[source] || 0) + tx.amount;
    });

    const xpBreakdownArray = Object.entries(breakdown)
      .map(([source, amount]) => ({ source, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    setXpBreakdown(xpBreakdownArray);
  };

  // Show empty state if no activity
  if (stats.totalPulls === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No Analytics Yet"
        description="Pull your first card to start tracking your PRACTICE journey. Your stats, streaks, and achievements will appear here!"
        actionLabel="← Back to Pull Card"
        onAction={() => window.history.back()}
        emoji="📊"
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          📊 Analytics Dashboard
        </h2>
        <p className="text-indigo-200 text-sm">
          Deep insights into your PRACTICE journey
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="backdrop-blur-lg bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-400/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <CardTitle className="text-sm text-gray-300">Total Cards</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.totalPulls}</p>
              <p className="text-xs text-gray-400 mt-1">cards pulled</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-lg bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-400/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <CardTitle className="text-sm text-gray-300">Current Streak</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.currentStreak}</p>
              <p className="text-xs text-gray-400 mt-1">days in a row</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-lg bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border-yellow-400/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <CardTitle className="text-sm text-gray-300">Level</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.level}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.totalXP.toLocaleString()} XP</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="backdrop-blur-lg bg-gradient-to-br from-pink-900/40 to-rose-900/40 border-pink-400/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-pink-400" />
                <CardTitle className="text-sm text-gray-300">Achievements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.achievementsUnlocked}</p>
              <p className="text-xs text-gray-400 mt-1">of {ACHIEVEMENTS.length}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white/20">
            <Activity className="w-4 h-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="collection" className="data-[state=active]:bg-white/20">
            <PieChart className="w-4 h-4 mr-2" />
            Collection
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Progress Metrics */}
            <Card className="backdrop-blur-lg bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">📈 Progress Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Longest Streak</span>
                    <span className="text-white font-bold">{stats.longestStreak} days</span>
                  </div>
                  <Progress 
                    value={(stats.currentStreak / Math.max(stats.longestStreak, 1)) * 100} 
                    className="h-2 bg-white/10"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Journal Entries</span>
                    <span className="text-white font-bold">{stats.journalEntries}</span>
                  </div>
                  <Progress 
                    value={(stats.journalEntries / Math.max(stats.totalPulls, 1)) * 100} 
                    className="h-2 bg-white/10"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Challenges Completed</span>
                    <span className="text-white font-bold">{stats.challengesCompleted}</span>
                  </div>
                  <Progress 
                    value={Math.min((stats.challengesCompleted / 50) * 100, 100)} 
                    className="h-2 bg-white/10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* XP Breakdown */}
            <Card className="backdrop-blur-lg bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">⚡ XP Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {xpBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      <span className="text-gray-300 text-sm capitalize">{item.source}</span>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                      {item.amount.toLocaleString()} XP
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card className="backdrop-blur-lg bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">📅 30-Day Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timelineData.map((day, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs w-16">{day.date}</span>
                    <div className="flex-1">
                      <div className="flex gap-1">
                        {day.pulls > 0 && (
                          <div 
                            className="h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded"
                            style={{ width: `${Math.max(day.pulls * 30, 10)}px` }}
                            title={`${day.pulls} pull(s)`}
                          ></div>
                        )}
                        {day.xp > 0 && (
                          <div 
                            className="h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded"
                            style={{ width: `${Math.min(day.xp / 2, 100)}px` }}
                            title={`${day.xp} XP`}
                          ></div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs">
                      {day.pulls > 0 && (
                        <Badge className="bg-purple-500/20 text-purple-300">
                          {day.pulls} 🎴
                        </Badge>
                      )}
                      {day.xp > 0 && (
                        <Badge className="bg-yellow-500/20 text-yellow-300">
                          {day.xp} ⚡
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collection Tab */}
        <TabsContent value="collection" className="space-y-4">
          <Card className="backdrop-blur-lg bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">🎴 Collection Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{stats.totalPulls}</div>
                      <div className="text-sm text-gray-300">Total Cards</div>
                      <div className="text-xs text-gray-400 mt-1">Collected</div>
                    </div>
                  </div>
                  <div className="glass-card p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-400 mb-2">{stats.favoriteCards}</div>
                      <div className="text-sm text-gray-300">Favorites</div>
                      <div className="text-xs text-gray-400 mt-1">Starred</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Collection Progress</span>
                    <span className="text-white font-bold">{stats.totalPulls} / 365</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${Math.min((stats.totalPulls / 365) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    {365 - stats.totalPulls} cards remaining to complete your collection
                  </p>
                </div>

                <div className="glass-card p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-3">📊 Quick Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Unique Cards:</span>
                      <span className="text-white font-bold">{stats.totalPulls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current Streak:</span>
                      <span className="text-orange-400 font-bold">{stats.currentStreak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Journal Entries:</span>
                      <span className="text-blue-400 font-bold">{stats.journalEntries}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
