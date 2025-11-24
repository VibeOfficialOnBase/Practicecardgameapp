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
        if (!currentUser) {
          console.error('No user authenticated');
          return;
        }
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

      // Update game mastery
      const masteries = await base44.entities.GameMastery.filter({
        user_email: user.email,
        game_type: 'chakra_blaster'
      });

      const xpGained = Math.floor(score / 10) + currentLevel * 5;

      if (masteries.length > 0) {
        const mastery = masteries[0];
        const newXP = mastery.mastery_xp + xpGained;
        const newLevel = Math.floor(newXP / 200) + 1;
        
        await base44.entities.GameMastery.update(mastery.id, {
          mastery_xp: newXP,
          mastery_level: newLevel,
          total_plays: mastery.total_plays + 1,
          total_score: mastery.total_score + score
        });
      } else {
        await base44.entities.GameMastery.create({
          user_email: user.email,
          game_type: 'chakra_blaster',
          mastery_level: 1,
          mastery_xp: xpGained,
          total_plays: 1,
          total_score: score
        });
      }

      // Log activity pulse
      await base44.entities.ActivityPulse.create({
        user_email: user.email,
        action_type: 'game_completed',
        action_description: `reached level ${currentLevel} in Chakra Blaster`,
        action_icon: '⚡',
        related_data: { score, level: currentLevel }
      });
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
  
  const openUpgrades = () => {
    setShowUpgradeMenu(true);
  };
  
  const handleUpgradePurchase = () => {
    setCoins(upgradeManager.getCoins());
  };
  
  const handleAchievementUnlock = async (achievements) => {
    setUnlockedAchievements(achievements);
    
    achievements.forEach(achievement => {
      upgradeManager.addCoins(achievement.coinReward);
    });
    
    if (user) {
      try {
        for (const achievement of achievements) {
          const existing = await base44.entities.ChakraAchievement.filter({
            user_email: user.email,
            achievement_id: achievement.id
          });
          
          if (existing.length === 0) {
            await base44.entities.ChakraAchievement.create({
              user_email: user.email,
              achievement_id: achievement.id,
              achievement_name: achievement.name,
              achievement_description: achievement.description,
              icon: achievement.icon,
              progress: achievement.goal,
              goal: achievement.goal,
              completed: true,
              completed_date: new Date().toISOString(),
              coin_reward: achievement.coinReward
            });
          }
        }
      } catch (error) {
        console.error('Failed to save achievements:', error);
      }
    }
    
    setCoins(upgradeManager.getCoins());
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
    if (gameRef.current) {
      gameRef.current.pause();
    }
    setGameState('paused');
  };

  const resumeGame = () => {
    if (gameRef.current) {
      gameRef.current.resume();
    }
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
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className={`${gameState === 'playing' || gameState === 'paused' ? 'block' : 'hidden'} fixed inset-0`}
        style={{ 
          touchAction: 'none',
          width: '100vw',
          height: '100vh',
          maxWidth: '100%',
          maxHeight: '100%'
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
                CHAKRA BLASTER
              </h1>
              <p className="text-2xl font-light tracking-wider ensure-readable font-accent">MAX</p>
              {scores.length > 0 && scores[0].created_date && (
                <div className="mt-4">
                  <LastCompletedIndicator 
                    lastCompletedDate={scores[0].created_date}
                    label="Last played"
                  />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 mb-6"
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-xs text-purple-300 mb-1">High Score</p>
                    <p className="text-2xl font-bold text-white">{highScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-300 mb-1">Max Level</p>
                    <p className="text-2xl font-bold text-white">{maxLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-300 mb-1">Coins</p>
                    <p className="text-2xl font-bold text-yellow-400">{upgradeManager.getCoins()}</p>
                  </div>
                </div>
              </div>

              {user && <GameMasteryDisplay userEmail={user.email} gameType="chakra_blaster" />}
            </motion.div>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <motion.button
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowModeSelector(!showModeSelector)}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all"
              >
                <Play className="w-6 h-6" />
                Start Game
              </motion.button>

              {showModeSelector && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <GameModeSelector
                    gameType="chakra_blaster"
                    playerLevel={maxLevel}
                    currentMode={gameMode}
                    onSelectMode={(mode) => {
                      setGameMode(mode);
                      setShowModeSelector(false);
                      startGame(1);
                    }}
                  />
                </motion.div>
              )}

              <motion.button
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={openUpgrades}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all ensure-readable-strong"
              >
                <Trophy className="w-6 h-6" />
                Upgrades ({upgradeManager.getCoins()} coins)
              </motion.button>
              
              <motion.button
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowDailyRewards(true)}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all ensure-readable-strong"
              >
                <Gift className="w-6 h-6" />
                Daily Rewards
              </motion.button>

              <motion.button
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/20 transition-all"
              >
                <Trophy className="w-6 h-6" />
                Leaderboard
              </motion.button>

              <motion.button
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowHowToPlay(true)}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/20 transition-all"
              >
                <Info className="w-6 h-6" />
                How to Play
              </motion.button>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to={createPageUrl('Dashboard')}
                  className="flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md text-purple-300 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:bg-white/10 transition-all"
                >
                  <ArrowLeft className="w-6 h-6" />
                  Back to App
                </Link>
              </motion.div>
            </div>

            {showLeaderboard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-6"
              >
                <GameLeaderboard gameType="chakra_blaster" />
                {user && <WeeklyChallengeCard userEmail={user.email} />}
              </motion.div>
            )}
          </motion.div>
        )}

        {gameState === 'paused' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20"
          >
            <h2 className="text-4xl font-bold text-white mb-8">PAUSED</h2>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button
                onClick={resumeGame}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg"
              >
                Resume
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

        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20"
          >
            <motion.h2
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-4"
            >
              LEVEL COMPLETE!
            </motion.h2>
            <p className="text-3xl text-purple-300 mb-8">Level {currentLevel}</p>
            <p className="text-xl text-white mb-12">Score: {score}</p>
            
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button
                onClick={nextLevel}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl"
              >
                Next Level
              </button>
              <button
                onClick={retryLevel}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl"
              >
                Replay Level
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
              className="text-5xl font-bold text-red-400 mb-4"
            >
              GAME OVER
            </motion.h2>
            <p className="text-2xl text-white mb-2">Final Score: {score}</p>
            <p className="text-lg text-purple-300 mb-12">Level Reached: {currentLevel}</p>
            
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button
                onClick={retryLevel}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl"
              >
                Try Again
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
              <div className="bg-white/25 backdrop-blur-md rounded-2xl px-4 py-3 border border-purple-400/50 shadow-xl">
                <p className="text-xs mb-1 font-bold" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Level {currentLevel}</p>
                <p className="text-2xl font-bold" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{score}</p>
                {userProfile?.vibe_official_pack_unlocked && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-xs">👑</span>
                  </div>
                )}
                {userProfile?.algo_leagues_pack_unlocked && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-xs">🏆</span>
                  </div>
                )}
              </div>

            <div className="flex gap-2">
              <SoundToggle />
              <button
                onClick={pauseGame}
                className="bg-white/25 backdrop-blur-md rounded-2xl px-4 py-3 pointer-events-auto border border-purple-400/50 shadow-xl"
              >
                <Settings className="w-6 h-6" style={{ color: '#FFFFFF' }} />
              </button>
            </div>
            </div>

          <div className="flex justify-center mt-4">
            <div className="bg-white/25 backdrop-blur-md rounded-full px-6 py-3 border border-purple-400/50 min-w-[300px] shadow-xl">
              <p className="text-xs text-center mb-2 font-bold" style={{ color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>Chakra Energy</p>
              <div className="relative h-3 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${(playerHealth / playerMaxHealth) * 100 || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <UpgradeMenu 
        isOpen={showUpgradeMenu}
        onClose={() => setShowUpgradeMenu(false)}
        onPurchase={handleUpgradePurchase}
      />

      <ChakraBlasterHowToPlay
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
      
      {user && (
        <DailyRewardsModal
          isOpen={showDailyRewards}
          onClose={() => setShowDailyRewards(false)}
          userEmail={user.email}
        />
      )}
      
      {showBreathing && (
        <BreathingExercise onComplete={handleBreathingComplete} />
      )}

      {showAffirmation && (
        <AffirmingMessage onContinue={handleAffirmationContinue} />
      )}

      <AnimatePresence>
        {unlockedAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.3 }}
            className="fixed top-20 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-white/30 z-50 max-w-sm"
            style={{ top: `${80 + index * 100}px` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{achievement.icon}</span>
              <div>
                <p className="font-bold text-lg ensure-readable-strong">Achievement Unlocked!</p>
                <p className="text-sm ensure-readable-strong">{achievement.name}</p>
                <p className="text-xs ensure-readable mt-1">+{achievement.coinReward} Lumina Coins</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}