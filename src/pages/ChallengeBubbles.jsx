import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft, Play, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChallengeBubblesGame } from '../components/games/challenge-bubbles/ChallengeBubblesGame';
import { base44 } from '@/api/base44Client';
import BreathingExercise from '../components/games/BreathingExercise';
import AffirmingMessage from '../components/games/AffirmingMessage';
import GameLeaderboard from '../components/games/GameLeaderboard';
import SoundToggle from '../components/SoundToggle';
import { Trophy } from 'lucide-react';
import LastCompletedIndicator from '../components/LastCompletedIndicator';
import GameMasteryDisplay from '../components/games/GameMasteryDisplay';
import WeeklyChallengeCard from '../components/games/WeeklyChallengeCard';

export default function ChallengeBubbles() {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(180);
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (!currentUser) {
          console.error('No user authenticated');
          return;
        }
        setUser(currentUser);
        const userScores = await base44.entities.GameScore.filter({ 
          user_email: currentUser.email,
          game_type: 'challenge_bubbles'
        });
        setScores(userScores);
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (canvasRef.current && gameState === 'playing' && !gameRef.current) {
      gameRef.current = new ChallengeBubblesGame(canvasRef.current, {
        onScoreUpdate: setScore,
        onTimerUpdate: setTimer,
        onGameOver: handleGameOver
      });
      gameRef.current.start();
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.stop();
        gameRef.current = null;
      }
    };
  }, [gameState]);

  const handleGameOver = (finalScore) => {
    setShowAffirmation(true);
    saveProgress(finalScore);
  };

  const handleAffirmationContinue = () => {
    setShowAffirmation(false);
    setGameState('gameOver');
  };

  const saveProgress = async (finalScore) => {
    try {
      const user = await base44.auth.me();
      await base44.entities.GameScore.create({
        user_email: user.email,
        game_type: 'challenge_bubbles',
        score: finalScore,
        level_reached: 1,
        duration_seconds: 180 - timer
      });

      // Update game mastery
      const masteries = await base44.entities.GameMastery.filter({
        user_email: user.email,
        game_type: 'challenge_bubbles'
      });

      const xpGained = Math.floor(finalScore / 5);

      if (masteries.length > 0) {
        const mastery = masteries[0];
        const newXP = mastery.mastery_xp + xpGained;
        const newLevel = Math.floor(newXP / 200) + 1;
        
        await base44.entities.GameMastery.update(mastery.id, {
          mastery_xp: newXP,
          mastery_level: newLevel,
          total_plays: mastery.total_plays + 1,
          total_score: mastery.total_score + finalScore
        });
      } else {
        await base44.entities.GameMastery.create({
          user_email: user.email,
          game_type: 'challenge_bubbles',
          mastery_level: 1,
          mastery_xp: xpGained,
          total_plays: 1,
          total_score: finalScore
        });
      }
    } catch (error) {
      console.error('Failed to save game progress:', error);
    }
  };

  const startGame = () => {
    setScore(0);
    setTimer(180);
    setGameState('playing');
  };

  const backToMenu = () => {
    if (gameRef.current) {
      gameRef.current.stop();
    }
    setGameState('menu');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className={`${gameState === 'playing' ? 'block' : 'hidden'} fixed inset-0`}
        style={{ 
          touchAction: 'none',
          width: '100vw',
          height: '100vh',
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'block'
        }}
      />

      <AnimatePresence>
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 ensure-readable-strong font-heading">
                CHALLENGE BUBBLES
              </h1>
              <p className="text-xl ensure-readable">Match emotions, find clarity</p>
              {scores.length > 0 && scores[0].created_date && (
                <div className="mt-4">
                  <LastCompletedIndicator 
                    lastCompletedDate={scores[0].created_date}
                    label="Last played"
                  />
                </div>
              )}
            </motion.div>

            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 mb-6 max-w-sm mx-auto"
              >
                <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-blue-500/30">
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-xs text-blue-300 mb-1">High Score</p>
                      <p className="text-2xl font-bold text-white">
                        {scores.filter(s => s.game_type === 'challenge_bubbles').length > 0
                          ? Math.max(...scores.filter(s => s.game_type === 'challenge_bubbles').map(s => s.score))
                          : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 mb-1">Games Played</p>
                      <p className="text-2xl font-bold text-white">
                        {scores.filter(s => s.game_type === 'challenge_bubbles').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <GameMasteryDisplay userEmail={user.email} gameType="challenge_bubbles" />
              </motion.div>
            )}

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <motion.button
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={startGame}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all"
              >
                <Play className="w-6 h-6" />
                Start Game
              </motion.button>

              <motion.button
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/20 transition-all"
              >
                <Trophy className="w-6 h-6" />
                Leaderboard
              </motion.button>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to={createPageUrl('Games')}
                  className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md text-purple-300 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/10 transition-all"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back to Games
                </Link>
              </motion.div>
            </div>

            {showLeaderboard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-6"
              >
                <GameLeaderboard gameType="challenge_bubbles" />
                {user && <WeeklyChallengeCard userEmail={user.email} />}
              </motion.div>
            )}
          </motion.div>
        )}

        {gameState === 'gameOver' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20"
          >
            <motion.h2
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="text-5xl font-bold text-blue-400 mb-4"
            >
              GAME OVER
            </motion.h2>
            <p className="text-2xl text-white mb-12">Final Score: {score}</p>
            
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl"
              >
                Play Again
              </button>
              <button
                onClick={backToMenu}
                className="bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg"
              >
                Main Menu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {gameState === 'playing' && (
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
          <div className="flex justify-between items-start">
            <div className="bg-white/25 backdrop-blur-md rounded-2xl px-4 py-3 border border-blue-400/50 shadow-xl">
              <p className="text-xs mb-1 font-bold" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Score</p>
              <p className="text-2xl font-bold" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{score}</p>
            </div>

            <div className="pointer-events-auto">
              <SoundToggle />
            </div>

            <div className="bg-white/25 backdrop-blur-md rounded-2xl px-4 py-3 border border-blue-400/50 shadow-xl">
              <p className="text-xs mb-1 font-bold" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Time</p>
              <p className="text-2xl font-bold" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{formatTime(timer)}</p>
            </div>
          </div>
        </div>
      )}

      {showAffirmation && (
        <AffirmingMessage onContinue={handleAffirmationContinue} />
      )}
    </div>
  );
}