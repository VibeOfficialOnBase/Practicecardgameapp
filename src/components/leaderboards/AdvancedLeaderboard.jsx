import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users, Calendar, Crown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, startOfWeek, startOfMonth } from 'date-fns';

export default function AdvancedLeaderboard({ gameType }) {
  const [timeframe, setTimeframe] = useState('all-time');

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: allScores = [] } = useQuery({
    queryKey: ['allGameScores', gameType],
    queryFn: () => base44.entities.GameScore.filter({ game_type: gameType })
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends', user?.email],
    queryFn: () => base44.entities.Friend.filter({ 
      user_email: user?.email,
      status: 'accepted'
    }),
    enabled: !!user
  });

  const friendEmails = friends.map(f => f.friend_email);

  const filterScoresByTimeframe = (scores) => {
    const now = new Date();
    switch (timeframe) {
      case 'weekly':
        const weekStart = startOfWeek(now);
        return scores.filter(s => new Date(s.created_date) >= weekStart);
      case 'monthly':
        const monthStart = startOfMonth(now);
        return scores.filter(s => new Date(s.created_date) >= monthStart);
      default:
        return scores;
    }
  };

  const getLeaderboard = (scores, friendsOnly = false) => {
    let filteredScores = filterScoresByTimeframe(scores);
    
    if (friendsOnly) {
      filteredScores = filteredScores.filter(s => 
        friendEmails.includes(s.user_email) || s.user_email === user?.email
      );
    }

    const userBestScores = {};
    filteredScores.forEach(score => {
      if (!userBestScores[score.user_email] || score.score > userBestScores[score.user_email].score) {
        userBestScores[score.user_email] = score;
      }
    });

    return Object.values(userBestScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const globalLeaderboard = getLeaderboard(allScores);
  const friendsLeaderboard = getLeaderboard(allScores, true);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />;
      case 2: return <Trophy className="w-5 h-5 text-gray-400 fill-gray-400" />;
      case 3: return <Trophy className="w-5 h-5 text-orange-600 fill-orange-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-label font-bold">{rank}</span>;
    }
  };

  const LeaderboardTable = ({ scores, showGlobal = true }) => (
    <div className="space-y-2">
      {scores.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-label" />
          <p className="text-label">No scores yet for this timeframe</p>
        </div>
      ) : (
        scores.map((score, index) => {
          const isCurrentUser = score.user_email === user?.email;
          return (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                isCurrentUser 
                  ? 'bg-purple-500/20 border border-purple-500/50' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="w-10 flex justify-center">
                {getRankIcon(index + 1)}
              </div>
              
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {score.user_email?.[0]?.toUpperCase() || '?'}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold ensure-readable ${isCurrentUser ? 'text-purple-200' : ''}`}>
                  {score.user_email?.split('@')[0] || 'Anonymous'}
                  {isCurrentUser && ' (You)'}
                </p>
                <p className="text-xs text-label">
                  {format(new Date(score.created_date), 'MMM d, yyyy')}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold ensure-readable-strong">{score.score}</p>
                {score.level_reached > 1 && (
                  <p className="text-xs text-label">Level {score.level_reached}</p>
                )}
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setTimeframe('all-time')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            timeframe === 'all-time'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              : 'bg-white/5 text-label hover:bg-white/10'
          }`}
        >
          <Trophy className="w-4 h-4 inline mr-2" />
          All Time
        </button>
        <button
          onClick={() => setTimeframe('monthly')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            timeframe === 'monthly'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              : 'bg-white/5 text-label hover:bg-white/10'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Monthly
        </button>
        <button
          onClick={() => setTimeframe('weekly')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            timeframe === 'weekly'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              : 'bg-white/5 text-label hover:bg-white/10'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Weekly
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global">
            <Trophy className="w-4 h-4 mr-2" />
            Global
          </TabsTrigger>
          <TabsTrigger value="friends">
            <Users className="w-4 h-4 mr-2" />
            Friends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-6">
          <LeaderboardTable scores={globalLeaderboard} />
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <LeaderboardTable scores={friendsLeaderboard} showGlobal={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
}