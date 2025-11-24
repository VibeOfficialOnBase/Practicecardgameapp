// Challenge Bubbles - Main Game Engine

import { BubbleGrid, BUBBLE_TYPES } from './BubbleGrid';
import { BubbleShooter } from './BubbleShooter';

export class ChallengeBubblesGame {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = options;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.isRunning = false;
    this.score = 0;
    this.level = 1;
    this.affirmations = [];
    this.timer = 180; // 3 minutes
    this.timerInterval = null;
    
    this.setupInput();
  }
  
  resize() {
    // Mobile-optimized sizing
    const isMobile = window.innerWidth < 768;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Adjust grid size for mobile
    if (isMobile && this.grid) {
      this.grid.resize(this.width, this.height);
    }
  }
  
  setupInput() {
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.shooter) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.shooter.setAngle(x, y);
      }
    });
    
    this.canvas.addEventListener('click', () => {
      if (this.shooter && !this.shooter.shootingBubble) {
        this.shooter.shoot();
      }
    });
    
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (this.shooter) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        this.shooter.setAngle(x, y);
      }
    });
    
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.shooter && !this.shooter.shootingBubble) {
        this.shooter.shoot();
      }
    });
  }
  
  start() {
    this.isRunning = true;
    this.score = 0;
    this.level = 1;
    this.timer = 180;
    
    const bubbleRadius = Math.min(this.width / 8, 60) / 2;
    this.grid = new BubbleGrid(this.width, this.height, 10, 8);
    this.shooter = new BubbleShooter(this.width / 2, this.height - 80, bubbleRadius);
    this.affirmations = [];
    
    // Start timer
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.options.onTimerUpdate) {
        this.options.onTimerUpdate(this.timer);
      }
      if (this.timer <= 0) {
        this.gameOver();
      }
    }, 1000);
    
    this.gameLoop();
  }
  
  stop() {
    this.isRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  
  gameLoop() {
    if (!this.isRunning) return;
    
    this.update();
    this.render();
    
    requestAnimationFrame(() => this.gameLoop());
  }
  
  update() {
    this.grid.update();
    this.shooter.update(this.width, this.height);
    
    // Check collision with grid bubbles or top boundary
    if (this.shooter.shootingBubble) {
      const bubble = this.shooter.shootingBubble;
      let collided = false;
      
      // Check collision with existing bubbles
      for (let row = 0; row < this.grid.rows; row++) {
        for (let col = 0; col < this.grid.cols; col++) {
          const gridBubble = this.grid.grid[row][col];
          if (gridBubble) {
            const dx = bubble.x - gridBubble.x;
            const dy = bubble.y - gridBubble.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < bubble.radius * 2) {
              // Stick the bubble to the nearest empty spot
              const added = this.grid.addBubbleNearPosition(bubble.x, bubble.y, bubble.type);
              if (added) {
                this.checkMatches(added.row, added.col);
              }
              this.shooter.shootingBubble = null;
              collided = true;
              break;
            }
          }
        }
        if (collided) break;
      }
      
      // Hit top of screen
      if (!collided && bubble.y - bubble.radius <= 0) {
        const added = this.grid.addBubbleAtTop(bubble.x, bubble.type);
        if (added) {
          this.checkMatches(added.row, added.col);
        }
        this.shooter.shootingBubble = null;
      }
    }
    
    // Update affirmations
    this.affirmations = this.affirmations.filter(aff => {
      aff.y -= 1;
      aff.alpha -= 0.008;
      return aff.alpha > 0;
    });
    
    // Check game over - only if bubbles reach much lower (row 8 of 10), giving more forgiveness
    if (this.grid.hasReachedBottom(8)) {
      this.gameOver();
    }
  }
  
  checkMatches(row, col) {
    const matches = this.grid.findMatches(row, col);
    
    if (matches.length >= 3) {
      const newAffirmations = this.grid.removeMatches(matches);
      // Only show one affirmation instead of all
      if (newAffirmations.length > 0) {
        const randomAffirmation = newAffirmations[Math.floor(Math.random() * newAffirmations.length)];
        this.affirmations.push({ ...randomAffirmation, alpha: 1 });
      }
      
      const floatingBubbles = this.grid.removeFloating();
      
      this.score += matches.length * 10 + floatingBubbles.length * 5;
      this.options.onScoreUpdate?.(this.score);
    }
  }
  
  gameOver() {
    this.stop();
    this.options.onGameOver?.(this.score);
  }
  
  render() {
    // Background gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#0a051e');
    gradient.addColorStop(0.5, '#1a0f35');
    gradient.addColorStop(1, '#2d1b5e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Aurora effect
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    const auroraGradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    auroraGradient.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
    auroraGradient.addColorStop(0.5, 'rgba(107, 140, 255, 0.2)');
    auroraGradient.addColorStop(1, 'rgba(184, 153, 255, 0.2)');
    this.ctx.fillStyle = auroraGradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
    
    // Grid
    this.grid.render(this.ctx);
    
    // Shooter
    this.shooter.render(this.ctx, BUBBLE_TYPES);
    
    // Affirmations with responsive sizing
    this.affirmations.forEach(aff => {
      this.ctx.save();
      this.ctx.globalAlpha = aff.alpha;
      this.ctx.fillStyle = '#FFFFFF';
      const fontSize = Math.min(16, this.width * 0.035);
      this.ctx.font = `bold ${fontSize}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      this.ctx.shadowBlur = 12;
      
      // Keep text within boundaries and wrap if needed
      const maxX = Math.min(Math.max(aff.x, this.width * 0.1), this.width * 0.9);
      const maxWidth = this.width * 0.4;
      this.wrapText(this.ctx, aff.text, maxX, aff.y, maxWidth, fontSize * 1.2);
      this.ctx.restore();
    });
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const startY = y - (lines.length * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, x, startY + i * lineHeight);
    });
  }
}