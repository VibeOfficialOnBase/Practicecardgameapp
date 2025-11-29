import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Zap, Trophy, Star, Sparkles, Brain, Puzzle, TrendingUp, Users, Calendar, Crown, Gamepad2, BarChart3, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../lib/supabase';
import { base44, appApi } from '@/api/supabaseClient';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Section from '../components/common/Section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, startOfWeek, startOfMonth } from 'date-fns';

export default function Games() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('all-time');
  const [selectedLeaderboardGame, setSelectedLeaderboardGame] = useState('all');

  // --- Fetch User Data (Stats logic moved here) ---
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

  // Fetch VibeAGotchi evolutions for achievements leaderboard
  const { data: allEvolutions = [] } = useQuery({
    queryKey: ['allVibeEvolutions'],
    queryFn: async () => {
        try {
            return await appApi.entities.VibeagotchiEvolution.list() || [];
        } catch (e) { return []; }
    }
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

  // --- Leaderboard Logic ---
  const gameTypes = [
    { id: 'all', name: 'All Games', icon: Trophy },
    { id: 'chakra_blaster', name: 'Chakra Blaster', icon: Gamepad2 },
    { id: 'memory_match', name: 'Memory Match', icon: Gamepad2 },
    { id: 'vibeagotchi_achievements', name: 'Vibe Achievements', icon: Sparkles } // New Vibe category
  ];

  const filterScoresByTimeframe = (scores) => {
    const now = new Date();
    switch (timeframe) {
      case 'weekly': {
        const weekStart = startOfWeek(now);
        return scores.filter(s => new Date(s.created_date || s.achieved_at) >= weekStart);
      }
      case 'monthly': {
        const monthStart = startOfMonth(now);
        return scores.filter(s => new Date(s.created_date || s.achieved_at) >= monthStart);
      }
      default:
        return scores;
    }
  };

  const getLeaderboard = (friendsOnly = false) => {
    let combinedScores = [];

    // Combine Game Scores
    if (selectedLeaderboardGame === 'all' || selectedLeaderboardGame !== 'vibeagotchi_achievements') {
         let filteredGameScores = allScores;
         if (selectedLeaderboardGame !== 'all') {
             filteredGameScores = filteredGameScores.filter(s => s.game_type === selectedLeaderboardGame);
         }
         combinedScores = [...combinedScores, ...filteredGameScores];
    }

    // Combine Vibe Achievements (treat evolution stage as score)
    if (selectedLeaderboardGame === 'all' || selectedLeaderboardGame === 'vibeagotchi_achievements') {
        const vibeScores = allEvolutions.map(evo => ({
            user_email: evo.user_email,
            score: (evo.evolution_stage + 1) * 1000, // Weighted score for evolution
            game_type: 'vibeagotchi_achievements',
            created_date: evo.achieved_at,
            level_reached: evo.evolution_stage
        }));
        combinedScores = [...combinedScores, ...vibeScores];
    }

    // Filter by Timeframe
    let filteredScores = filterScoresByTimeframe(combinedScores);

    // Filter by Friends
    if (friendsOnly) {
      filteredScores = filteredScores.filter(s =>
        friendEmails.includes(s.user_email) || s.user_email === user?.email
      );
    }

    // Deduplicate: Keep highest score per user per game type (or total if 'all')
    const userBestScores = {};
    filteredScores.forEach(score => {
        // If viewing 'all', we might want sum, but simpler to just show best single entry for now as per original logic
        // Or strictly per game type if we grouped.
        // Current logic: Show unique user entries? Or list of top scores?
        // Original logic was "userBestScores" keyed by email, implying 1 entry per user.
        // Let's keep 1 entry per user (their best score across whatever is selected).
      if (!userBestScores[score.user_email] || score.score > userBestScores[score.user_email].score) {
        userBestScores[score.user_email] = score;
      }
    });

    return Object.values(userBestScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  };

  const globalLeaderboard = getLeaderboard(false);
  const friendsLeaderboard = getLeaderboard(true);

  // --- Games List Logic ---
  const myChakraScores = allScores.filter(s => s.user_email === user?.email && s.game_type === 'chakra_blaster');
  const highScore = myChakraScores.length > 0
    ? Math.max(...myChakraScores.map(s => s.score))
    : 0;

  const gamesList = [
    {
        id: 'chakra_blaster',
        title: 'Chakra Blaster MAX',
        desc: 'Release emotional enemies with light',
        icon: Zap,
        path: 'ChakraBlasterMax',
        color: 'from-purple-600 to-indigo-600',
        tags: ['Action', 'Boss Battles', '20 Levels'],
        stats: { label: 'High Score', value: highScore }
    },
    {
        id: 'vibeagotchi',
        title: 'VibeAGotchi',
        desc: 'Nurture your spirit companion',
        icon: Sparkles,
        path: 'VibeAGotchi',
        color: 'from-pink-500 to-rose-500',
        tags: ['Virtual Pet', 'Evolution', 'Wellness'],
        isNew: true
    },
    {
        id: 'memory_match',
        title: 'Memory Match',
        desc: 'Match affirmations, train your mind',
        icon: Brain,
        path: 'MemoryMatch',
        color: 'from-violet-500 to-purple-500',
        tags: ['Memory', 'Focus', 'Brain Training']
    }
  ];

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
                    <span className="capitalize">
                        {score.game_type === 'vibeagotchi_achievements' ? 'Vibe Evolution' : score.game_type?.replace('_', ' ') || 'Unknown'}
                    </span>
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
                  {score.level_reached !== undefined && (
                    <p className="text-xs text-[var(--text-secondary)]">
                        {score.game_type === 'vibeagotchi_achievements' ? `Stage ${score.level_reached}` : `Level ${score.level_reached}`}
                    </p>
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
        title="Arcade"
        subtitle="Playful practice for your mind"
      />

      <div className="grid gap-6">
        {gamesList.map((game, index) => {
            const Icon = game.icon;
            return (
                <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link to={createPageUrl(game.path)}>
                        <Card className="p-0 overflow-hidden group card-hover relative border-0">
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

                            <div className="p-6 relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                                {game.title}
                                            </h3>
                                            <p className="text-sm text-[var(--text-secondary)]">{game.desc}</p>
                                        </div>
                                    </div>
                                    {game.isNew && (
                                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-lg animate-pulse">
                                            NEW
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex gap-2">
                                        {game.tags.map(tag => (
                                            <span key={tag} className="px-2.5 py-1 rounded-md bg-[var(--bg-secondary)]/50 border border-black/5 dark:border-white/5 text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {game.stats && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)]">
                                            <Trophy className="w-3 h-3" />
                                            {game.stats.label}: {game.stats.value}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Link>
                </motion.div>
            );
        })}
      </div>

      <Section title="Leaderboards">
        <Card className="p-4 sm:p-6">
            {/* Game Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 sm:px-0 scrollbar-hide mb-4">
            {gameTypes.map((game) => {
                const Icon = game.icon;
                return (
                <button
                    key={game.id}
                    onClick={() => setSelectedLeaderboardGame(game.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedLeaderboardGame === game.id
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
            <div className="flex gap-2 justify-center mb-6">
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
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm sm:text-base ${
                    timeframe === tf.id
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    {tf.label}
                </button>
                );
            })}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="global" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Global
                </TabsTrigger>
                <TabsTrigger value="friends" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Friends
                </TabsTrigger>
            </TabsList>

            <TabsContent value="global">
                <LeaderboardTable scores={globalLeaderboard} />
            </TabsContent>

            <TabsContent value="friends">
                {user ? (
                <LeaderboardTable scores={friendsLeaderboard} />
                ) : (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-[var(--text-secondary)] opacity-50" />
                    <p className="text-[var(--text-secondary)] text-lg">Sign in to see friends leaderboard</p>
                </div>
                )}
            </TabsContent>
            </Tabs>
        </Card>
      </Section>
    </div>
  );
}
