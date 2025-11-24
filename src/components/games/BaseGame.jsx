import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Play, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { base44 } from '@/api/base44Client';

export default function BaseGame({ 
  gameTitle, 
  gameDescription,
  canvasRef, 
  gameState, 
  setGameState,
  level, 
  score, 
  hp,
  startGame,
  nextLevel,
  restartGame,
  gameType,
  userEmail,
  children 
}) {
  const saveGameScore = async (finalScore, levelReached) => {
    try {
      await base44.entities.GameScore.create({
        user_email: userEmail,
        game_type: gameType,
        score: finalScore,
        level_reached: levelReached,
        duration_seconds: Math.floor(Date.now() / 1000)
      });
    } catch (error) {
      console.error('Failed to save game score:', error);
    }
  };

  useEffect(() => {
    if (gameState === 'gameOver' || gameState === 'levelComplete') {
      saveGameScore(score, level);
    }
  }, [gameState]);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">{gameTitle}</h1>
        <p className="text-body text-lg">{gameDescription}</p>
      </motion.div>

      <div className="card-organic p-4 sm:p-6">
        {gameState === 'playing' && (
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm sm:text-base">
              <span className="text-label">Level:</span>
              <span className="text-purple-600 font-bold ml-2">{level}</span>
            </div>
            <div className="text-sm sm:text-base">
              <span className="text-label">Score:</span>
              <span className="text-purple-600 font-bold ml-2">{score}</span>
            </div>
            {hp !== undefined && (
              <div className="text-sm sm:text-base">
                <span className="text-label">HP:</span>
                <div className="inline-block w-20 sm:w-32 h-3 bg-slate-200 rounded-full ml-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                    style={{ width: `${hp}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative bg-gradient-to-b from-[#0F0820] to-[#1A0F35] rounded-2xl overflow-hidden">
          <canvas ref={canvasRef} className="max-w-full" />
          
          {gameState === 'menu' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-2xl z-10"
            >
              <div className="text-center p-8">
                {children}
                <Button onClick={startGame} className="btn-primary text-lg px-8 py-6">
                  <Play className="w-5 h-5 mr-2" />
                  Start Game
                </Button>
              </div>
            </motion.div>
          )}

          {gameState === 'levelComplete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-2xl z-10"
            >
              <div className="text-center p-8">
                <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">Level {level} Complete!</h2>
                <p className="text-2xl text-purple-300 mb-8">Score: {score}</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={nextLevel} className="btn-primary text-lg px-8 py-4">
                    Next Level
                  </Button>
                  <Link to={createPageUrl('Dashboard')}>
                    <Button variant="outline" className="text-lg px-8 py-4">
                      <Home className="w-5 h-5 mr-2" />
                      Home
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'gameOver' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-2xl z-10"
            >
              <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-white mb-4">PRACTICE Complete</h2>
                <p className="text-xl text-slate-300 mb-2">Level Reached: {level}</p>
                <p className="text-2xl text-purple-300 mb-8">Final Score: {score}</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button onClick={restartGame} className="btn-primary text-lg px-8 py-4">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Play Again
                  </Button>
                  <Link to={createPageUrl('Dashboard')}>
                    <Button variant="outline" className="text-lg px-8 py-4">
                      <Home className="w-5 h-5 mr-2" />
                      Home
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {gameState === 'playing' && (
          <div className="mt-4 text-center">
            <p className="text-xs sm:text-sm text-label">
              ← → ↑ ↓ or WASD to move
            </p>
          </div>
        )}
      </div>
    </div>
  );
}