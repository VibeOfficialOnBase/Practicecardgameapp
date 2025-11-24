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
    enemyProjectiles: [],
    particles: [],
    affirmations: [],
    keys: {},
    lastShot: 0,
    enemiesDefeated: 0,
    isBossActive: false,
    boss: null,
    bossProjectiles: []
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

  const spawnBoss = (canvas, level) => {
    return {
      x: canvas.width / 2,
      y: -100, // Start off screen
      targetY: 100,
      size: 80,
      type: 'anger', // Boss is "Anger" as requested
      color: '#ef4444',
      hp: 50 + (level * 20),
      maxHp: 50 + (level * 20),
      phase: 0,
      lastAttack: 0
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
    data.enemyProjectiles = [];
    data.particles = [];
    data.affirmations = [];
    data.enemiesDefeated = 0;
    data.isBossActive = false;
    data.boss = null;
    
    setHp(100);
    setGameState('playing');

    const enemyCount = 8 + level * 3;
    let enemiesSpawned = 0;

    // Spawn enemies periodically until count reached
    const spawner = setInterval(() => {
        if (gameState !== 'playing' || data.isBossActive) {
            clearInterval(spawner);
            return;
        }
        if (enemiesSpawned < enemyCount) {
            data.enemies.push(spawnEnemy(canvas, level));
            enemiesSpawned++;
        } else {
            clearInterval(spawner);
        }
    }, 800);

    const gameLoop = () => {
      if (gameState !== 'playing') return;

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

      // Improved Player movement speed and responsiveness
      const speed = 8; // Increased from 5
      if (data.keys['ArrowLeft'] || data.keys['a']) data.player.x = Math.max(data.player.size, data.player.x - speed);
      if (data.keys['ArrowRight'] || data.keys['d']) data.player.x = Math.min(canvas.width - data.player.size, data.player.x + speed);
      if (data.keys['ArrowUp'] || data.keys['w']) data.player.y = Math.max(data.player.size, data.player.y - speed);
      if (data.keys['ArrowDown'] || data.keys['s']) data.player.y = Math.min(canvas.height - data.player.size, data.player.y + speed);

      // Auto shoot every 200ms
      if (Date.now() - data.lastShot > 200) {
        data.projectiles.push({
          x: data.player.x,
          y: data.player.y - data.player.size,
          size: 8,
          speed: 10 // Faster projectiles
        });
        data.lastShot = Date.now();
      }

      // Player Projectiles
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

      // Boss Logic
      if (data.isBossActive && data.boss) {
          const boss = data.boss;

          // Move boss into position
          if (boss.y < boss.targetY) {
              boss.y += 2;
          } else {
              // Boss movement pattern (swaying)
              boss.x += Math.sin(Date.now() * 0.002) * 2;
          }

          // Render Boss
          ctx.save();
          ctx.shadowBlur = 20;
          ctx.shadowColor = boss.color;
          ctx.fillStyle = boss.color;
          ctx.beginPath();
          ctx.arc(boss.x, boss.y, boss.size, 0, Math.PI * 2);
          ctx.fill();

          // Boss HP Bar
          ctx.fillStyle = '#333';
          ctx.fillRect(boss.x - 50, boss.y - boss.size - 20, 100, 10);
          ctx.fillStyle = '#f00';
          ctx.fillRect(boss.x - 50, boss.y - boss.size - 20, 100 * (boss.hp / boss.maxHp), 10);

          ctx.fillStyle = 'white';
          ctx.font = 'bold 16px Inter';
          ctx.textAlign = 'center';
          ctx.fillText("ANGER", boss.x, boss.y + 5);
          ctx.restore();

          // Boss Attacks
          if (Date.now() - boss.lastAttack > 1500) {
             // Shoot projectile at player
             const angle = Math.atan2(data.player.y - boss.y, data.player.x - boss.x);
             data.enemyProjectiles.push({
                 x: boss.x,
                 y: boss.y + boss.size,
                 vx: Math.cos(angle) * 5,
                 vy: Math.sin(angle) * 5,
                 size: 10,
                 color: '#ffaa00'
             });
             boss.lastAttack = Date.now();
          }

          // Collision with player projectiles
           data.projectiles.forEach((p, pIndex) => {
            const dist = Math.hypot(p.x - boss.x, p.y - boss.y);
            if (dist < p.size + boss.size) {
              boss.hp--;
              data.projectiles.splice(pIndex, 1);

              // Hit effect
              ctx.fillStyle = 'white';
              ctx.globalAlpha = 0.5;
              ctx.beginPath();
              ctx.arc(boss.x, boss.y, boss.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1;

              if (boss.hp <= 0) {
                 // Boss Defeated
                 for (let i = 0; i < 50; i++) {
                    data.particles.push({
                      x: boss.x,
                      y: boss.y,
                      vx: (Math.random() - 0.5) * 15,
                      vy: (Math.random() - 0.5) * 15,
                      size: Math.random() * 6 + 4,
                      color: boss.color,
                      life: 2
                    });
                  }
                  data.affirmations.push({
                    text: "I HAVE PEACE!",
                    x: boss.x,
                    y: boss.y,
                    life: 2
                  });
                  data.boss = null;
                  data.isBossActive = false;
                  setScore(s => s + 500);

                  // Level Complete after boss
                  setTimeout(() => {
                      setGameState('levelComplete');
                  }, 2000);
              }
            }
          });
      }

      // Enemy Projectiles
      data.enemyProjectiles = data.enemyProjectiles.filter(p => {
          p.x += p.vx;
          p.y += p.vy;

          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Collision with player
          const distToPlayer = Math.hypot(p.x - data.player.x, p.y - data.player.y);
          if (distToPlayer < p.size + data.player.size) {
              setHp(h => Math.max(0, h - 15));
              return false;
          }

          return p.y < canvas.height && p.y > 0 && p.x > 0 && p.x < canvas.width;
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

      // Check for Boss Spawn
      if (data.enemies.length === 0 && data.enemiesDefeated >= enemyCount && !data.isBossActive && !data.boss) {
         data.isBossActive = true;
         data.boss = spawnBoss(canvas, level);
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
      <p className="text-amber-300 mb-8 font-semibold">Defeat the Anger Boss to level up!</p>
    </BaseGame>
  );
}
