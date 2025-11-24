export class LevelManager {
  constructor(level, upgrades, difficultyScaler = null) {
    this.level = level;
    this.upgrades = upgrades;
    this.difficultyScaler = difficultyScaler;
    this.bossSpawned = false;
    
    // Enemy types that can spawn
    this.enemyTypes = ['anger', 'fear', 'regret', 'sadness', 'guilt', 'shame', 'anxiety', 'doubt', 'envy', 'loneliness', 'overwhelm'];
    
    // Calculate level properties with dynamic scaling
    this.isBossLevel = level % 3 === 0; // Boss every 3rd level
    const baseCount = 8 + level * 3; // Reduced enemy count for faster progression
    const baseRate = Math.max(25, 90 - level * 4); // Faster spawn rate
    
    // Apply difficulty scaling if available
    if (this.difficultyScaler) {
      this.baseEnemyCount = Math.floor(baseCount * this.difficultyScaler.getDifficultyMultiplier());
      this.spawnRate = this.difficultyScaler.scaleSpawnRate(baseRate);
    } else {
      this.baseEnemyCount = baseCount;
      this.spawnRate = baseRate;
    }
    
    this.waveCount = Math.floor(level / 3) + 1;
  }
  
  getTotalEnemies() {
    if (this.isBossLevel) {
      return this.baseEnemyCount + 1; // Regular enemies + boss
    }
    return this.baseEnemyCount;
  }
  
  getSpawnData(frame) {
    // Don't spawn too early
    if (frame < 60) return null;
    
    // Boss spawns when most regular enemies are defeated
    if (this.isBossLevel && !this.bossSpawned) {
      const regularEnemies = this.baseEnemyCount;
      if (frame > 180) { // Wait at least 3 seconds
        this.bossSpawned = true;
        return {
          type: 'anger', // Boss type
          isBoss: true
        };
      }
    }
    
    // Regular enemy spawning
    if (frame % this.spawnRate === 0) {
      // Weight enemy types based on level
      const weights = this.getEnemyWeights();
      const type = this.selectWeightedRandom(weights);
      
      return {
        type: type,
        isBoss: false
      };
    }
    
    return null;
  }
  
  getEnemyWeights() {
    const weights = {};
    
    // Early levels: basic emotions
    if (this.level < 5) {
      weights.anger = 30;
      weights.fear = 30;
      weights.sadness = 20;
      weights.anxiety = 20;
    }
    // Mid levels: introduce complex emotions
    else if (this.level < 10) {
      weights.anger = 20;
      weights.fear = 20;
      weights.regret = 20;
      weights.sadness = 15;
      weights.guilt = 15;
      weights.anxiety = 10;
    }
    // High levels: all emotions including new types
    else {
      weights.anger = 10;
      weights.fear = 10;
      weights.regret = 10;
      weights.sadness = 10;
      weights.guilt = 10;
      weights.shame = 10;
      weights.anxiety = 10;
      weights.doubt = 10;
      weights.envy = 10;
      weights.loneliness = 5;
      weights.overwhelm = 5;
    }
    
    return weights;
  }
  
  selectWeightedRandom(weights) {
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    let random = Math.random() * total;
    
    for (const [type, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        return type;
      }
    }
    
    return 'anger'; // Fallback
  }
  
  isLevelComplete(enemiesSpawned, enemiesRemaining) {
    return enemiesSpawned >= this.getTotalEnemies() && enemiesRemaining === 0;
  }
}