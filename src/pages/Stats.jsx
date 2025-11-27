import { useState } from 'react';
import { Trophy, TrendingUp, Users, Calendar, Crown, Gamepad2, BarChart3, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../lib/supabase';
import { appApi } from '@/api/supabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, startOfWeek, startOfMonth } from 'date-fns';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Section from '../components/common/Section';

export default function Stats() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('all-time');
  const [selectedGame, setSelectedGame] = useState('all');

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => getUserProfile(user?.email || user?.id),
    enabled: !!user,
  });

  const { data: allScores = [] } = useQuery({
    queryKey: ['allGameScores'],
    queryFn: async () => {
      try {
        const scores = await appApi.entities.GameScore.list();
        return scores || [];
      } catch (error) {
        console.error('Failed to fetch scores:', error);
        return [];
      }
    }
  });

  const { data: practices = [] } = useQuery({
    queryKey: ['practices', user?.email],
    queryFn: () => appApi.entities.DailyPractice.filter({ created_by: user?.email }),
    enabled: !!user,
  });

  const { data: friends = [] } = useQuery({
    queryKey: ['friends', user?.email],
    queryFn: () => appApi.entities.Friend.filter({ 
      user_email: user?.email,
      status: 'accepted'
    }),
    enabled: !!user
  });

  const friendEmails = friends.map(f => f.friend_email);

  // Personal Stats
  const personalStats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: userProfile?.current_streak || 0,
      suffix: 'days',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Trophy,
      label: 'Longest Streak',
      value: userProfile?.longest_streak || 0,
      suffix: 'days',
      color: 'from-amber-400 to-orange-500'
    },
    {
      icon: Target,
      label: 'Total Practices',
      value: practices.length,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart3,
      label: 'Avg Rating',
      value: practices.length > 0 
        ? (practices.reduce((sum, p) => sum + (p.rating || 0), 0) / practices.length).toFixed(1)
        : 0,
      suffix: '/ 5',
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  const gameTypes = [
    { id: 'all', name: 'All Games', icon: Trophy },
    { id: 'chakra_blaster', name: 'Chakra Blaster', icon: Gamepad2 },
    { id: 'memory_match', name: 'Memory Match', icon: Gamepad2 },
    { id: 'challenge_bubbles', name: 'Challenge Bubbles', icon: Gamepad2 }
  ];

  const filterScoresByTimeframe = (scores) => {
    const now = new Date();
    switch (timeframe) {
      case 'weekly': {
        const weekStart = startOfWeek(now);
        return scores.filter(s => new Date(s.created_date) >= weekStart);
      }
      case 'monthly': {
        const monthStart = startOfMonth(now);
        return scores.filter(s => new Date(s.created_date) >= monthStart);
      }
      default:
        return scores;
    }
  };

  const filterScoresByGame = (scores) => {
    if (selectedGame === 'all') return scores;
    return scores.filter(s => s.game_type === selectedGame);
  };

  const getLeaderboard = (scores, friendsOnly = false) => {
    let filteredScores = filterScoresByTimeframe(scores);
    filteredScores = filterScoresByGame(filteredScores);
    
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
      .slice(0, 20);
  };

  const globalLeaderboard = getLeaderboard(allScores);
  const friendsLeaderboard = getLeaderboard(allScores, true);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />;
      case 2: return <Trophy className="w-6 h-6 text-gray-400 fill-gray-400" />;
      case 3: return <Trophy className="w-6 h-6 text-orange-600 fill-orange-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)] font-bold">{rank}</span>;
    }
  };

  const LeaderboardTable = ({ scores }) => (
    <div className="space-y-3">
      {scores.length === 0 ? (
        <Card className="text-center py-12">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-[var(--text-secondary)] opacity-50" />
          <p className="text-[var(--text-secondary)] text-lg">No scores yet for this timeframe</p>
          <p className="text-[var(--text-secondary)] text-sm mt-2">Be the first to set a record!</p>
        </Card>
      ) : (
        scores.map((score, index) => {
          const isCurrentUser = score.user_email === user?.email;
          return (
            <motion.div
              key={score.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`flex items-center gap-4 p-4 ${
                isCurrentUser 
                  ? 'border-2 border-[var(--accent-primary)] bg-[var(--accent-primary)]/10' 
                  : ''
              }`}>
                <div className="w-10 flex justify-center">
                  {getRankIcon(index + 1)}
                </div>
                
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {score.user_email?.[0]?.toUpperCase() || '?'}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-[var(--text-primary)] ${isCurrentUser ? 'text-[var(--accent-primary)]' : ''}`}>
                    {score.user_email?.split('@')[0] || 'Anonymous'}
                    {isCurrentUser && ' (You)'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="capitalize">{score.game_type?.replace('_', ' ') || 'Unknown'}</span>
                    {score.created_date && (
                      <>
                        <span>•</span>
                        <span>{format(new Date(score.created_date), 'MMM d, yyyy')}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{score.score}</p>
                  {score.level_reached > 1 && (
                    <p className="text-xs text-[var(--text-secondary)]">Level {score.level_reached}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })
      )}
    </div>
  );

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <PageHeader
        title="Stats & Leaderboards"
        subtitle="Track your progress and compete"
      />

      {/* Personal Stats Grid */}
      <Section title="Your Stats">
        <div className="grid grid-cols-2 gap-3">
          {personalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-4 bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                  <Icon className="w-6 h-6 text-white mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                    {stat.suffix && <span className="text-sm opacity-70 ml-1">{stat.suffix}</span>}
                  </div>
                  <div className="text-xs text-white/70 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Game Leaderboards */}
      <Section title="Game Leaderboards">
        {/* Game Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide mb-4">
          {gameTypes.map((game) => {
            const Icon = game.icon;
            return (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedGame === game.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {game.name}
              </button>
            );
          })}
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2 justify-center mb-4">
          {[
            { id: 'all-time', label: 'All Time', icon: Trophy },
            { id: 'monthly', label: 'Monthly', icon: Calendar },
            { id: 'weekly', label: 'Weekly', icon: TrendingUp }
          ].map((tf) => {
            const Icon = tf.icon;
            return (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  timeframe === tf.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tf.label}
              </button>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Global
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Friends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-4">
            <LeaderboardTable scores={globalLeaderboard} />
          </TabsContent>

          <TabsContent value="friends" className="mt-4">
            {user ? (
              <LeaderboardTable scores={friendsLeaderboard} />
            ) : (
              <Card className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-[var(--text-secondary)] opacity-50" />
                <p className="text-[var(--text-secondary)] text-lg">Sign in to see friends leaderboard</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </Section>
    </div>
  );
}
