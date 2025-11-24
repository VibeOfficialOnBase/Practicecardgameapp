import React, { useEffect, useRef, useState } from 'react';
import BaseGame from '../components/games/BaseGame';
import { base44 } from '@/api/base44Client';

const GRATITUDE_WORDS = [
  'Love', 'Peace', 'Joy', 'Hope', 'Faith', 'Trust', 'Grace', 'Light',
  'Calm', 'Bliss', 'Kind', 'Brave', 'Safe', 'Free', 'Strong', 'Whole'
];

export default function GratitudeGrid() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const gameLoopRef = useRef(null);
  const gameDataRef = useRef({
    grid: [],
    selectedTiles: [],
    targetWord: '',
    timeLeft: 30
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = Math.min(window.innerWidth - 32, 800);
      canvas.height = Math.min(window.innerHeight - 200, 600);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleClick = (e) => {
      if (gameState !== 'playing') return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const data = gameDataRef.current;
      data.grid.forEach(tile => {
        if (x > tile.x && x < tile.x + tile.size &&
            y > tile.y && y < tile.y + tile.size && !tile.matched) {
          if (data.selectedTiles.length < data.targetWord.length) {
            tile.selected = !tile.selected;
            
            if (tile.selected) {
              data.selectedTiles.push(tile);
            } else {
              data.selectedTiles = data.selectedTiles.filter(t => t !== tile);
            }
            
            // Check if word is complete
            if (data.selectedTiles.length === data.targetWord.length) {
              const word = data.selectedTiles.map(t => t.letter).join('');
              if (word === data.targetWord) {
                data.selectedTiles.forEach(t => t.matched = true);
                setScore(s => s + 100);
                data.selectedTiles = [];
                
                // New word
                data.targetWord = GRATITUDE_WORDS[Math.floor(Math.random() * GRATITUDE_WORDS.length)];
              } else {
                data.selectedTiles.forEach(t => t.selected = false);
                data.selectedTiles = [];
              }
            }
          }
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
    };
  }, [gameState]);

  const generateGrid = (canvas, level) => {
    const data = gameDataRef.current;
    const tileSize = 60;
    const cols = 8;
    const rows = 6;
    
    data.grid = [];
    data.targetWord = GRATITUDE_WORDS[Math.floor(Math.random() * GRATITUDE_WORDS.length)];
    data.timeLeft = 30 + level * 5;
    
    // Fill grid with letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        data.grid.push({
          x: col * (tileSize + 5) + 50,
          y: row * (tileSize + 5) + 100,
          size: tileSize,
          letter: letters[Math.floor(Math.random() * letters.length)],
          selected: false,
          matched: false
        });
      }
    }
    
    // Place target word in grid
    const startIdx = Math.floor(Math.random() * (data.grid.length - data.targetWord.length));
    for (let i = 0; i < data.targetWord.length; i++) {
      data.grid[startIdx + i].letter = data.targetWord[i];
    }
  };

  const startGame = () => {
    const canvas = canvasRef.current;
    generateGrid(canvas, level);
    setGameState('playing');

    const startTime = Date.now();
    const gameLoop = () => {
      const ctx = canvas.getContext('2d');
      const data = gameDataRef.current;
      
      ctx.fillStyle = '#0F0820';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw timer
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const timeLeft = Math.max(0, data.timeLeft - elapsed);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Poppins';
      ctx.textAlign = 'center';
      ctx.fillText(`Time: ${timeLeft}s`, canvas.width / 2, 50);

      if (timeLeft === 0) {
        setGameState('gameOver');
        cancelAnimationFrame(gameLoopRef.current);
        return;
      }

      // Draw target word
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 32px Poppins';
      ctx.fillText(`Find: ${data.targetWord}`, canvas.width / 2, 80);

      // Draw grid
      data.grid.forEach(tile => {
        if (tile.matched) {
          ctx.fillStyle = '#10B981';
        } else if (tile.selected) {
          ctx.fillStyle = '#8B5CF6';
        } else {
          ctx.fillStyle = '#1A0F35';
        }
        
        ctx.fillRect(tile.x, tile.y, tile.size, tile.size);
        ctx.strokeStyle = '#A974FF';
        ctx.lineWidth = 2;
        ctx.strokeRect(tile.x, tile.y, tile.size, tile.size);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tile.letter, tile.x + tile.size / 2, tile.y + tile.size / 2);
      });

      // Check win condition
      const allMatched = data.grid.every(t => t.matched || !data.targetWord.includes(t.letter));
      if (data.grid.filter(t => t.matched).length >= 30) {
        setGameState('levelComplete');
        cancelAnimationFrame(gameLoopRef.current);
        return;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  const nextLevel = () => {
    setLevel(l => l + 1);
    startGame();
  };

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    startGame();
  };

  return (
    <BaseGame
      gameTitle="Gratitude Grid"
      gameDescription="Cultivate positive thinking through word finding"
      canvasRef={canvasRef}
      gameState={gameState}
      setGameState={setGameState}
      level={level}
      score={score}
      startGame={startGame}
      nextLevel={nextLevel}
      restartGame={restartGame}
      gameType="gratitude_grid"
      userEmail={user?.email}
    >
      <h2 className="text-3xl font-bold text-white mb-6">Find Gratitude</h2>
      <p className="text-slate-300 mb-4">Click tiles to spell gratitude words</p>
      <p className="text-amber-300 mb-8 font-semibold">Match words to cultivate positivity!</p>
    </BaseGame>
  );
}