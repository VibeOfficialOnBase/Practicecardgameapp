import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Flame, BookOpen, Star } from 'lucide-react';
import { getUserPulls } from '@/utils/pullTracking';
import { getFavorites } from '@/utils/favoritesTracking';
import { getLevelInfo } from '@/utils/xpTracking';

interface StatsWidgetProps {
  username: string;
}

export function StatsWidget({ username }: StatsWidgetProps) {
  const [stats, setStats] = useState({
    totalPulls: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalFavorites: 0,
    totalJournals: 0,
    level: 1,
    xpProgress: 0,
  });

  useEffect(() => {
    if (!username) return;

    // Calculate total pulls
    const pulls = getUserPulls(username);
    const totalPulls = pulls.length;

    // Calculate current streak
    let currentStreak = 0;
    if (pulls.length > 0) {
      currentStreak = 1;
      for (let i = pulls.length - 1; i > 0; i--) {
        const current = new Date(pulls[i].date);
        const prev = new Date(pulls[i - 1].date);
        const diffTime = Math.abs(current.getTime() - prev.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    for (let i = 0; i < pulls.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const current = new Date(pulls[i].date);
        const prev = new Date(pulls[i - 1].date);
        const diffTime = Math.abs(current.getTime() - prev.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Get favorites
    const favorites = getFavorites(username);

    // Get journal entries
    const journalEntries = localStorage.getItem('practice_journal_entries');
    let totalJournals = 0;
    if (journalEntries) {
      try {
        const entries = JSON.parse(journalEntries);
        totalJournals = entries.filter((entry: { userId: string }) => entry.userId === username).length;
      } catch (error) {
        console.error('Error parsing journal entries:', error);
      }
    }

    // Get level info
    const levelInfo = getLevelInfo(username);

    setStats({
      totalPulls,
      currentStreak,
      longestStreak,
      totalFavorites: favorites.length,
      totalJournals,
      level: levelInfo.level,
      xpProgress: levelInfo.progressPercent,
    });
  }, [username]);

  const statCards = [
    {
      label: 'Cards Pulled',
      value: stats.totalPulls,
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak}d`,
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      color: 'from-orange-500 to-red-500',
    },
    {
      label: 'Longest Streak',
      value: `${stats.longestStreak}d`,
      icon: <Flame className="w-5 h-5 text-red-400" />,
      color: 'from-red-500 to-pink-500',
    },
    {
      label: 'Journal Entries',
      value: stats.totalJournals,
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      label: 'Favorites',
      value: stats.totalFavorites,
      icon: <Star className="w-5 h-5 text-pink-400" />,
      color: 'from-pink-500 to-purple-500',
    },
    {
      label: 'Level',
      value: stats.level,
      icon: <Trophy className="w-5 h-5 text-cyan-400" />,
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  return (
    <Card className="glass-card border-white/20 overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-3">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2" role="heading" aria-level={2}>
          <Trophy className="w-5 h-5 text-yellow-400" />
          Your PRACTICE Stats
        </CardTitle>
        <p className="text-xs text-purple-300 mt-1">Keep practicing to get LECHE! 🥛</p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-br ${stat.color} bg-opacity-10 rounded-lg p-5 backdrop-blur-sm border border-white/10`}
            >
              <div className="flex items-center justify-between mb-3">
                {stat.icon}
                <span className="text-3xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-sm text-white/90 font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* XP Progress bar */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>Level {stats.level}</span>
            <span>{Math.round(stats.xpProgress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
              initial={{ width: 0 }}
              animate={{ width: `${stats.xpProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
