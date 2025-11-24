
export class Affirmation {
  constructor(x, y, text, color) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = 1;
    this.scale = 0;
    this.life = 60; // Frames to display
  }
  
  update() {
    // Fade in and scale up
    if (this.scale < 1) {
      this.scale += 0.1;
    }
    
    // Float upward
    this.y -= 0.5;
    
    // Fade out after showing
    this.life--;
    if (this.life < 20) {
      this.alpha -= 0.05;
    }
  }
  
  render(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    
    // Keep within screen bounds
    const canvasWidth = ctx.canvas.width;
    const safeX = Math.min(Math.max(this.x, canvasWidth * 0.15), canvasWidth * 0.85);
    
    ctx.translate(safeX, this.y);
    ctx.scale(this.scale, this.scale);
    
    // Responsive font size
    const fontSize = Math.min(18, canvasWidth * 0.035);
    ctx.font = `bold ${fontSize}px sans-serif`;
    const metrics = ctx.measureText(this.text);
    const textWidth = metrics.width;
    const textHeight = fontSize + 6; // Adjusted based on new font size
    
    // Draw background glow
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, textWidth / 2 + 20);
    gradient.addColorStop(0, this.color + '44');
    gradient.addColorStop(1, this.color + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(-textWidth / 2 - 20, -textHeight / 2 - 10, textWidth + 40, textHeight + 20);
    
    // Draw text background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Changed alpha from 0.7 to 0.8
    ctx.fillRect(-textWidth / 2 - 10, -textHeight / 2 - 5, textWidth + 20, textHeight + 10);
    
    // Draw text outline
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(this.text, 0, 0);
    
    // Draw text
    ctx.fillStyle = '#FFFFFF'; // Changed from #ffffff to #FFFFFF
    ctx.fillText(this.text, 0, 0);
    
    ctx.restore();
  }
}
