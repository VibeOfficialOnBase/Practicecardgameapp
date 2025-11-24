class Particle {
  constructor(x, y, color, vx, vy, life) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.size = 2 + Math.random() * 3;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2; // Gravity
    this.life--;
  }
  
  render(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    
    // Glow effect
    ctx.fillStyle = this.color + Math.floor(alpha * 100).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * alpha * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }
  
  burst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const life = 30 + Math.random() * 30;
      
      this.particles.push(new Particle(x, y, color, vx, vy, life));
    }
  }
  
  update() {
    this.particles = this.particles.filter(p => {
      p.update();
      return p.life > 0;
    });
  }
  
  render(ctx) {
    this.particles.forEach(p => p.render(ctx));
  }
}