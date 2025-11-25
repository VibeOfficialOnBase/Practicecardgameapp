import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Zap, Trophy, Star, Sparkles, Brain, Puzzle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';

export default function Games() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: scores = [] } = useQuery({
    queryKey: ['gameScores', user?.email],
    queryFn: () => base44.entities.GameScore.filter({ user_email: user?.email }),
    enabled: !!user
  });

  const chakraBlasterScores = scores.filter(s => s.game_type === 'chakra_blaster');
  const highScore = chakraBlasterScores.length > 0 
    ? Math.max(...chakraBlasterScores.map(s => s.score))
    : 0;

  const games = [
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
        id: 'challenge_bubbles',
        title: 'Challenge Bubbles',
        desc: 'Match emotions and find clarity',
        icon: Puzzle,
        path: 'ChallengeBubbles',
        color: 'from-blue-500 to-cyan-500',
        tags: ['Puzzle', 'Match 3', 'Relaxing']
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

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <PageHeader
        title="Arcade"
        subtitle="Playful practice for your mind"
      />

      <div className="grid gap-6">
        {games.map((game, index) => {
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
    </div>
  );
}
