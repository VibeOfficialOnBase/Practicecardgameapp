import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft, Play, Trophy, Pause, RotateCcw, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChallengeBubblesGame } from '../components/games/challenge-bubbles/ChallengeBubblesGame';
import { base44 } from '@/api/base44Client';
import TutorialModal from '../components/games/TutorialModal';
import BreathingExercise from '../components/games/BreathingExercise';
import AffirmingMessage from '../components/games/AffirmingMessage';
import GameLeaderboard from '../components/games/GameLeaderboard';
import LastCompletedIndicator from '../components/LastCompletedIndicator';
import GameMasteryDisplay from '../components/games/GameMasteryDisplay';
import WeeklyChallengeCard from '../components/games/WeeklyChallengeCard';

export default function ChallengeBubbles() {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timer, setTimer] = useState(180);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (!currentUser) return;
        setUser(currentUser);
        
        const userScores = await base44.entities.GameScore.filter({ 
          user_email: currentUser.email, 
          game_type: 'challenge_bubbles' 
        });
        setScores(userScores);
        
        if (userScores.length > 0) {
          const maxScore = Math.max(...userScores.map(s => s.score));
          setHighScore(maxScore);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    loadUser();
  }, []);

  const saveProgress = useCallback(async (finalScore) => {
    if (!user) return;
    try {
      await base44.entities.GameScore.create({
        user_email: user.email,
        game_type: 'challenge_bubbles',
        score: finalScore,
        level_reached: 1,
        duration_seconds: 180 - timer
      });

      // Update mastery
      const masteries = await base44.entities.GameMastery.filter({
        user_email: user.email,
        game_type: 'challenge_bubbles'
      });

      const xpGained = finalScore / 5;

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
      console.error('Failed to save progress:', error);
    }
  }, [user, timer]);

  const handleGameOver = useCallback(async (finalScore) => {
    setShowAffirmation(true);
    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
    await saveProgress(finalScore);
  }, [highScore, saveProgress]);

  useEffect(() => {
    if (canvasRef.current && gameState === 'playing' && !gameRef.current) {
      gameRef.current = new ChallengeBubblesGame(canvasRef.current, {
        onScoreUpdate: (newScore) => setScore(newScore),
        onTimerUpdate: (newTimer) => setTimer(newTimer),
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
  }, [gameState, handleGameOver]);

  const startGame = () => {
    setScore(0);
    setTimer(180);
    setGameState('playing');
  };

  const retryGame = () => {
    if (gameRef.current) {
      gameRef.current.stop();
      gameRef.current = null;
    }
    setScore(0);
    setTimer(180);
    setGameState('playing');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden touch-none select-none">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 via-indigo-900 to-black opacity-80" />

      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${gameState === 'playing' ? 'block' : 'hidden'}`}
      />

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col">

        {/* HUD */}
        {gameState === 'playing' && (
          <div className="safe-area-top pt-4 px-4 flex justify-between items-start w-full">
            <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 pointer-events-auto">
              <p className="text-[10px] text-purple-300 uppercase font-bold">Score</p>
              <p className="text-2xl font-bold text-white leading-none">{score}</p>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 pointer-events-auto">
              <p className="text-[10px] text-purple-300 uppercase font-bold">Time</p>
              <p className="text-2xl font-bold text-white leading-none">{formatTime(timer)}</p>
            </div>

            <button
              onClick={() => { gameRef.current?.stop(); setGameState('paused'); }}
              className="p-3 rounded-full bg-black/40 border border-white/10 backdrop-blur-md pointer-events-auto"
            >
              <Pause className="w-6 h-6 text-white" />
            </button>
          </div>
        )}

        {/* Menus & Modals */}
        <AnimatePresence>
          {gameState === 'menu' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 pointer-events-auto overflow-y-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-400 mb-2 text-center">CHALLENGE<br/>BUBBLES</h1>
              <p className="text-purple-300 mb-4 font-mono text-sm">Pop emotions, release affirmations</p>

              {scores.length > 0 && scores[0]?.created_date && (
                <div className="mb-4">
                  <LastCompletedIndicator 
                    lastCompletedDate={scores[0].created_date}
                    label="Last played"
                  />
                </div>
              )}

              {user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 mb-6 w-full max-w-sm"
                >
                  <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
                    <div className="flex justify-around text-center">
                      <div>
                        <p className="text-xs text-purple-300 mb-1">High Score</p>
                        <p className="text-2xl font-bold text-white">{highScore}</p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-300 mb-1">Games Played</p>
                        <p className="text-2xl font-bold text-white">{scores.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <GameMasteryDisplay userEmail={user.email} gameType="challenge_bubbles" />
                </motion.div>
              )}

              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button onClick={startGame} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2">
                  <Play className="w-5 h-5 fill-current" /> Start Game
                </button>

                <button
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  className="w-full bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                >
                  <Trophy className="w-6 h-6" />
                  Leaderboard
                </button>

                <button
                  onClick={() => setShowTutorial(true)}
                  className="w-full bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/20 transition-all"
                >
                  How to Play
                </button>

                <Link
                  to={createPageUrl('Games')}
                  className="w-full bg-white/5 backdrop-blur-md text-purple-300 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back to Games
                </Link>
              </div>

              {showLeaderboard && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 space-y-6 w-full max-w-md"
                >
                  <GameLeaderboard gameType="challenge_bubbles" />
                  {user && <WeeklyChallengeCard userEmail={user.email} />}
                </motion.div>
              )}
            </motion.div>
          )}

          {gameState === 'paused' && (
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-3xl font-bold text-white">PAUSED</h2>
              <button
                onClick={() => {
                  if (gameRef.current) {
                    gameRef.current = null;
                  }
                  setGameState('playing');
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold"
              >
                Resume
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold"
              >
                Quit
              </button>
            </motion.div>
          )}

          {gameState === 'gameOver' && (
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-4xl font-bold text-red-500">GAME OVER</h2>
              <div className="text-center">
                <p className="text-sm text-white/50">FINAL SCORE</p>
                <p className="text-4xl font-bold text-white">{score}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={retryGame} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" /> Retry
                </button>
                <button onClick={() => setGameState('menu')} className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                  <Menu className="w-5 h-5" /> Menu
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breathing / Affirmation Overlays */}
        {showBreathing && (
          <div className="pointer-events-auto absolute inset-0 z-50">
            <BreathingExercise onComplete={() => setShowBreathing(false)} />
          </div>
        )}
        {showAffirmation && (
          <div className="pointer-events-auto absolute inset-0 z-50">
            <AffirmingMessage onContinue={() => {
              setShowAffirmation(false);
              setGameState('gameOver');
            }} />
          </div>
        )}
      </div>

      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} title="How to Play">
        <div className="space-y-4">
          <section>
            <h3 className="text-xl font-bold mb-2">Objective</h3>
            <p>Pop emotional bubbles by matching 3 or more of the same type. Release positive affirmations!</p>
          </section>
          <section>
            <h3 className="text-xl font-bold mb-2">How to Play</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Aim by moving your mouse or finger</li>
              <li>Click or tap to shoot a bubble</li>
              <li>Match 3 or more bubbles of the same emotion</li>
              <li>Watch the affirmations appear!</li>
            </ul>
          </section>
          <section>
            <h3 className="text-xl font-bold mb-2">Bubble Types</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>🔥 Anger - &quot;I release anger with love&quot;</li>
              <li>💧 Regret - &quot;I learn and grow from the past&quot;</li>
              <li>👻 Fear - &quot;I am brave and strong&quot;</li>
              <li>⚡ Anxiety - &quot;I breathe in calm&quot;</li>
              <li>💙 Sadness - &quot;Joy returns to me&quot;</li>
              <li>💔 Self-Doubt - &quot;I believe in myself&quot;</li>
              <li>🌀 Overthinking - &quot;My mind is clear and focused&quot;</li>
            </ul>
          </section>
        </div>
      </TutorialModal>
    </div>
  );
}
