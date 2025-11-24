import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Trophy, Brain, Flame, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../../utils';

const games = [
  { type: 'chakra_blaster', name: 'Chakra Blaster', icon: Zap, color: 'from-purple-600 to-indigo-600' },
  { type: 'challenge_bubbles', name: 'Challenge Bubbles', icon: Trophy, color: 'from-indigo-600 to-blue-600' },
  { type: 'memory_match', name: 'Memory Match', icon: Brain, color: 'from-violet-600 to-purple-600' }
];

export default function DailyPracticeModal({ isOpen, onClose }) {
  const [selectedGames, setSelectedGames] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: todaySession } = useQuery({
    queryKey: ['todayPractice', user?.email],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const sessions = await base44.entities.DailyPracticeSession.filter({
        user_email: user?.email,
        practice_date: today
      });
      return sessions[0];
    },
    enabled: !!user && isOpen
  });

  const startSession = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Get previous sessions for streak calculation
      const allSessions = await base44.entities.DailyPracticeSession.filter({
        user_email: user.email
      });
      
      const sortedSessions = allSessions
        .filter(s => s.completed)
        .sort((a, b) => new Date(b.practice_date) - new Date(a.practice_date));
      
      let currentStreak = 0;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (sortedSessions.length > 0 && sortedSessions[0].practice_date === yesterdayStr) {
        currentStreak = sortedSessions[0].current_streak + 1;
      } else {
        currentStreak = 1;
      }

      return await base44.entities.DailyPracticeSession.create({
        user_email: user.email,
        practice_date: today,
        games_completed: selectedGames.map(g => ({
          game_type: g,
          score: 0,
          completed: false
        })),
        current_streak: currentStreak
      });
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ['todayPractice'] });
      // Navigate to first game
      const gamePageMap = {
        'chakra_blaster': 'ChakraBlasterMax',
        'challenge_bubbles': 'ChallengeBubbles',
        'memory_match': 'MemoryMatch'
      };
      navigate(createPageUrl(gamePageMap[selectedGames[0]]));
      onClose();
    }
  });

  const handleGameToggle = (gameType) => {
    if (selectedGames.includes(gameType)) {
      setSelectedGames(selectedGames.filter(g => g !== gameType));
    } else if (selectedGames.length < 3) {
      setSelectedGames([...selectedGames, gameType]);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="card-organic p-8 max-w-2xl w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold ensure-readable-strong flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-400" />
              Daily Practice
            </h2>
            {todaySession?.current_streak > 0 && (
              <p className="text-label mt-2 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                {todaySession.current_streak} Day Streak!
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-label hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {todaySession?.completed ? (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-400" />
            <h3 className="text-2xl font-bold ensure-readable-strong mb-2">
              Practice Complete!
            </h3>
            <p className="ensure-readable mb-4">
              You've completed today's practice. Come back tomorrow!
            </p>
            <p className="text-sm text-label">
              Total XP Earned: {todaySession.total_xp_earned + todaySession.bonus_xp}
              {todaySession.bonus_xp > 0 && ` (+${todaySession.bonus_xp} streak bonus)`}
            </p>
          </div>
        ) : (
          <>
            <p className="ensure-readable mb-6">
              Select up to 3 games for your daily practice session. Complete all to earn bonus XP!
            </p>

            <div className="grid gap-4 mb-6">
              {games.map((game) => {
                const Icon = game.icon;
                const isSelected = selectedGames.includes(game.type);
                
                return (
                  <motion.button
                    key={game.type}
                    onClick={() => handleGameToggle(game.type)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-bold ensure-readable">{game.name}</p>
                        <p className="text-sm text-label">Randomized challenge mode</p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm ensure-readable">
                <strong>Daily Bonus:</strong> Complete all selected games to earn +50% XP and maintain your streak!
              </p>
            </div>

            <Button
              onClick={() => startSession.mutate()}
              disabled={selectedGames.length === 0 || startSession.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-lg py-6"
            >
              Start Practice Session
            </Button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}