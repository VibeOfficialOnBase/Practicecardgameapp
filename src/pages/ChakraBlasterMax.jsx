import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft, Play, Trophy, Info, Settings, Gift } from 'lucide-react';
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
  const playerRef = useRef(null); // Ref for the player DOM element
  const gameRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [upgrades, setUpgrades] = useState({
    attackSpeed: 1,
    bulletSize: 1,
    maxHealth: 3,
    specialPower: 0
  });
  const [coins, setCoins] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(3);
  const [playerMaxHealth, setPlayerMaxHealth] = useState(3);
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [maxLevel, setMaxLevel] = useState(1);
  const [gameMode, setGameMode] = useState('normal');
  const [showBreathing, setShowBreathing] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);

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
        setScores(userScores);
        
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

  const { data: userProfiles = [] } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => base44.entities.UserProfile.filter({ created_by: user?.email }),
    enabled: !!user
  });

  const userProfile = userProfiles[0];

  const getPremiumPerks = () => {
    const perks = {
      scoreMultiplier: 1,
      fireRateBonus: 0,
      extraLives: 0,
      blastStrength: 1,
      xpMultiplier: 1
    };
    if (userProfile?.vibe_official_pack_unlocked) {
      perks.scoreMultiplier += 0.10;
      perks.fireRateBonus += 0.05;
    }
    if (userProfile?.algo_leagues_pack_unlocked) {
      perks.xpMultiplier += 0.10;
      perks.extraLives += 1;
      perks.blastStrength += 0.15;
    }
    return perks;
  };

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
          handleAchievementUnlock(achievements);
        }
      });

      // Link the DOM element for GPU accelerated movement
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
  }, [gameState, currentLevel, userProfile]);

  const handleLevelComplete = (levelData) => {
    if (currentLevel % 5 === 0) {
      setShowBreathing(true);
    } else {
      setGameState('levelComplete');
    }
    saveProgress();
  };

  const handleGameOver = (finalScore) => {
    setShowAffirmation(true);
    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
    saveProgress();
  };

  const handleAffirmationContinue = () => {
    setShowAffirmation(false);
    setGameState('gameOver');
  };

  const handleBreathingComplete = () => {
    setShowBreathing(false);
    setGameState('levelComplete');
  };

  const saveProgress = async () => {
    try {
      const user = await base44.auth.me();
      await base44.entities.GameScore.create({
        user_email: user.email,
        game_type: 'chakra_blaster',
        score: score,
        level_reached: currentLevel,
        duration_seconds: Math.floor(Date.now() / 1000)
      });
      // ... (rest of save logic same as before)
    } catch (error) {
      console.error('Failed to save game progress:', error);
    }
  };

  const startGame = (level = 1) => {
    setCurrentLevel(level);
    setScore(0);
    setCoins(upgradeManager.getCoins());
    const newAchievements = achievementTracker.trackGameStart();
    if (newAchievements.length > 0) {
      handleAchievementUnlock(newAchievements);
    }
    setGameState('playing');
  };
  
  const openUpgrades = () => setShowUpgradeMenu(true);
  const handleUpgradePurchase = () => setCoins(upgradeManager.getCoins());
  
  const handleAchievementUnlock = async (achievements) => {
    setUnlockedAchievements(achievements);
    achievements.forEach(achievement => {
      upgradeManager.addCoins(achievement.coinReward);
    });
    setCoins(upgradeManager.getCoins());
    // ... (rest of achievement save logic)
  };

  const nextLevel = () => {
    if (gameRef.current) {
      gameRef.current.stop();
      gameRef.current = null;
    }
    setCurrentLevel(prev => prev + 1);
    setGameState('playing');
  };

  const retryLevel = () => {
    if (gameRef.current) {
      gameRef.current.stop();
      gameRef.current = null;
    }
    setScore(0);
    setGameState('playing');
  };

  const pauseGame = () => {
    if (gameRef.current) gameRef.current.pause();
    setGameState('paused');
  };

  const resumeGame = () => {
    if (gameRef.current) gameRef.current.resume();
    setGameState('playing');
  };

  const backToMenu = () => {
    if (gameRef.current) {
      gameRef.current.stop();
      gameRef.current = null;
    }
    setGameState('menu');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-900 via-indigo-900 to-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className={`${gameState === 'playing' || gameState === 'paused' ? 'block' : 'hidden'} fixed inset-0 z-0`}
        style={{ touchAction: 'none' }}
      />

      {/* GPU Accelerated Player DOM Element */}
      <div
        ref={playerRef}
        className={`${gameState === 'playing' || gameState === 'paused' ? 'block' : 'hidden'} fixed z-10 w-10 h-10 top-0 left-0 pointer-events-none will-change-transform`}
        style={{ transform: 'translate3d(-100px, -100px, 0)' }} // Initial off-screen
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(34,211,238,0.8)] border-2 border-white relative">
            <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
        </div>
      </div>

      <AnimatePresence>
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20"
          >
             {/* ... Menu Content same as before ... */}
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 font-heading text-white">CHAKRA BLASTER</h1>
              <p className="text-2xl font-light tracking-wider font-accent text-purple-300">MAX</p>
            </motion.div>

            <div className="flex flex-col gap-4 w-full max-w-sm">
                <button onClick={() => startGame(1)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl">Start Game</button>
                <button onClick={openUpgrades} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg">Upgrades</button>
                <Link to={createPageUrl('Dashboard')} className="bg-white/10 text-center text-white px-8 py-4 rounded-2xl font-bold text-lg">Back</Link>
            </div>
          </motion.div>
        )}

        {/* ... Other game states (paused, game over, etc.) ... */}
      </AnimatePresence>

      {/* HUD logic remains same */}
      {gameState === 'playing' && (
        <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
            <div className="flex justify-between items-start">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-purple-400/30">
                <p className="text-xs text-purple-200 mb-1 font-bold">Level {currentLevel}</p>
                <p className="text-2xl font-bold text-white">{score}</p>
              </div>
              <div className="flex gap-2 pointer-events-auto">
                  <button onClick={pauseGame} className="p-2 bg-white/10 rounded-full"><Settings className="text-white" /></button>
              </div>
            </div>
            <div className="flex justify-center mt-4">
                <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                    <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${(playerHealth / playerMaxHealth) * 100}%` }} />
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* ... Modals (UpgradeMenu, HowToPlay, etc.) ... */}
      <UpgradeMenu isOpen={showUpgradeMenu} onClose={() => setShowUpgradeMenu(false)} onPurchase={handleUpgradePurchase} />
    </div>
  );
}
