// Enemy types with their properties
const ENEMY_TYPES = {
  anger: {
    name: 'Anger',
    color: '#ff4444',
    speed: 2,
    health: 2,
    points: 100,
    coins: 5,
    affirmations: [
      'I release anger.',
      'I am calm.',
      'I choose peace.',
      'I am in control.',
      'I breathe and let go.'
    ],
    pattern: 'rush'
  },
  fear: {
    name: 'Fear',
    color: '#4444ff',
    speed: 3,
    health: 1,
    points: 150,
    coins: 7,
    affirmations: [
      'I am safe.',
      'I trust my path.',
      'I am protected.',
      'I face this with courage.',
      'I am stronger than fear.'
    ],
    pattern: 'zigzag'
  },
  regret: {
    name: 'Regret',
    color: '#aa44aa',
    speed: 1.5,
    health: 3,
    points: 200,
    coins: 10,
    affirmations: [
      'I honor my past growth.',
      'I forgive myself.',
      'The past is a teacher.',
      'I am growing every day.',
      'I release what was.'
    ],
    pattern: 'slow'
  },
  sadness: {
    name: 'Sadness',
    color: '#4488ff',
    speed: 1,
    health: 2,
    points: 120,
    coins: 6,
    affirmations: [
      'I am held.',
      'This too shall pass.',
      'I allow myself to feel.',
      'I am healing.',
      'Joy is returning to me.'
    ],
    pattern: 'orbit'
  },
  guilt: {
    name: 'Guilt',
    color: '#ff8844',
    speed: 2.5,
    health: 2,
    points: 180,
    coins: 8,
    affirmations: [
      'I am worthy of forgiveness.',
      'I did my best.',
      'I am learning.',
      'I choose self-compassion.',
      'I release blame.'
    ],
    pattern: 'wave'
  },
  shame: {
    name: 'Shame',
    color: '#884444',
    speed: 2,
    health: 3,
    points: 250,
    coins: 12,
    affirmations: [
      'I am enough.',
      'I accept myself.',
      'I am worthy of love.',
      'My worth is inherent.',
      'I embrace who I am.'
    ],
    pattern: 'spiral'
  },
  anxiety: {
    name: 'Anxiety',
    color: '#ffff44',
    speed: 4,
    health: 1,
    points: 130,
    coins: 6,
    affirmations: [
      'I am grounded.',
      'I breathe deeply.',
      'I am present now.',
      'I trust the process.',
      'I am centered.'
    ],
    pattern: 'erratic'
  },
  doubt: {
    name: 'Doubt',
    color: '#888888',
    speed: 1.8,
    health: 2,
    points: 160,
    coins: 8,
    affirmations: [
      'I trust myself.',
      'I am capable.',
      'I believe in my path.',
      'I am growing stronger.',
      'I have what I need.'
    ],
    pattern: 'slow'
  },
  envy: {
    name: 'Envy',
    color: '#44aa44',
    speed: 2.2,
    health: 2,
    points: 170,
    coins: 9,
    affirmations: [
      'I celebrate others.',
      'My journey is unique.',
      'I am grateful for what I have.',
      'I have my own gifts.',
      'There is enough for everyone.'
    ],
    pattern: 'zigzag'
  },
  loneliness: {
    name: 'Loneliness',
    color: '#6666bb',
    speed: 1.3,
    health: 3,
    points: 190,
    coins: 10,
    affirmations: [
      'I am never truly alone.',
      'Connection is available to me.',
      'I am loved.',
      'I reach out when I need.',
      'I am worthy of companionship.'
    ],
    pattern: 'orbit'
  },
  overwhelm: {
    name: 'Overwhelm',
    color: '#ff6666',
    speed: 3.5,
    health: 2,
    points: 200,
    coins: 11,
    affirmations: [
      'I take one step at a time.',
      'I pause when I need.',
      'I can handle this.',
      'I ask for help.',
      'I prioritize what matters.'
    ],
    pattern: 'erratic'
  }
};

export class Enemy {
  constructor(x, y, type, level = 1) {
    const enemyData = ENEMY_TYPES[type] || ENEMY_TYPES.anger;
    
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = 20 + level * 0.8; // Larger for full-screen
    
    // Properties based on type and level
    this.speed = enemyData.speed * (1 + level * 0.1);
    this.baseHealth = enemyData.health;
    this.health = this.baseHealth + Math.floor(level / 3);
    this.maxHealth = this.health;
    this.points = enemyData.points * level;
    this.coins = enemyData.coins;
    this.color = enemyData.color;
    this.pattern = enemyData.pattern;
    this.name = enemyData.name;
    
    // Select random affirmation
    this.affirmation = enemyData.affirmations[
      Math.floor(Math.random() * enemyData.affirmations.length)
    ];
    
    // Movement properties
    this.angle = Math.random() * Math.PI * 2;
    this.orbitRadius = 50 + Math.random() * 50;
    this.orbitSpeed = 0.02 + Math.random() * 0.02;
    this.zigzagSpeed = 3;
    this.zigzagAmplitude = 50;
    this.waveOffset = Math.random() * Math.PI * 2;
    
    // Enhanced visual properties
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.rotation = 0;
    this.animFrame = 0;
    this.idleAnim = 0;
    this.hitFlash = 0;
    
    // Shooting properties for Anger type
    this.canShoot = this.type === 'anger';
    this.shootCooldown = 0;
    this.shootInterval = 90; // frames between shots
  }
  
  update(player) {
    // Update based on movement pattern
    switch (this.pattern) {
      case 'rush':
        this.updateRush(player);
        break;
      case 'zigzag':
        this.updateZigZag();
        break;
      case 'slow':
        this.updateSlow();
        break;
      case 'orbit':
        this.updateOrbit(player);
        break;
      case 'wave':
        this.updateWave();
        break;
      case 'spiral':
        this.updateSpiral();
        break;
      case 'erratic':
        this.updateErratic();
        break;
      default:
        this.y += this.speed;
    }
    
    // Update visuals
    this.pulsePhase += 0.1;
    this.rotation += 0.05;
    this.animFrame += 0.15;
    this.idleAnim += 0.08;
    
    if (this.hitFlash > 0) {
      this.hitFlash--;
    }
    
    // Update shooting cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }
  }
  
  canShootNow() {
    return this.canShoot && this.shootCooldown <= 0;
  }
  
  shoot(playerX, playerY) {
    if (this.canShootNow()) {
      this.shootCooldown = this.shootInterval;
      return { x: this.x, y: this.y, targetX: playerX, targetY: playerY };
    }
    return null;
  }
  
  updateRush(player) {
    if (player) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;
      }
    } else {
      this.y += this.speed;
    }
  }
  
  updateZigZag() {
    this.y += this.speed;
    this.x += Math.sin(this.y * 0.05) * this.zigzagSpeed;
  }
  
  updateSlow() {
    this.y += this.speed;
  }
  
  updateOrbit(player) {
    if (player) {
      this.angle += this.orbitSpeed;
      const targetX = player.x + Math.cos(this.angle) * this.orbitRadius;
      const targetY = player.y + Math.sin(this.angle) * this.orbitRadius;
      
      const dx = targetX - this.x;
      const dy = targetY - this.y;
      
      this.x += dx * 0.05;
      this.y += dy * 0.05;
    } else {
      this.y += this.speed;
    }
  }
  
  updateWave() {
    this.y += this.speed;
    this.waveOffset += 0.05;
    this.x += Math.sin(this.waveOffset) * 2;
  }
  
  updateSpiral() {
    this.angle += 0.05;
    this.orbitRadius += 0.5;
    this.x += Math.cos(this.angle) * 2;
    this.y += this.speed + Math.sin(this.angle) * 2;
  }
  
  updateErratic() {
    this.y += this.speed;
    
    if (Math.random() < 0.1) {
      this.x += (Math.random() - 0.5) * 20;
    }
  }
  
  hit(damage) {
    this.health -= damage;
    this.hitFlash = 10; // Flash effect when hit
  }
  
  render(ctx) {
    const isHit = this.hitFlash > 0;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Type-specific animations
    if (this.type === 'anger') {
      // Fire shockwaves
      for (let i = 0; i < 3; i++) {
        const waveSize = this.radius * (2 + i * 0.5) + Math.sin(this.animFrame + i) * 10;
        const waveAlpha = 0.3 - i * 0.1;
        ctx.strokeStyle = `rgba(255, 68, 68, ${waveAlpha})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, waveSize, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (this.type === 'regret') {
      // Trailing echo
      for (let i = 1; i <= 2; i++) {
        ctx.save();
        ctx.globalAlpha = 0.3 / i;
        ctx.translate(-i * 5, -i * 5);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else if (this.type === 'fear') {
      // Erratic jitter
      const jitterX = Math.sin(this.animFrame * 3) * 3;
      const jitterY = Math.cos(this.animFrame * 4) * 3;
      ctx.translate(jitterX, jitterY);
    } else if (this.type === 'anxiety') {
      // Static crackle
      ctx.rotate(Math.sin(this.animFrame * 2) * 0.2);
    }
    
    // Main glow
    const glowRadius = this.radius * (1.8 + Math.sin(this.pulsePhase) * 0.4);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
    gradient.addColorStop(0, this.color + 'cc');
    gradient.addColorStop(0.5, this.color + '66');
    gradient.addColorStop(1, this.color + '00');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Body with hit flash
    ctx.fillStyle = isHit ? '#ffffff' : this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Animated inner core
    const coreSize = this.radius * 0.6 * (1 + Math.sin(this.idleAnim) * 0.2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Health bar with better visibility
    if (this.health < this.maxHealth) {
      const barWidth = this.radius * 2.5;
      const barHeight = 6;
      const barY = this.y - this.radius - 15;
      
      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(this.x - barWidth / 2 - 1, barY - 1, barWidth + 2, barHeight + 2);
      
      // Health
      const healthPercent = this.health / this.maxHealth;
      ctx.fillStyle = healthPercent > 0.5 ? '#44ff44' : '#ff4444';
      ctx.fillRect(
        this.x - barWidth / 2,
        barY,
        barWidth * healthPercent,
        barHeight
      );
    }
    
    // Enemy name above health bar
    ctx.save();
    ctx.fillStyle = '#F2D6FF';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 4;
    ctx.fillText(this.name, this.x, this.y - this.radius - 20);
    ctx.restore();
  }
}