// Challenge Bubbles - Grid System

export const BUBBLE_TYPES = {
  anger: { name: 'Anger', color: '#ff4444', emoji: '🔥', affirmation: 'I release anger with love' },
  regret: { name: 'Regret', color: '#4488ff', emoji: '💧', affirmation: 'I learn and grow from the past' },
  fear: { name: 'Fear', color: '#333366', emoji: '👻', affirmation: 'I am brave and strong' },
  anxiety: { name: 'Anxiety', color: '#ffdd44', emoji: '⚡', affirmation: 'I breathe in calm' },
  sadness: { name: 'Sadness', color: '#44ccff', emoji: '💙', affirmation: 'Joy returns to me' },
  doubt: { name: 'Self-Doubt', color: '#bb88ff', emoji: '💔', affirmation: 'I believe in myself' },
  overthinking: { name: 'Overthinking', color: '#44ff88', emoji: '🌀', affirmation: 'My mind is clear and focused' }
};

export class BubbleGrid {
  constructor(width, height, rows = 10, cols = 8) {
    this.width = width;
    this.height = height;
    this.rows = rows;
    this.cols = cols;
    this.bubbleRadius = Math.min(width / cols, 50) / 2;
    this.grid = [];
    this.descendOffset = 0;
    
    this.initialize();
  }
  
  initialize() {
    this.grid = [];
    const types = Object.keys(BUBBLE_TYPES);
    
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        if (row < 5) {
          const type = types[Math.floor(Math.random() * types.length)];
          this.grid[row][col] = {
            type,
            x: this.getBubbleX(col, row),
            y: this.getBubbleY(row),
            radius: this.bubbleRadius,
            phase: Math.random() * Math.PI * 2
          };
        } else {
          this.grid[row][col] = null;
        }
      }
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.bubbleRadius = Math.min(width / this.cols, 50) / 2;
    
    // Update all bubble positions
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col]) {
          this.grid[row][col].x = this.getBubbleX(col, row);
          this.grid[row][col].y = this.getBubbleY(row);
          this.grid[row][col].radius = this.bubbleRadius;
        }
      }
    }
  }
  
  getBubbleX(col, row) {
    const offset = row % 2 === 0 ? 0 : this.bubbleRadius;
    return col * this.bubbleRadius * 2 + this.bubbleRadius * 1.5 + offset;
  }
  
  getBubbleY(row) {
    return row * this.bubbleRadius * 1.8 + this.bubbleRadius + this.descendOffset;
  }
  
  update() {
    // Update bubble positions
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col]) {
          this.grid[row][col].y = this.getBubbleY(row);
          this.grid[row][col].phase += 0.05;
        }
      }
    }
  }
  
  addBubbleNearPosition(x, y, type) {
    // Find nearest empty slot to the collision point
    let closestDist = Infinity;
    let closestPos = null;
    
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (!this.grid[row][col]) {
          const bx = this.getBubbleX(col, row);
          const by = this.getBubbleY(row);
          const dist = Math.sqrt((x - bx) ** 2 + (y - by) ** 2);
          
          // Check if this position is adjacent to existing bubbles
          const hasNeighbor = this.getNeighbors(row, col).some(([nr, nc]) => this.grid[nr]?.[nc]);
          
          if (hasNeighbor && dist < closestDist) {
            closestDist = dist;
            closestPos = { row, col };
          }
        }
      }
    }
    
    if (closestPos) {
      this.grid[closestPos.row][closestPos.col] = {
        type,
        x: this.getBubbleX(closestPos.col, closestPos.row),
        y: this.getBubbleY(closestPos.row),
        radius: this.bubbleRadius,
        phase: 0
      };
      return closestPos;
    }
    return null;
  }
  
  addBubbleAtTop(x, type) {
    // Find the closest column to x in row 0
    let closestCol = Math.round((x - this.bubbleRadius * 1.5) / (this.bubbleRadius * 2));
    closestCol = Math.max(0, Math.min(this.cols - 1, closestCol));
    
    // Find first empty row in that column from top
    for (let row = 0; row < this.rows; row++) {
      if (!this.grid[row][closestCol]) {
        this.grid[row][closestCol] = {
          type,
          x: this.getBubbleX(closestCol, row),
          y: this.getBubbleY(row),
          radius: this.bubbleRadius,
          phase: 0
        };
        return { row, col: closestCol };
      }
    }
    return null;
  }
  
  findMatches(row, col) {
    const type = this.grid[row][col]?.type;
    if (!type) return [];
    
    const matches = new Set();
    const queue = [[row, col]];
    matches.add(`${row},${col}`);
    
    while (queue.length > 0) {
      const [r, c] = queue.shift();
      const neighbors = this.getNeighbors(r, c);
      
      for (const [nr, nc] of neighbors) {
        const key = `${nr},${nc}`;
        if (!matches.has(key) && this.grid[nr]?.[nc]?.type === type) {
          matches.add(key);
          queue.push([nr, nc]);
        }
      }
    }
    
    return Array.from(matches).map(key => {
      const [r, c] = key.split(',').map(Number);
      return { row: r, col: c };
    });
  }
  
  getNeighbors(row, col) {
    const isEvenRow = row % 2 === 0;
    const offsets = isEvenRow
      ? [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
      : [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];
    
    return offsets
      .map(([dr, dc]) => [row + dr, col + dc])
      .filter(([r, c]) => r >= 0 && r < this.rows && c >= 0 && c < this.cols);
  }
  
  removeMatches(matches) {
    const affirmations = [];
    matches.forEach(({ row, col }) => {
      if (this.grid[row]?.[col]) {
        const bubble = this.grid[row][col];
        affirmations.push({
          x: bubble.x,
          y: bubble.y,
          text: BUBBLE_TYPES[bubble.type].affirmation,
          color: BUBBLE_TYPES[bubble.type].color
        });
        this.grid[row][col] = null;
      }
    });
    return affirmations;
  }
  
  removeFloating() {
    const connected = new Set();
    
    // Mark all bubbles connected to top row
    for (let col = 0; col < this.cols; col++) {
      if (this.grid[0]?.[col]) {
        this.markConnected(0, col, connected);
      }
    }
    
    // Remove unconnected bubbles
    const removed = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col] && !connected.has(`${row},${col}`)) {
          removed.push(this.grid[row][col]);
          this.grid[row][col] = null;
        }
      }
    }
    return removed;
  }
  
  markConnected(row, col, connected) {
    const key = `${row},${col}`;
    if (connected.has(key) || !this.grid[row]?.[col]) return;
    
    connected.add(key);
    const neighbors = this.getNeighbors(row, col);
    neighbors.forEach(([r, c]) => this.markConnected(r, c, connected));
  }
  
  hasReachedBottom(thresholdRow) {
    // If no threshold is provided, default to last row
    const checkRow = thresholdRow !== undefined ? thresholdRow : this.rows - 1;

    // Check if any bubble exists at or below the threshold row
    for (let row = checkRow; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row]?.[col]) {
          return true;
        }
      }
    }
    return false;
  }
  
  render(ctx) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const bubble = this.grid[row][col];
        if (bubble) {
          this.renderBubble(ctx, bubble);
        }
      }
    }
  }
  
  renderBubble(ctx, bubble) {
    const type = BUBBLE_TYPES[bubble.type];
    
    // Glow
    const gradient = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.radius * 1.5);
    gradient.addColorStop(0, type.color + 'aa');
    gradient.addColorStop(0.5, type.color + '44');
    gradient.addColorStop(1, type.color + '00');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Main bubble with animation
    const scale = 1 + Math.sin(bubble.phase) * 0.05;
    ctx.save();
    ctx.translate(bubble.x, bubble.y);
    ctx.scale(scale, scale);
    
    ctx.fillStyle = type.color;
    ctx.beginPath();
    ctx.arc(0, 0, bubble.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(-bubble.radius * 0.3, -bubble.radius * 0.3, bubble.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Emoji
    ctx.font = `${bubble.radius}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(type.emoji, 0, 0);
    
    ctx.restore();
  }
}