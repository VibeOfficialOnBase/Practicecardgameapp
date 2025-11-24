// Challenge Bubbles - Shooter Mechanics

export class BubbleShooter {
  constructor(x, y, bubbleRadius) {
    this.x = x;
    this.y = y;
    this.bubbleRadius = bubbleRadius;
    this.angle = -Math.PI / 2;
    this.currentBubble = null;
    this.nextBubble = null;
    this.shootingBubble = null;
    this.phase = 0;
    
    this.generateNextBubbles();
  }
  
  generateNextBubbles() {
    const types = ['anger', 'regret', 'fear', 'anxiety', 'sadness', 'doubt', 'overthinking'];
    if (!this.currentBubble) {
      this.currentBubble = types[Math.floor(Math.random() * types.length)];
    }
    this.nextBubble = types[Math.floor(Math.random() * types.length)];
  }
  
  setAngle(targetX, targetY) {
    this.angle = Math.atan2(targetY - this.y, targetX - this.x);
    this.angle = Math.max(-Math.PI + 0.1, Math.min(-0.1, this.angle));
  }
  
  shoot() {
    if (this.shootingBubble || !this.currentBubble) return null;
    
    this.shootingBubble = {
      type: this.currentBubble,
      x: this.x,
      y: this.y,
      vx: Math.cos(this.angle) * 15,
      vy: Math.sin(this.angle) * 15,
      radius: this.bubbleRadius
    };
    
    this.currentBubble = this.nextBubble;
    this.generateNextBubbles();
    
    return this.shootingBubble;
  }
  
  update(width, height) {
    this.phase += 0.1;
    
    if (this.shootingBubble) {
      this.shootingBubble.x += this.shootingBubble.vx;
      this.shootingBubble.y += this.shootingBubble.vy;
      
      // Wall bounce
      if (this.shootingBubble.x - this.bubbleRadius < 0 || this.shootingBubble.x + this.bubbleRadius > width) {
        this.shootingBubble.vx *= -1;
        this.shootingBubble.x = Math.max(this.bubbleRadius, Math.min(width - this.bubbleRadius, this.shootingBubble.x));
      }
      
      // Out of bounds
      if (this.shootingBubble.y < -this.bubbleRadius) {
        this.shootingBubble = null;
      }
    }
  }
  
  render(ctx, bubbleTypes) {
    // Player (meditating figure)
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Aura
    const auraGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
    auraGradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
    auraGradient.addColorStop(0.5, 'rgba(107, 140, 255, 0.2)');
    auraGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = auraGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // Body glow
    const scale = 1 + Math.sin(this.phase) * 0.05;
    ctx.scale(scale, scale);
    
    // Meditating figure
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(0, -10, 15, 0, Math.PI * 2); // Head
    ctx.fill();
    
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.ellipse(0, 10, 18, 25, 0, 0, Math.PI * 2); // Body
    ctx.fill();
    
    ctx.restore();
    
    // Aim line
    if (!this.shootingBubble) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + Math.cos(this.angle) * 200, this.y + Math.sin(this.angle) * 200);
      ctx.stroke();
      ctx.restore();
    }
    
    // Current bubble
    if (this.currentBubble && !this.shootingBubble) {
      const type = bubbleTypes[this.currentBubble];
      ctx.fillStyle = type.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y - 40, this.bubbleRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.font = `${this.bubbleRadius}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(type.emoji, this.x, this.y - 40);
    }
    
    // Next bubble preview
    if (this.nextBubble) {
      const type = bubbleTypes[this.nextBubble];
      ctx.fillStyle = type.color + '88';
      ctx.beginPath();
      ctx.arc(this.x + 60, this.y, this.bubbleRadius * 0.7, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.font = `${this.bubbleRadius * 0.7}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(type.emoji, this.x + 60, this.y);
    }
    
    // Shooting bubble
    if (this.shootingBubble) {
      const type = bubbleTypes[this.shootingBubble.type];
      
      // Trail
      ctx.fillStyle = type.color + '33';
      ctx.beginPath();
      ctx.arc(this.shootingBubble.x, this.shootingBubble.y, this.bubbleRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = type.color;
      ctx.beginPath();
      ctx.arc(this.shootingBubble.x, this.shootingBubble.y, this.bubbleRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.font = `${this.bubbleRadius}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(type.emoji, this.shootingBubble.x, this.shootingBubble.y);
    }
  }
}