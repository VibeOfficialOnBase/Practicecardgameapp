// Dynamic Difficulty Adjustment System

export class DifficultyScaler {
  constructor(gameType) {
    this.gameType = gameType;
    this.performanceHistory = [];
    this.maxHistorySize = 10;
    this.difficultyMultiplier = 1.0;
  }

  // Track player performance
  recordPerformance(metrics) {
    this.performanceHistory.push(metrics);
    if (this.performanceHistory.length > this.maxHistorySize) {
      this.performanceHistory.shift();
    }
    this.updateDifficulty();
  }

  // Calculate average performance
  getAveragePerformance() {
    if (this.performanceHistory.length === 0) return 0.5;
    
    const sum = this.performanceHistory.reduce((acc, p) => acc + p.score, 0);
    return sum / this.performanceHistory.length;
  }

  // Update difficulty based on performance
  updateDifficulty() {
    if (this.performanceHistory.length < 3) return;

    const recentPerformance = this.performanceHistory.slice(-3);
    const avgScore = recentPerformance.reduce((acc, p) => acc + p.score, 0) / 3;
    
    // If player is doing too well, increase difficulty
    if (avgScore > 0.8) {
      this.difficultyMultiplier = Math.min(2.0, this.difficultyMultiplier + 0.1);
    }
    // If player is struggling, decrease difficulty
    else if (avgScore < 0.3) {
      this.difficultyMultiplier = Math.max(0.5, this.difficultyMultiplier - 0.1);
    }
    // Otherwise, gradually return to normal
    else {
      if (this.difficultyMultiplier > 1.0) {
        this.difficultyMultiplier = Math.max(1.0, this.difficultyMultiplier - 0.05);
      } else if (this.difficultyMultiplier < 1.0) {
        this.difficultyMultiplier = Math.min(1.0, this.difficultyMultiplier + 0.05);
      }
    }
  }

  // Get scaled values for game parameters
  scaleEnemySpeed(baseSpeed) {
    return baseSpeed * this.difficultyMultiplier;
  }

  scaleSpawnRate(baseRate) {
    return Math.max(15, baseRate / this.difficultyMultiplier);
  }

  scaleEnemyHealth(baseHealth) {
    return Math.floor(baseHealth * this.difficultyMultiplier);
  }

  scaleBubbleSpeed(baseSpeed) {
    return baseSpeed * (0.8 + this.difficultyMultiplier * 0.2);
  }

  scaleTimeLimit(baseTime) {
    return Math.floor(baseTime / this.difficultyMultiplier);
  }

  getDifficultyMultiplier() {
    return this.difficultyMultiplier;
  }

  reset() {
    this.performanceHistory = [];
    this.difficultyMultiplier = 1.0;
  }
}

// Chakra Blaster specific scaling
export function getChakraBlasterScaling(scaler, level) {
  return {
    enemySpeed: scaler.scaleEnemySpeed(1 + level * 0.1),
    spawnRate: scaler.scaleSpawnRate(Math.max(30, 120 - level * 5)),
    enemyHealth: scaler.scaleEnemyHealth(1 + Math.floor(level / 3)),
    enemyDensity: Math.floor(10 + level * 5 * scaler.getDifficultyMultiplier())
  };
}

// Challenge Bubbles specific scaling
export function getChallengeBubblesScaling(scaler, timeElapsed) {
  const baseDescendRate = 0.05 + timeElapsed * 0.001;
  const baseNewRowRate = 300 - timeElapsed * 2;
  
  return {
    descendRate: baseDescendRate * scaler.getDifficultyMultiplier(),
    newRowRate: Math.max(60, scaler.scaleSpawnRate(baseNewRowRate)),
    bubbleVariety: Math.min(7, 4 + Math.floor(timeElapsed / 20))
  };
}

// Memory Match specific scaling
export function getMemoryMatchScaling(scaler, difficulty, successRate) {
  const baseTimeLimit = {
    easy: 300,
    medium: 180,
    hard: 120
  }[difficulty];

  return {
    timeLimit: scaler.scaleTimeLimit(baseTimeLimit),
    showTime: Math.max(500, 2000 - successRate * 1000),
    penaltyForMismatch: successRate > 0.8 ? 5 : 2
  };
}