import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Flame, ChevronUp, ChevronDown } from 'lucide-react';

interface StreakLeaderboardRaceProps {
  username: string;
  currentStreak: number;
}

interface LeaderboardEntry {
  username: string;
  streak: number;
  rank: number;
  change: 'up' | 'down' | 'same';
}

export function StreakLeaderboardRace({ username, currentStreak }: StreakLeaderboardRaceProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPosition, setUserPosition] = useState<number>(0);
  const [nextTarget, setNextTarget] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [username, currentStreak]);

  const fetchLeaderboard = () => {
    // Generate mock leaderboard (in production, fetch from SpacetimeDB)
    const mockData: LeaderboardEntry[] = [
      { username: 'streakmaster', streak: 100, rank: 1, change: 'same' },
      { username: 'consistency_queen', streak: 87, rank: 2, change: 'up' },
      { username: 'daily_hero', streak: 75, rank: 3, change: 'down' },
      { username: 'practice_pro', streak: 65, rank: 4, change: 'up' },
      { username: 'vibe_champion', streak: 58, rank: 5, change: 'same' },
      { username: 'growth_seeker', streak: 52, rank: 6, change: 'up' },
      { username: 'mindful_one', streak: 45, rank: 7, change: 'same' },
      { username: 'zen_master', streak: 42, rank: 8, change: 'down' },
      { username: 'card_collector', streak: 38, rank: 9, change: 'up' },
      { username: 'affirmation_ace', streak: 35, rank: 10, change: 'same' },
    ];

    // Insert current user if not in top 10
    const userInTop10 = mockData.find(e => e.username === username);
    if (!userInTop10) {
      // Find where user would rank
      let rank = 11;
      for (let i = 0; i < mockData.length; i++) {
        if (currentStreak > mockData[i].streak) {
          rank = i + 1;
          break;
        }
      }
      
      mockData.splice(rank - 1, 0, {
        username,
        streak: currentStreak,
        rank,
        change: 'same',
      });
      
      // Re-rank everyone
      mockData.forEach((entry, index) => {
        entry.rank = index + 1;
      });
    }

    setLeaderboard(mockData.slice(0, 10));
    
    // Find user position
    const userEntry = mockData.find(e => e.username === username);
    if (userEntry) {
      setUserPosition(userEntry.rank);
      
      // Find next person to overtake
      if (userEntry.rank > 1) {
        const nextPerson = mockData.find(e => e.rank === userEntry.rank - 1);
        setNextTarget(nextPerson || null);
      } else {
        setNextTarget(null);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-2 border-yellow-400/30 bg-gradient-to-br from-orange-950/40 to-yellow-950/40">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Streak Leaderboard Race
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User's Position */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="p-4 rounded-lg bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-400/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-xs uppercase tracking-wider mb-1">Your Position</p>
              <p className="text-white font-bold text-3xl">#{userPosition}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs mb-1">Your Streak</p>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <p className="text-white font-bold text-2xl">{currentStreak}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Target */}
        {nextTarget && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-green-900/20 border border-green-400/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-xs uppercase tracking-wider mb-1">Next Target</p>
                <p className="text-white font-bold">@{nextTarget.username}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs mb-1">Gap</p>
                <p className="text-green-400 font-bold text-xl">
                  {nextTarget.streak - currentStreak} {nextTarget.streak - currentStreak === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-400/20">
              <p className="text-green-200 text-xs text-center">
                🎯 Keep your streak going to move up!
              </p>
            </div>
          </motion.div>
        )}

        {/* Top 10 Leaderboard */}
        <div className="space-y-2">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-3">Top Streaks</p>
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.username}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.username === username
                  ? 'bg-purple-900/40 border border-purple-400/50'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  entry.rank === 1 ? 'bg-yellow-400 text-black' :
                  entry.rank === 2 ? 'bg-gray-300 text-black' :
                  entry.rank === 3 ? 'bg-orange-400 text-black' :
                  'bg-white/10 text-white'
                }`}>
                  {entry.rank}
                </div>
                <div>
                  <p className={`font-semibold ${
                    entry.username === username ? 'text-purple-300' : 'text-white'
                  }`}>
                    @{entry.username}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-bold">{entry.streak}</span>
                </div>
                {entry.change === 'up' && <ChevronUp className="w-4 h-4 text-green-400" />}
                {entry.change === 'down' && <ChevronDown className="w-4 h-4 text-red-400" />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Motivation */}
        {userPosition > 10 && (
          <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-400/30 text-center">
            <p className="text-blue-200 text-sm">
              🚀 You're ranked #{userPosition}! Keep pulling to climb the leaderboard!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
