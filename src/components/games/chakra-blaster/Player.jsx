import { Bullet } from './Bullet';

export class Player {
  constructor(x, y, upgrades = {}) {
    this.x = x;
    this.y = y;
    this.radius = 30; // Larger for full-screen
    this.speed = 6 + (upgrades.attackSpeed || 0) * 0.5; // Speed boost from upgrades
    this.health = 3 + (upgrades.maxHealth || 0);
    this.maxHealth = 3 + (upgrades.maxHealth || 0);
    this.upgrades = upgrades;
    
    // Enhanced visual properties
    this.glowPulse = 0;
    this.auraRotation = 0;
    this.breathePhase = 0;
    this.chakraPulse = 0;
    
    // Shooting
    this.canShoot = true;
    this.shootCooldown = 10 - (upgrades.attackSpeed || 0) * 2;
    this.cooldownTimer = 0;
  }
  
  move(dx, dy, maxWidth, maxHeight) {
    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }
    
    // Smooth interpolation
    const targetX = this.x + dx * this.speed;
    const targetY = this.y + dy * this.speed;
    
    this.x += (targetX - this.x) * 0.3;
    this.y += (targetY - this.y) * 0.3;
    
    // Keep player in bounds
    this.x = Math.max(this.radius, Math.min(maxWidth - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(maxHeight - this.radius, this.y));
  }
  
  update() {
    // Update visual effects
    this.glowPulse += 0.1;
    this.auraRotation += 0.02;
    this.breathePhase += 0.05;
    this.chakraPulse += 0.08;
    
    // Update cooldown
    if (this.cooldownTimer > 0) {
      this.cooldownTimer--;
      if (this.cooldownTimer === 0) {
        this.canShoot = true;
      }
    }
  }
  
  shoot(blastStrength = 1) {
    if (!this.canShoot) return [];
    
    this.canShoot = false;
    this.cooldownTimer = this.shootCooldown;
    
    const bullets = [];
    const bulletSize = 5 + (this.upgrades.bulletSize || 0) * 3;
    const damage = 1 + (this.upgrades.bulletSize || 0) * 0.8; // Stronger bullets from upgrades
    
    // Create bullet(s)
    bullets.push(new Bullet(this.x, this.y - this.radius, 0, -10, bulletSize, damage, blastStrength));
    
    // Special: Triple shot at higher levels
    if (this.upgrades.specialPower >= 1) {
      bullets.push(new Bullet(this.x, this.y - this.radius, -3, -10, bulletSize, damage, blastStrength));
      bullets.push(new Bullet(this.x, this.y - this.radius, 3, -10, bulletSize, damage, blastStrength));
    }
    
    return bullets;
  }
  
  hit(damage) {
    this.health -= damage;
    if (this.health < 0) this.health = 0;
  }
  
  render(ctx, premiumAura = null) {
    // Breathing animation scale
    const breatheScale = 1 + Math.sin(this.breathePhase) * 0.05;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(breatheScale, breatheScale);
    
    // Premium aura effects
    if (premiumAura?.vibe) {
      const vibeGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 5);
      vibeGlow.addColorStop(0, 'rgba(147, 51, 234, 0.6)');
      vibeGlow.addColorStop(0.3, 'rgba(255, 215, 0, 0.3)');
      vibeGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = vibeGlow;
      ctx.fillRect(-this.radius * 5, -this.radius * 5, this.radius * 10, this.radius * 10);
    }
    
    if (premiumAura?.algo) {
      const algoGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 5.5);
      algoGlow.addColorStop(0, 'rgba(6, 182, 212, 0.6)');
      algoGlow.addColorStop(0.3, 'rgba(0, 255, 255, 0.3)');
      algoGlow.addColorStop(1, 'rgba(0, 255, 255, 0)');
      ctx.fillStyle = algoGlow;
      ctx.fillRect(-this.radius * 5.5, -this.radius * 5.5, this.radius * 11, this.radius * 11);
    }
    
    // Massive outer aura glow
    const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 4);
    outerGlow.addColorStop(0, 'rgba(169, 116, 255, 0.5)');
    outerGlow.addColorStop(0.3, 'rgba(169, 116, 255, 0.2)');
    outerGlow.addColorStop(1, 'rgba(169, 116, 255, 0)');
    ctx.fillStyle = outerGlow;
    ctx.fillRect(-this.radius * 4, -this.radius * 4, this.radius * 8, this.radius * 8);
    
    // Rotating chakra rings
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate(this.auraRotation + (i * Math.PI * 2 / 5));
      const ringAlpha = 0.4 + Math.sin(this.glowPulse + i) * 0.3;
      ctx.strokeStyle = `rgba(242, 214, 255, ${ringAlpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 20 + Math.sin(this.glowPulse + i) * 8, 0, Math.PI * 1.5);
      ctx.stroke();
      ctx.restore();
    }
    
    // Chakra pulse waves
    const chakraSize = this.radius * (1 + Math.sin(this.chakraPulse) * 0.3);
    const chakraGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, chakraSize);
    chakraGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    chakraGlow.addColorStop(0.5, 'rgba(242, 214, 255, 0.6)');
    chakraGlow.addColorStop(1, 'rgba(169, 116, 255, 0)');
    ctx.fillStyle = chakraGlow;
    ctx.beginPath();
    ctx.arc(0, 0, chakraSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Main body silhouette
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(169, 116, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Peace symbol
    ctx.fillStyle = '#4A1C8C';
    ctx.font = `bold ${this.radius * 1.2}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☮', 0, 0);
    
    ctx.restore();
  }
}