
export class Bullet {
  constructor(x, y, vx, vy, size = 5, damage = 1, blastStrength = 1) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = size;
    this.damage = damage * blastStrength;
    
    // Visual properties
    this.color = blastStrength > 1 ? '#00ffff' : '#ffffff';
    this.glowColor = blastStrength > 1 ? '#06b6d4' : '#a974ff';
    this.trailPositions = [];
  }
  
  update() {
    // Store trail position
    this.trailPositions.push({ x: this.x, y: this.y });
    if (this.trailPositions.length > 5) {
      this.trailPositions.shift();
    }
    
    // Move bullet
    this.x += this.vx;
    this.y += this.vy;
  }
  
  render(ctx) {
    // Draw trail
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < this.trailPositions.length; i++) {
      const pos = this.trailPositions[i];
      const alpha = (i + 1) / this.trailPositions.length;
      
      ctx.fillStyle = this.glowColor;
      ctx.globalAlpha = alpha * 0.5;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // Draw glow
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius * 3
    );
    gradient.addColorStop(0, this.glowColor + 'ff');
    gradient.addColorStop(0.5, this.glowColor + '66');
    gradient.addColorStop(1, this.glowColor + '00');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw bullet core
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw bright center
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
