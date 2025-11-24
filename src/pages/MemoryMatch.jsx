import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft, Play, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import TutorialModal from '../components/games/TutorialModal';
import BreathingExercise from '../components/games/BreathingExercise';
import AffirmingMessage from '../components/games/AffirmingMessage';
import GameLeaderboard from '../components/games/GameLeaderboard';
import SoundToggle from '../components/SoundToggle';
import { soundManager } from '../components/utils/soundManager';
import LastCompletedIndicator from '../components/LastCompletedIndicator';
import GameMasteryDisplay from '../components/games/GameMasteryDisplay';
import WeeklyChallengeCard from '../components/games/WeeklyChallengeCard';

export default function MemoryMatch() {
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const timerRef = useRef(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        const userScores = await base44.entities.GameScore.filter({ user_email: currentUser.email });
        setScores(userScores);
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    loadUser();
  }, []);

  const affirmations = [
    "I am enough",
    "I am loved",
    "I am strong",
    "I am capable",
    "I am worthy",
    "I am brave",
    "I am peaceful",
    "I am grateful",
    "I am growing",
    "I am resilient",
    "I am confident",
    "I am present"
  ];

  const gridSizes = {
    easy: { rows: 2, cols: 2, pairs: 2 },
    medium: { rows: 4, cols: 4, pairs: 8 },
    hard: { rows: 4, cols: 6, pairs: 12 }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const startGame = (level) => {
    setDifficulty(level);
    const { pairs } = gridSizes[level];
    const selectedAffirmations = affirmations.slice(0, pairs);
    const cardPairs = [...selectedAffirmations, ...selectedAffirmations]
      .map((text, id) => ({ id, text, uniqueId: Math.random() }))
      .sort(() => Math.random() - 0.5);
    
    setCards(cardPairs);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setGameState('playing');
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    soundManager.play('card-flip');
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].text === cards[second].text) {
        soundManager.play('game-match');
        setTimeout(() => {
          setMatched(m => [...m, first, second]);
          setFlipped([]);
          
          if (matched.length + 2 === cards.length) {
            clearInterval(timerRef.current);
            saveGameProgress();
            if (difficulty === 'hard') {
              setShowAffirmation(true);
            } else {
              setGameState('complete');
            }
          }
        }, 800);
      } else {
        setTimeout(() => setFlipped([]), 1200);
      }
    }
  };

  const saveGameProgress = async () => {
    if (!user) return;
    try {
      const finalScore = Math.max(0, 1000 - moves * 10 - time * 2);
      
      await base44.entities.GameScore.create({
        user_email: user.email,
        game_type: 'memory_match',
        score: finalScore,
        level_reached: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        duration_seconds: time
      });

      // Update mastery
      const masteries = await base44.entities.GameMastery.filter({
        user_email: user.email,
        game_type: 'memory_match'
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
          game_type: 'memory_match',
          mastery_level: 1,
          mastery_xp: xpGained,
          total_plays: 1,
          total_score: finalScore
        });
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const backToMenu = () => {
    setGameState('menu');
    clearInterval(timerRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center relative overflow-hidden p-4 safe-area-bottom">
      <AnimatePresence>
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl w-full"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center ensure-readable-strong">
              Memory Match
            </h1>
            <p className="text-xl text-center mb-4 ensure-readable">
              Match affirmations, strengthen your mind
            </p>
            {scores.length > 0 && scores.filter(s => s.game_type === 'memory_match')[0]?.created_date && (
              <div className="flex justify-center mb-4">
                <LastCompletedIndicator 
                  lastCompletedDate={scores.filter(s => s.game_type === 'memory_match')[0].created_date}
                  label="Last played"
                />
              </div>
            )}

            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 mb-6 max-w-sm mx-auto"
              >
                <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-xs text-purple-300 mb-1">Best Score</p>
                      <p className="text-2xl font-bold text-white">
                        {scores.filter(s => s.game_type === 'memory_match').length > 0
                          ? Math.max(...scores.filter(s => s.game_type === 'memory_match').map(s => s.score))
                          : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-300 mb-1">Games Played</p>
                      <p className="text-2xl font-bold text-white">
                        {scores.filter(s => s.game_type === 'memory_match').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <GameMasteryDisplay userEmail={user.email} gameType="memory_match" />
              </motion.div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => startGame('easy')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-green-500/50 transition-all"
              >
                Easy (2x2)
              </button>
              <button
                onClick={() => startGame('medium')}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-yellow-500/50 transition-all"
              >
                Medium (4x4)
              </button>
              <button
                onClick={() => startGame('hard')}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-red-500/50 transition-all"
              >
                Hard (4x6)
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
                className="mt-8 space-y-6"
              >
                <GameLeaderboard gameType="memory_match" />
                {user && <WeeklyChallengeCard userEmail={user.email} />}
              </motion.div>
            )}
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl px-2 sm:px-4"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 border border-purple-300">
                <p className="text-xs font-semibold text-purple-900">Moves</p>
                <p className="text-2xl font-bold text-purple-900">{moves}</p>
              </div>
              <SoundToggle />
              <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 border border-purple-300">
                <p className="text-xs font-semibold text-purple-900">Time</p>
                <p className="text-2xl font-bold text-purple-900">{formatTime(time)}</p>
              </div>
            </div>

            <div 
              className="grid gap-2 sm:gap-3"
              style={{
                gridTemplateColumns: `repeat(${gridSizes[difficulty].cols}, minmax(0, 1fr))`,
                maxWidth: '100%'
              }}
            >
              {cards.map((card, index) => (
                <motion.button
                  key={card.uniqueId}
                  onClick={() => handleCardClick(index)}
                  className="aspect-square rounded-xl sm:rounded-2xl relative overflow-hidden"
                  style={{ perspective: '1000px' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      rotateY: flipped.includes(index) || matched.includes(index) ? 180 : 0
                    }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <img
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6921dea06e8f58657363a952/43aec5bff_PRACTICECARDBACK.jpg"
                        alt="Card back"
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div
                      className="absolute inset-0 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center p-1 sm:p-2 md:p-4 shadow-xl"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <p className="text-center font-bold text-purple-900 text-[10px] sm:text-xs md:text-sm leading-tight">
                        {card.text}
                      </p>
                    </div>
                  </motion.div>
                </motion.button>
              ))}
            </div>

            <button
              onClick={backToMenu}
              className="mt-6 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all mx-auto block"
            >
              Back to Menu
            </button>
          </motion.div>
        )}

        {gameState === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-5xl font-bold text-white mb-4">Complete!</h2>
            <p className="text-2xl text-purple-200 mb-2">Moves: {moves}</p>
            <p className="text-2xl text-purple-200 mb-8">Time: {formatTime(time)}</p>
            <div className="space-y-4">
              <button
                onClick={() => startGame(difficulty)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg"
              >
                Play Again
              </button>
              <button
                onClick={backToMenu}
                className="block bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg mx-auto"
              >
                Back to Menu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAffirmation && (
        <AffirmingMessage onContinue={() => {
          setShowAffirmation(false);
          setGameState('complete');
        }} />
      )}

      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} title="How to Play">
        <div className="space-y-4">
          <section>
            <h3 className="text-xl font-bold mb-2">Objective</h3>
            <p>Match all pairs of affirmations in the fewest moves and fastest time.</p>
          </section>
          <section>
            <h3 className="text-xl font-bold mb-2">How to Play</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Click or tap cards to flip them over</li>
              <li>Find matching pairs of affirmations</li>
              <li>Matched pairs stay face up</li>
              <li>Try to remember where cards are!</li>
            </ul>
          </section>
          <section>
            <h3 className="text-xl font-bold mb-2">Difficulty Levels</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Easy:</strong> 2x2 grid (2 pairs)</li>
              <li><strong>Medium:</strong> 4x4 grid (8 pairs)</li>
              <li><strong>Hard:</strong> 4x6 grid (12 pairs)</li>
            </ul>
          </section>
        </div>
      </TutorialModal>
    </div>
  );
}