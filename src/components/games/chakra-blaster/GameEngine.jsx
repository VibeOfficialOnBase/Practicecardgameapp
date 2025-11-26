import { Player } from './Player';
import { Enemy } from './Enemy';
import { Boss } from './Boss';
import { Bullet } from './Bullet';
import { ParticleSystem } from './ParticleSystem';
import { Affirmation } from './Affirmation';
import { LevelManager } from './LevelManager';
import { achievementTracker } from './AchievementSystem';

export class ChakraBlasterGame {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = options;
    
    // Set canvas size
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Game state
    this.isRunning = false;
    this.isPaused = false;
    this.frame = 0;
    this.score = 0;
    this.coins = 0;
    this.noDamageFrames = 0;
    
    // Game entities
    this.player = null; // Player object (logic only)
    this.playerRef = null; // DOM element ref for player
    this.enemies = [];
    this.bullets = [];
    this.particles = new ParticleSystem();
    this.affirmations = [];
    
    // Level management
    this.levelManager = new LevelManager(options.level || 1, options.upgrades || {});
    this.currentWave = 0;
    this.enemiesSpawned = 0;
    
    // Input handling
    this.keys = {};
    this.mouse = { x: 0, y: 0, down: false };
    this.touch = { x: 0, y: 0, active: false };
    
    this.setupInput();
  }
  
  // Set the DOM element for the player
  setPlayerElement(element) {
    this.playerRef = element;
  }

  resize() {
    // Full-screen responsive sizing
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }
  
  setupInput() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.player?.shoot();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
    
    // Mouse
    this.canvas.addEventListener('mousedown', (e) => {
      this.mouse.down = true;
      this.updateMousePosition(e);
      this.player?.shoot();
    });
    
    this.canvas.addEventListener('mouseup', () => {
      this.mouse.down = false;
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      this.updateMousePosition(e);
    });
    
    // Touch
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.touch.active = true;
      this.updateTouchPosition(e.touches[0]);
      this.player?.shoot();
    });
    
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.touch.active = false;
    });
    
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.updateTouchPosition(e.touches[0]);
    });
  }
  
  updateMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }
  
  updateTouchPosition(touch) {
    const rect = this.canvas.getBoundingClientRect();
    this.touch.x = touch.clientX - rect.left;
    this.touch.y = touch.clientY - rect.top;
  }
  
  start() {
    this.isRunning = true;
    this.isPaused = false;
    
    // Create player with upgrade stats
    const maxHealth = 3 + (this.options.upgrades?.extraLives || 0);
    this.player = new Player(this.width / 2, this.height - 100, this.options.upgrades || {});
    this.player.maxHealth = maxHealth;
    this.player.health = maxHealth;
    
    // Start game loop
    this.gameLoop();
  }
  
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.isPaused = false;
    this.gameLoop();
  }
  
  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
  
  gameLoop(timestamp) {
    if (!this.isRunning || this.isPaused) return;

    if (!this.lastTime) {
      this.lastTime = timestamp;
    }
    const deltaTime = (timestamp - this.lastTime) / 1000; // Delta time in seconds
    this.lastTime = timestamp;
    
    this.update(deltaTime);
    this.render();
    
    this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));
  }
  
  update(deltaTime) {
    this.frame++;
    
    // Update player
    if (this.player) {
      // Handle movement
      let dx = 0;
      let dy = 0;
      
      if (this.keys['arrowleft'] || this.keys['a']) dx -= 1;
      if (this.keys['arrowright'] || this.keys['d']) dx += 1;
      if (this.keys['arrowup'] || this.keys['w']) dy -= 1;
      if (this.keys['arrowdown'] || this.keys['s']) dy += 1;
      
      // Touch movement (simple follow or relative)
      if (this.touch.active) {
        // Simple follow logic with easing
        const targetX = this.touch.x;
        const targetY = this.touch.y;

        // Move towards touch
        const diffX = targetX - this.player.x;
        const diffY = targetY - this.player.y;

        // Normalize speed
        const dist = Math.sqrt(diffX*diffX + diffY*diffY);
        if (dist > 5) {
             dx = diffX / dist;
             dy = diffY / dist;
        }
      }
      
      this.player.move(dx, dy, this.width, this.height);
      this.player.update();

      // Sync DOM element position
      if (this.playerRef) {
          this.playerRef.style.transform = `translate3d(${this.player.x - 20}px, ${this.player.y - 20}px, 0)`; // Assuming 40x40 player
      }
      
      // Update health callback
      if (this.options.onHealthUpdate) {
        this.options.onHealthUpdate(this.player.health, this.player.maxHealth);
      }
      
      // Auto-shoot with fire rate upgrade
      const fireRateBonus = this.options.upgrades?.fireRate || 0;
      const shootInterval = Math.max(10, 30 - fireRateBonus * 3);
      if (this.frame % shootInterval === 0) {
        const blastStrength = this.options.premiumPerks?.blastStrength || 1;
        this.bullets.push(...this.player.shoot(blastStrength));
        achievementTracker.trackShot();
      }
      
      // Track no damage time
      this.noDamageFrames++;
      const noDamageSeconds = Math.floor(this.noDamageFrames / 60);
      if (this.noDamageFrames % 60 === 0) {
        const achievements = achievementTracker.trackNoDamageTime(noDamageSeconds);
        if (achievements.length > 0 && this.options.onAchievementUnlock) {
          this.options.onAchievementUnlock(achievements);
        }
      }
    }
    
    // Spawn enemies
    this.spawnEnemies();
    
    // Update bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.update();
      return bullet.y > 0 && bullet.y < this.height && bullet.x > 0 && bullet.x < this.width;
    });
    
    // Update enemies
    this.enemies.forEach(enemy => {
      enemy.update(this.player);
    });
    
    // Check collisions
    this.checkCollisions();
    
    // Update particles
    this.particles.update();
    
    // Update affirmations
    this.affirmations = this.affirmations.filter(aff => {
      aff.update();
      return aff.alpha > 0;
    });
    
    // Check level completion
    if (this.levelManager.isLevelComplete(this.enemiesSpawned, this.enemies.length)) {
      this.completeLevel();
    }
    
    // Check game over
    if (this.player && this.player.health <= 0) {
      this.gameOver();
    }
  }
  
  spawnEnemies() {
    const spawnData = this.levelManager.getSpawnData(this.frame);
    
    if (spawnData && this.enemiesSpawned < this.levelManager.getTotalEnemies()) {
      const enemy = spawnData.isBoss 
        ? new Boss(
            Math.random() * this.width,
            -50,
            spawnData.type,
            this.levelManager.level
          )
        : new Enemy(
            Math.random() * this.width,
            -50,
            spawnData.type,
            this.levelManager.level
          );
      
      this.enemies.push(enemy);
      this.enemiesSpawned++;
    }
    
    // Continuous spawning to keep action flowing, but more controlled
    const maxEnemies = Math.min(5 + Math.floor(this.levelManager.level / 2), 12);
    if (this.enemies.length < maxEnemies && this.frame % 100 === 0) {
      const types = ['fear', 'doubt', 'worry', 'anger', 'sadness', 'jealousy'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const enemy = new Enemy(
        Math.random() * this.width,
        -50,
        randomType,
        this.levelManager.level
      );
      this.enemies.push(enemy);
    }
  }
  
  checkCollisions() {
    // Bullets vs Enemies
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        
        if (this.checkCircleCollision(bullet, enemy)) {
          enemy.hit(bullet.damage);
          this.bullets.splice(i, 1);
          
          // Create hit particles
          this.particles.burst(enemy.x, enemy.y, enemy.color, 5);
          
          if (enemy.health <= 0) {
            // Enemy destroyed
            this.score += enemy.points;
            this.coins += enemy.coins;
            this.options.onScoreUpdate?.(this.score);
            this.options.onCoinsUpdate?.(enemy.coins);
            
            // Track achievement progress
            let achievements = [];
            if (enemy.type) {
              achievements = achievements.concat(achievementTracker.trackEnemyKill(enemy.type));
            }
            if (enemy.isBoss) {
              achievements = achievements.concat(achievementTracker.trackBossKill());
            }
            achievements = achievements.concat(achievementTracker.trackCoins(enemy.coins));
            achievements = achievements.concat(achievementTracker.trackScore(this.score));
            
            if (achievements.length > 0 && this.options.onAchievementUnlock) {
              this.options.onAchievementUnlock(achievements);
            }
            
            // Show affirmation
            const affirmation = new Affirmation(
              enemy.x,
              enemy.y,
              enemy.affirmation,
              enemy.color
            );
            this.affirmations.push(affirmation);
            
            // Big explosion
            this.particles.burst(enemy.x, enemy.y, enemy.color, 20);
            
            this.enemies.splice(j, 1);
          }
          
          break;
        }
      }
    }
    
    // Enemies vs Player
    if (this.player) {
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i];
        
        if (this.checkCircleCollision(this.player, enemy)) {
          this.player.hit(1);
          this.enemies.splice(i, 1);
          this.particles.burst(enemy.x, enemy.y, '#ff4444', 15);
          this.screenShake = 10;
          
          // Reset no damage timer
          this.noDamageFrames = 0;
          achievementTracker.resetNoDamageTime();
        }
      }
    }
  }
  
  checkCircleCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Add a small buffer for more forgiving collisions
    return distance < (a.radius || 10) + (b.radius || 15) - 2;
  }
  
  completeLevel() {
    this.stop();
    
    // Track level achievements
    const achievements = achievementTracker.trackLevel(this.levelManager.level)
      .concat(achievementTracker.trackLevelComplete());
    
    if (achievements.length > 0 && this.options.onAchievementUnlock) {
      this.options.onAchievementUnlock(achievements);
    }
    
    this.options.onLevelComplete?.({
      level: this.levelManager.level,
      score: this.score,
      coins: this.coins
    });
  }
  
  gameOver() {
    this.stop();
    this.options.onGameOver?.(this.score);
  }
  
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    // this.ctx.fillStyle = 'rgba(10, 5, 30, 0.3)';
    // this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw starfield effect
    this.drawStars();
    
    // Draw particles (background layer)
    this.particles.render(this.ctx);
    
    // Player is now a DOM element, so we don't draw it here unless we want debug info or effects under it
    // But we might want to draw a glow or shield around the player position
    if (this.player) {
        // Draw shield or glow effects on canvas
        // this.player.renderEffects(this.ctx);
    }
    
    // Draw bullets
    this.bullets.forEach(bullet => bullet.render(this.ctx));
    
    // Draw enemies
    this.enemies.forEach(enemy => enemy.render(this.ctx));
    
    // Draw affirmations
    this.affirmations.forEach(aff => aff.render(this.ctx));
  }
  
  drawStars() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5) % this.width;
      const y = ((this.frame + i * 20) % this.height);
      this.ctx.fillRect(x, y, 2, 2);
    }
  }
}
