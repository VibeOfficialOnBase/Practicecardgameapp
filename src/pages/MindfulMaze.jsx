import React, { useEffect, useRef, useState } from 'react';
import BaseGame from '../components/games/BaseGame';
import { base44 } from '@/api/base44Client';

export default function MindfulMaze() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const gameLoopRef = useRef(null);
  const gameDataRef = useRef({
    player: { x: 0, y: 0, size: 20 },
    walls: [],
    collectibles: [],
    goal: null,
    keys: {}
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

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const generateMaze = (canvas, level) => {
    const data = gameDataRef.current;
    const cellSize = 40;
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);
    
    data.walls = [];
    data.collectibles = [];
    
    // Simple maze generation - create a grid with some walls
    for (let i = 0; i < 20 + level * 5; i++) {
      const x = Math.floor(Math.random() * (cols - 2)) * cellSize + cellSize;
      const y = Math.floor(Math.random() * (rows - 2)) * cellSize + cellSize;
      data.walls.push({ x, y, size: cellSize });
    }
    
    // Add collectibles for focus points
    for (let i = 0; i < 5 + level; i++) {
      const x = Math.random() * (canvas.width - 40) + 20;
      const y = Math.random() * (canvas.height - 40) + 20;
      data.collectibles.push({ x, y, size: 15, collected: false });
    }
    
    // Set goal
    data.goal = {
      x: canvas.width - 50,
      y: canvas.height - 50,
      size: 30
    };
    
    // Set player start
    data.player.x = 50;
    data.player.y = 50;
  };

  const startGame = () => {
    const canvas = canvasRef.current;
    generateMaze(canvas, level);
    setGameState('playing');

    const gameLoop = () => {
      const ctx = canvas.getContext('2d');
      const data = gameDataRef.current;
      
      ctx.fillStyle = '#0F0820';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw walls
      ctx.fillStyle = '#7733FF';
      data.walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.size, wall.size);
      });

      // Draw collectibles
      data.collectibles.forEach(item => {
        if (!item.collected) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw goal
      ctx.fillStyle = '#10B981';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#10B981';
      ctx.fillRect(data.goal.x, data.goal.y, data.goal.size, data.goal.size);
      ctx.shadowBlur = 0;

      // Player movement
      const speed = 4;
      let newX = data.player.x;
      let newY = data.player.y;
      
      if (data.keys['ArrowLeft'] || data.keys['a']) newX -= speed;
      if (data.keys['ArrowRight'] || data.keys['d']) newX += speed;
      if (data.keys['ArrowUp'] || data.keys['w']) newY -= speed;
      if (data.keys['ArrowDown'] || data.keys['s']) newY += speed;

      // Collision detection with walls
      let canMove = true;
      data.walls.forEach(wall => {
        if (newX + data.player.size > wall.x && newX < wall.x + wall.size &&
            newY + data.player.size > wall.y && newY < wall.y + wall.size) {
          canMove = false;
        }
      });

      if (canMove) {
        data.player.x = Math.max(data.player.size, Math.min(canvas.width - data.player.size, newX));
        data.player.y = Math.max(data.player.size, Math.min(canvas.height - data.player.size, newY));
      }

      // Draw player
      ctx.fillStyle = '#A974FF';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#A974FF';
      ctx.beginPath();
      ctx.arc(data.player.x, data.player.y, data.player.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Check collectibles
      data.collectibles.forEach(item => {
        if (!item.collected) {
          const dist = Math.hypot(item.x - data.player.x, item.y - data.player.y);
          if (dist < data.player.size + item.size) {
            item.collected = true;
            setScore(s => s + 10);
          }
        }
      });

      // Check goal
      if (data.player.x + data.player.size > data.goal.x &&
          data.player.x < data.goal.x + data.goal.size &&
          data.player.y + data.player.size > data.goal.y &&
          data.player.y < data.goal.y + data.goal.size) {
        const allCollected = data.collectibles.every(c => c.collected);
        if (allCollected) {
          setGameState('levelComplete');
          cancelAnimationFrame(gameLoopRef.current);
          return;
        }
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      gameDataRef.current.keys[e.key] = true;
    };
    const handleKeyUp = (e) => {
      gameDataRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
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
      gameTitle="Mindful Maze"
      gameDescription="Navigate through focus and concentration"
      canvasRef={canvasRef}
      gameState={gameState}
      setGameState={setGameState}
      level={level}
      score={score}
      startGame={startGame}
      nextLevel={nextLevel}
      restartGame={restartGame}
      gameType="mindful_maze"
      userEmail={user?.email}
    >
      <h2 className="text-3xl font-bold text-white mb-6">Focus Your Mind</h2>
      <p className="text-slate-300 mb-4">Use arrow keys or WASD to move</p>
      <p className="text-amber-300 mb-8 font-semibold">Collect all golden orbs, then reach the green goal!</p>
    </BaseGame>
  );
}