// Enemy projectiles for Anger enemies

export class EnemyBullet {
  constructor(x, y, targetX, targetY, speed = 5) {
    this.x = x;
    this.y = y;
    this.radius = 8;
    this.speed = speed;
    this.damage = 1;
    
    // Calculate direction to player
    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
    
    this.color = '#ff4444';
    this.phase = 0;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.phase += 0.2;
  }
  
  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 2);
    gradient.addColorStop(0, 'rgba(255, 68, 68, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 68, 68, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 68, 68, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Core with pulse
    const scale = 1 + Math.sin(this.phase) * 0.2;
    ctx.scale(scale, scale);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  isOffScreen(width, height) {
    return this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50;
  }
}