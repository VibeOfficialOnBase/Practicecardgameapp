export class Boss {
  constructor(x, y, type, level) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.level = level;
    this.radius = 50;
    this.isBoss = true;
    
    // Boss properties
    this.health = 20 + level * 5;
    this.maxHealth = this.health;
    this.speed = 1;
    this.points = 1000 * level;
    this.coins = 50;
    this.name = 'Shadow Boss';
    
    // Boss visual
    this.color = '#ff0088';
    this.affirmation = 'I am free from deep pain.';
    
    // Movement
    this.direction = 1;
    this.attackCooldown = 0;
    
    // Visual effects
    this.pulsePhase = 0;
    this.shieldRotation = 0;
  }
  
  update(player) {
    // Boss movement pattern
    this.y += this.speed * 0.5;
    
    if (this.y > 150) {
      this.x += this.speed * 2 * this.direction;
      
      if (this.x < 100 || this.x > 700) {
        this.direction *= -1;
      }
    }
    
    // Visual updates
    this.pulsePhase += 0.05;
    this.shieldRotation += 0.03;
    
    // Attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    }
  }
  
  hit(damage) {
    this.health -= damage;
  }
  
  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Draw massive glow
    const glowRadius = this.radius * (2 + Math.sin(this.pulsePhase) * 0.5);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
    gradient.addColorStop(0, this.color + 'cc');
    gradient.addColorStop(0.3, this.color + '66');
    gradient.addColorStop(0.6, this.color + '22');
    gradient.addColorStop(1, this.color + '00');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw rotating shield segments
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate(this.shieldRotation + (i * Math.PI * 2 / 6));
      
      ctx.strokeStyle = this.color + 'aa';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 20, 0, Math.PI / 3);
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw main body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Pulsing inner energy
    const pulseSize = this.radius * 0.6 * (1 + Math.sin(this.pulsePhase * 2) * 0.3);
    ctx.fillStyle = this.color + '88';
    ctx.beginPath();
    ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Health bar (above boss)
    const barWidth = 200;
    const barHeight = 20;
    const barX = this.x - barWidth / 2;
    const barY = this.y - this.radius - 40;
    
    // Boss name
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.fillText(this.name, this.x, barY - 10);
    ctx.shadowBlur = 0;
    
    // Health bar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
    
    // Health bar fill
    const healthPercent = this.health / this.maxHealth;
    const healthColor = healthPercent > 0.5 ? '#44ff44' : (healthPercent > 0.25 ? '#ffaa44' : '#ff4444');
    ctx.fillStyle = healthColor;
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Health bar border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }
}