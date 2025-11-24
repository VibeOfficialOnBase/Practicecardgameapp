import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Zap, Trophy, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

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
  const maxLevel = chakraBlasterScores.length > 0
    ? Math.max(...chakraBlasterScores.map(s => s.level_reached))
    : 1;

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-2 text-center ensure-readable-strong">Spiritual Games</h1>
        <p className="text-center mb-12 ensure-readable">
          Transform emotional challenges into playful practice
        </p>

        <div className="grid gap-6 max-w-full">
          {/* Chakra Blaster MAX */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-organic p-4 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold ensure-readable-strong">Chakra Blaster MAX</h2>
                    <p className="text-xs sm:text-sm ensure-readable">Release emotional enemies with light</p>
                  </div>
                </div>
                <Link
                  to={createPageUrl('ChakraBlasterMax')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold hover:shadow-2xl transition-all text-sm sm:text-base whitespace-nowrap"
                >
                  Play Now
                </Link>
              </div>

              <div className="flex gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-xs text-label">High Score</p>
                    <p className="text-lg font-bold ensure-readable">{highScore}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 ensure-readable" />
                  <div>
                    <p className="text-xs text-label">Max Level</p>
                    <p className="text-lg font-bold ensure-readable">{maxLevel}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="bg-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  20 Levels
                </span>
                <span className="bg-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Boss Battles
                </span>
                <span className="bg-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Affirmations
                </span>
                <span className="bg-violet-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Mobile Friendly
                </span>
              </div>
            </div>
          </motion.div>

          {/* Challenge Bubbles */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-organic p-4 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl sm:text-3xl">🫧</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold ensure-readable-strong">Challenge Bubbles</h2>
                    <p className="text-xs sm:text-sm ensure-readable">Match emotions and find clarity</p>
                  </div>
                </div>
                <Link
                  to={createPageUrl('ChallengeBubbles')}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold hover:shadow-2xl transition-all text-sm sm:text-base whitespace-nowrap"
                >
                  Play Now
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="bg-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Puzzle
                </span>
                <span className="bg-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Match 3
                </span>
                <span className="bg-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Affirmations
                </span>
                <span className="bg-violet-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Relaxing
                </span>
              </div>
            </div>
          </motion.div>

          {/* Memory Match */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-organic p-4 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl sm:text-3xl">🧠</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold ensure-readable-strong">Memory Match</h2>
                    <p className="text-xs sm:text-sm ensure-readable">Match affirmations, train your mind</p>
                  </div>
                </div>
                <Link
                  to={createPageUrl('MemoryMatch')}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold hover:shadow-2xl transition-all text-sm sm:text-base whitespace-nowrap"
                >
                  Play Now
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="bg-violet-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Memory
                </span>
                <span className="bg-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Affirmations
                </span>
                <span className="bg-pink-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Brain Training
                </span>
                <span className="bg-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Relaxing
                </span>
              </div>
            </div>
          </motion.div>

          {/* VibeAGotchi */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-organic p-4 sm:p-8 relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold ensure-readable-strong">VibeAGotchi</h2>
                    <p className="text-xs sm:text-sm ensure-readable">Nurture your spirit companion</p>
                  </div>
                </div>
                <Link
                  to={createPageUrl('VibeAGotchi')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold hover:shadow-2xl transition-all text-sm sm:text-base whitespace-nowrap"
                >
                  Play Now
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="bg-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  NEW
                </span>
                <span className="bg-pink-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Virtual Pet
                </span>
                <span className="bg-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Evolution
                </span>
                <span className="bg-violet-500/30 px-3 py-1 rounded-full text-xs font-semibold" style={{ color: '#1a0633' }}>
                  Wellness
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}