import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Star } from 'lucide-react';

export default function VibeagotchiMiniGame({ gameType, onComplete, onClose }) {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [targets, setTargets] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [missedStars, setMissedStars] = useState(0);

  useEffect(() => {
    if (gameType === 'catch_stars') {
      const interval = setInterval(() => {
        const starTypes = ['⭐', '✨', '💫', '🌟'];
        const randomType = starTypes[Math.floor(Math.random() * starTypes.length)];
        const speed = 1 + Math.random() * 2;
        setTargets(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: -10,
          type: randomType,
          speed,
          points: randomType === '🌟' ? 25 : randomType === '💫' ? 15 : 10
        }]);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [gameType]);

  useEffect(() => {
    if (timeLeft > 0 && gameState === 'playing') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('finished');
      onComplete(score);
    }
  }, [timeLeft, gameState, score, onComplete]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setTargets(prev => {
        const filtered = prev.filter(t => {
          if (t.y >= 100) {
            setMissedStars(m => m + 1);
            setCombo(0);
            return false;
          }
          return true;
        });
        return filtered.map(t => ({ ...t, y: t.y + (t.speed || 2) }));
      });
    }, 50);
    return () => clearInterval(moveInterval);
  }, []);

  const handleCatch = (target) => {
    setTargets(prev => prev.filter(t => t.id !== target.id));
    const newCombo = combo + 1;
    setCombo(newCombo);
    const comboBonus = Math.floor(newCombo / 3) * 5;
    setScore(prev => prev + target.points + comboBonus);
  };

  if (gameState === 'finished') {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-organic p-8 max-w-md text-center"
        >
          <h2 className="text-3xl font-bold mb-4 ensure-readable-strong">Game Over!</h2>
          <p className="text-5xl font-bold text-purple-400 mb-2">{score}</p>
          <p className="text-label mb-6">Your VibeAGotchi is delighted!</p>
          <Button onClick={onClose} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
            Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="text-white">
          <p className="text-xl font-bold">Score: {score}</p>
          <p className="text-sm">Time: {timeLeft}s</p>
          {combo > 0 && (
            <motion.p 
              key={combo}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-sm font-bold text-yellow-400"
            >
              Combo x{combo}! 🔥
            </motion.p>
          )}
          <p className="text-xs text-red-300">Missed: {missedStars}</p>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence>
          {targets.map(target => (
            <motion.button
              key={target.id}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => handleCatch(target)}
              className="absolute w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                background: target.points === 25 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 
                           target.points === 15 ? 'linear-gradient(135deg, #C0C0FF, #8888FF)' :
                           'linear-gradient(135deg, #FFEB3B, #FFC107)',
                boxShadow: '0 4px 20px rgba(255, 215, 0, 0.6)'
              }}
            >
              <span className="text-3xl">{target.type}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}