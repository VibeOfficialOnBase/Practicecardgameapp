import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft, Play, Trophy, Info, Settings, Gift, Home, Pause, RotateCcw, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChakraBlasterGame } from '../components/games/chakra-blaster/GameEngine';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import UpgradeMenu from '../components/games/chakra-blaster/UpgradeMenu';
import { upgradeManager } from '../components/games/chakra-blaster/UpgradeManager';
import { achievementTracker, ACHIEVEMENTS } from '../components/games/chakra-blaster/AchievementSystem';
import DailyRewardsModal from '../components/DailyRewardsModal';
import ChakraBlasterHowToPlay from '../components/games/chakra-blaster/HowToPlayModal';
import BreathingExercise from '../components/games/BreathingExercise';
import AffirmingMessage from '../components/games/AffirmingMessage';
import GameLeaderboard from '../components/games/GameLeaderboard';
import SoundToggle from '../components/SoundToggle';
import GameModeSelector from '../components/games/GameModeSelector';
import LastCompletedIndicator from '../components/LastCompletedIndicator';
import GameMasteryDisplay from '../components/games/GameMasteryDisplay';
import WeeklyChallengeCard from '../components/games/WeeklyChallengeCard';

export default function ChakraBlasterMax() {
  const canvasRef = useRef(null);
  const playerRef = useRef(null);
  const gameRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(3);
  const [playerMaxHealth, setPlayerMaxHealth] = useState(3);
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [user, setUser] = useState(null);
  const [maxLevel, setMaxLevel] = useState(1);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (!currentUser) return;
        setUser(currentUser);
        
        const userScores = await base44.entities.GameScore.filter({ 
          user_email: currentUser.email, 
          game_type: 'chakra_blaster' 
        });
        
        if (userScores.length > 0) {
          const maxScore = Math.max(...userScores.map(s => s.score));
          const maxLvl = Math.max(...userScores.map(s => s.level_reached));
          setHighScore(maxScore);
          setMaxLevel(maxLvl);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    loadUser();
  }, []);

  // Premium Perks (simplified)
  const getPremiumPerks = () => ({
      scoreMultiplier: 1,
      fireRateBonus: 0,
      extraLives: 0,
      blastStrength: 1,
      xpMultiplier: 1
  });

  // Game Initialization
  useEffect(() => {
    if (canvasRef.current && gameState === 'playing' && !gameRef.current) {
      const upgradeStats = upgradeManager.getAllUpgradeStats();
      const premiumPerks = getPremiumPerks();
      
      gameRef.current = new ChakraBlasterGame(canvasRef.current, {
        level: currentLevel,
        upgrades: {
          ...upgradeStats,
          extraLives: (upgradeStats.extraLives || 0) + premiumPerks.extraLives,
          fireRate: (upgradeStats.fireRate || 0) * (1 + premiumPerks.fireRateBonus)
        },
        premiumPerks: premiumPerks,
        onLevelComplete: handleLevelComplete,
        onGameOver: handleGameOver,
        onScoreUpdate: (baseScore) => {
          const finalScore = Math.floor(baseScore * premiumPerks.scoreMultiplier);
          setScore(finalScore);
        },
        onCoinsUpdate: (newCoins) => {
          upgradeManager.addCoins(newCoins);
          setCoins(upgradeManager.getCoins());
        },
        onHealthUpdate: (health, maxHealth) => {
          setPlayerHealth(health);
          setPlayerMaxHealth(maxHealth);
        },
        onAchievementUnlock: (achievements) => {
          setUnlockedAchievements(achievements);
          setTimeout(() => setUnlockedAchievements([]), 3000);
        }
      });

      if (playerRef.current) {
          gameRef.current.setPlayerElement(playerRef.current);
      }

      gameRef.current.start();
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.stop();
        gameRef.current = null;
      }
    };
  }, [gameState, currentLevel]);

  // Handlers
  const handleLevelComplete = () => {
    if (currentLevel % 5 === 0) setShowBreathing(true);
    else setGameState('levelComplete');
    saveProgress();
  };

  const handleGameOver = (finalScore) => {
    setShowAffirmation(true);
    if (finalScore > highScore) setHighScore(finalScore);
    saveProgress();
  };

  const saveProgress = async () => {
    if (!user) return;
    try {
      await base44.entities.GameScore.create({
        user_email: user.email,
        game_type: 'chakra_blaster',
        score: score,
        level_reached: currentLevel,
        duration_seconds: Math.floor(Date.now() / 1000)
      });
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const startGame = () => {
    setScore(0);
    setCoins(upgradeManager.getCoins());
    setGameState('playing');
  };

  const nextLevel = () => {
    if (gameRef.current) { gameRef.current.stop(); gameRef.current = null; }
    setCurrentLevel(prev => prev + 1);
    setGameState('playing');
  };

  const retryLevel = () => {
    if (gameRef.current) { gameRef.current.stop(); gameRef.current = null; }
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden touch-none select-none">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black opacity-80" />

      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${gameState === 'playing' ? 'block' : 'hidden'}`}
      />

      {/* Player DOM Layer */}
      <div
        ref={playerRef}
        className={`fixed z-10 w-10 h-10 top-0 left-0 pointer-events-none will-change-transform ${gameState === 'playing' ? 'block' : 'hidden'}`}
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div className="w-full h-full rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] border-2 border-white" />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col">

        {/* HUD */}
        {gameState === 'playing' && (
          <div className="safe-area-top pt-4 px-4 flex justify-between items-start w-full">
            <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 pointer-events-auto">
              <p className="text-[10px] text-purple-300 uppercase font-bold">Level {currentLevel}</p>
              <p className="text-2xl font-bold text-white leading-none">{score}</p>
            </div>

            <button
                onClick={() => { gameRef.current?.pause(); setGameState('paused'); }}
                className="p-3 rounded-full bg-black/40 border border-white/10 backdrop-blur-md pointer-events-auto"
            >
                <Pause className="w-6 h-6 text-white" />
            </button>
          </div>
        )}

        {/* Bottom HUD (Health) */}
        {gameState === 'playing' && (
            <div className="mt-auto safe-area-bottom pb-8 px-8 flex justify-center">
                <div className="w-full max-w-xs bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10">
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
                            style={{ width: `${(playerHealth / playerMaxHealth) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Menus & Modals (Pointer Events Auto) */}
        <AnimatePresence>
          {gameState === 'menu' && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 pointer-events-auto"
            >
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-400 mb-2 text-center">CHAKRA<br/>BLASTER</h1>
                <p className="text-purple-300 mb-8 font-mono text-sm">MAXIMUM RESONANCE</p>

                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button onClick={startGame} className="btn-primary py-4 text-lg w-full">
                        <Play className="w-5 h-5 fill-current" /> Start Mission
                    </button>
                    <button onClick={() => setShowUpgradeMenu(true)} className="btn-secondary py-4 w-full">
                        <Trophy className="w-5 h-5" /> Upgrades
                    </button>
                    <Link to={createPageUrl('Games')} className="btn-ghost w-full flex items-center justify-center gap-2 text-white/50">
                        <ArrowLeft className="w-4 h-4" /> Exit Game
                    </Link>
                </div>
            </motion.div>
          )}

          {gameState === 'paused' && (
             <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 pointer-events-auto"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             >
                <h2 className="text-3xl font-bold text-white">PAUSED</h2>
                <button onClick={() => { gameRef.current?.resume(); setGameState('playing'); }} className="btn-primary w-48">Resume</button>
                <button onClick={() => setGameState('menu')} className="btn-secondary w-48">Quit</button>
             </motion.div>
          )}

          {gameState === 'levelComplete' && (
             <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6 pointer-events-auto"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             >
                <h2 className="text-4xl font-bold text-green-400">CLEARED!</h2>
                <div className="text-center">
                    <p className="text-sm text-white/50">SCORE</p>
                    <p className="text-3xl font-bold text-white">{score}</p>
                </div>
                <button onClick={nextLevel} className="btn-primary w-64 py-4 text-lg">Next Sector</button>
             </motion.div>
          )}

          {gameState === 'gameOver' && (
             <motion.div
                className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 pointer-events-auto"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             >
                <h2 className="text-4xl font-bold text-red-500">GAME OVER</h2>
                <div className="text-center">
                    <p className="text-sm text-white/50">FINAL SCORE</p>
                    <p className="text-4xl font-bold text-white">{score}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={retryLevel} className="btn-primary w-32"><RotateCcw className="w-5 h-5" /></button>
                    <button onClick={() => setGameState('menu')} className="btn-secondary w-32"><Menu className="w-5 h-5" /></button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Breathing / Affirmation Overlays */}
        {showBreathing && <div className="pointer-events-auto absolute inset-0 z-50"><BreathingExercise onComplete={() => { setShowBreathing(false); setGameState('levelComplete'); }} /></div>}
        {showAffirmation && <div className="pointer-events-auto absolute inset-0 z-50"><AffirmingMessage onContinue={() => { setShowAffirmation(false); setGameState('gameOver'); }} /></div>}

        {/* Upgrade Menu Modal */}
        <UpgradeMenu isOpen={showUpgradeMenu} onClose={() => setShowUpgradeMenu(false)} onPurchase={() => setCoins(upgradeManager.getCoins())} />
      </div>
    </div>
  );
}
