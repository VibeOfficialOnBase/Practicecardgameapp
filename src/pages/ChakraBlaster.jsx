import React, { useEffect, useRef, useState } from 'react';
import BaseGame from '../components/games/BaseGame';
import { base44 } from '@/api/base44Client';

const AFFIRMATIONS = {
  anger: ['I release anger.', 'I am at peace.', 'I choose calm.', 'I let go of tension.'],
  regret: ['I release regret.', 'I forgive myself.', 'I learn and grow.', 'The past is behind me.'],
  sadness: ['I release sadness.', 'Joy returns to me.', 'I embrace light.', 'I am healing.'],
  fear: ['I am safe.', 'I trust myself.', 'I am protected.', 'Courage flows through me.'],
  guilt: ['I let go.', 'I am worthy.', 'I forgive myself.', 'I am free.']
};

const ENEMY_COLORS = {
  anger: '#ef4444',
  regret: '#8b5cf6',
  sadness: '#3b82f6',
  fear: '#f59e0b',
  guilt: '#06b6d4'
};

export default function ChakraBlaster() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(100);
  const [user, setUser] = useState(null);
  const gameLoopRef = useRef(null);
  const gameDataRef = useRef({
    player: { x: 0, y: 0, size: 40 },
    projectiles: [],
    enemies: [],
    particles: [],
    affirmations: [],
    keys: {},
    lastShot: 0,
    enemiesDefeated: 0
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

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = Math.min(window.innerWidth - 32, 800);
      canvas.height = Math.min(window.innerHeight - 200, 600);
      gameDataRef.current.player.x = canvas.width / 2;
      gameDataRef.current.player.y = canvas.height - 80;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const spawnEnemy = (canvas, level) => {
    const types = Object.keys(ENEMY_COLORS);
    const type = types[Math.floor(Math.random() * types.length)];
    const size = 30 + Math.random() * 20;
    
    return {
      x: Math.random() * (canvas.width - size),
      y: -size,
      size,
      type,
      color: ENEMY_COLORS[type],
      speed: 1 + level * 0.3 + Math.random() * 0.5,
      hp: level
    };
  };

  const startGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const data = gameDataRef.current;
    
    data.player.x = canvas.width / 2;
    data.player.y = canvas.height - 80;
    data.projectiles = [];
    data.enemies = [];
    data.particles = [];
    data.affirmations = [];
    data.enemiesDefeated = 0;
    
    setHp(100);
    setGameState('playing');

    const enemyCount = 8 + level * 3;
    for (let i = 0; i < enemyCount; i++) {
      setTimeout(() => {
        if (data.enemies.length < enemyCount) {
          data.enemies.push(spawnEnemy(canvas, level));
        }
      }, i * 800);
    }

    const gameLoop = () => {
      ctx.fillStyle = 'rgba(15, 8, 32, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Background stars
      ctx.fillStyle = 'rgba(169, 116, 255, 0.3)';
      for (let i = 0; i < 50; i++) {
        const x = (i * 123 + Date.now() * 0.01) % canvas.width;
        const y = (i * 456 + Date.now() * 0.02) % canvas.height;
        ctx.fillRect(x, y, 2, 2);
      }

      // Player
      const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 0.8;
      const gradient = ctx.createRadialGradient(data.player.x, data.player.y, 0, data.player.x, data.player.y, data.player.size);
      gradient.addColorStop(0, `rgba(169, 116, 255, ${pulse})`);
      gradient.addColorStop(0.5, `rgba(139, 92, 246, ${pulse * 0.7})`);
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(data.player.x, data.player.y, data.player.size, 0, Math.PI * 2);
      ctx.fill();

      // Player movement
      if (data.keys['ArrowLeft'] || data.keys['a']) data.player.x = Math.max(data.player.size, data.player.x - 5);
      if (data.keys['ArrowRight'] || data.keys['d']) data.player.x = Math.min(canvas.width - data.player.size, data.player.x + 5);
      if (data.keys['ArrowUp'] || data.keys['w']) data.player.y = Math.max(data.player.size, data.player.y - 5);
      if (data.keys['ArrowDown'] || data.keys['s']) data.player.y = Math.min(canvas.height - data.player.size, data.player.y + 5);

      // Auto shoot every 200ms
      if (Date.now() - data.lastShot > 200) {
        data.projectiles.push({
          x: data.player.x,
          y: data.player.y - data.player.size,
          size: 8,
          speed: 8
        });
        data.lastShot = Date.now();
      }

      // Projectiles
      data.projectiles = data.projectiles.filter(p => {
        p.y -= p.speed;
        
        ctx.fillStyle = '#E6D4FF';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#A974FF';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        return p.y > -p.size;
      });

      // Enemies
      data.enemies = data.enemies.filter(enemy => {
        enemy.y += enemy.speed;

        ctx.fillStyle = enemy.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'white';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(enemy.type.toUpperCase(), enemy.x, enemy.y + 4);

        // Collision with projectiles
        data.projectiles.forEach((p, pIndex) => {
          const dist = Math.hypot(p.x - enemy.x, p.y - enemy.y);
          if (dist < p.size + enemy.size) {
            enemy.hp--;
            data.projectiles.splice(pIndex, 1);
            
            if (enemy.hp <= 0) {
              // Create particles
              for (let i = 0; i < 20; i++) {
                data.particles.push({
                  x: enemy.x,
                  y: enemy.y,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  size: Math.random() * 4 + 2,
                  color: enemy.color,
                  life: 1
                });
              }
              
              // Show affirmation
              const affirmations = AFFIRMATIONS[enemy.type];
              data.affirmations.push({
                text: affirmations[Math.floor(Math.random() * affirmations.length)],
                x: enemy.x,
                y: enemy.y,
                life: 1
              });
              
              data.enemiesDefeated++;
              setScore(s => s + level * 10);
              
              return false;
            }
          }
        });

        // Collision with player
        const distToPlayer = Math.hypot(enemy.x - data.player.x, enemy.y - data.player.y);
        if (distToPlayer < enemy.size + data.player.size) {
          setHp(h => Math.max(0, h - 20));
          return false;
        }

        return enemy.y < canvas.height + enemy.size;
      });

      // Particles
      data.particles = data.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = 1;

        return p.life > 0;
      });

      // Affirmations
      data.affirmations = data.affirmations.filter(aff => {
        aff.life -= 0.01;
        aff.y -= 1;
        
        ctx.font = 'bold 24px Poppins';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.globalAlpha = aff.life;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#A974FF';
        ctx.fillText(aff.text, aff.x, aff.y);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        return aff.life > 0;
      });

      // Check level complete
      if (data.enemies.length === 0 && data.enemiesDefeated >= 8 + level * 3) {
        setGameState('levelComplete');
        cancelAnimationFrame(gameLoopRef.current);
        return;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (hp <= 0 && gameState === 'playing') {
      setGameState('gameOver');
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
  }, [hp, gameState]);

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
      gameTitle="Chakra Blaster"
      gameDescription="Release emotional challenges through cosmic battle"
      canvasRef={canvasRef}
      gameState={gameState}
      setGameState={setGameState}
      level={level}
      score={score}
      hp={hp}
      startGame={startGame}
      nextLevel={nextLevel}
      restartGame={restartGame}
      gameType="chakra_blaster"
      userEmail={user?.email}
    >
      <h2 className="text-3xl font-bold text-white mb-6">Release Your Challenges</h2>
      <p className="text-slate-300 mb-4">Use arrow keys or WASD to move</p>
      <p className="text-slate-300 mb-4">Auto-fires light beams rapidly</p>
      <p className="text-amber-300 mb-8 font-semibold">Defeat all emotional enemies to level up!</p>
    </BaseGame>
  );
}