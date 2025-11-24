// Upgrade System Manager - Handles all upgrade logic and persistence

export const UPGRADE_CATEGORIES = {
  POWER: 'power',
  UTILITY: 'utility',
  SPECIAL: 'special'
};

export const UPGRADES = {
  // Power Upgrades
  beamDamage: {
    id: 'beamDamage',
    name: 'Chakra Beam Damage',
    description: 'Increase your beam damage output',
    icon: '⚡',
    category: UPGRADE_CATEGORIES.POWER,
    maxLevel: 10,
    baseCost: 25,
    costMultiplier: 1.4,
    baseValue: 1,
    valuePerLevel: 0.5,
    affirmation: 'Your power flows freely.'
  },
  fireRate: {
    id: 'fireRate',
    name: 'Beam Fire Rate',
    description: 'Shoot faster beams of light',
    icon: '🔥',
    category: UPGRADE_CATEGORIES.POWER,
    maxLevel: 10,
    baseCost: 30,
    costMultiplier: 1.45,
    baseValue: 0,
    valuePerLevel: 1,
    affirmation: 'Speed flows through you.'
  },
  shieldStrength: {
    id: 'shieldStrength',
    name: 'Meditation Shield',
    description: 'Stronger protective aura',
    icon: '🛡️',
    category: UPGRADE_CATEGORIES.POWER,
    maxLevel: 10,
    baseCost: 40,
    costMultiplier: 1.5,
    baseValue: 0,
    valuePerLevel: 1,
    affirmation: 'You are protected by light.'
  },
  auraExpansion: {
    id: 'auraExpansion',
    name: 'Aura Expansion',
    description: 'Wider projectile hitbox',
    icon: '💫',
    category: UPGRADE_CATEGORIES.POWER,
    maxLevel: 10,
    baseCost: 35,
    costMultiplier: 1.4,
    baseValue: 0,
    valuePerLevel: 2,
    affirmation: 'Your aura expands infinitely.'
  },
  
  // Utility Upgrades
  coinMagnet: {
    id: 'coinMagnet',
    name: 'Coin Magnet Aura',
    description: 'Attract coins from afar',
    icon: '🧲',
    category: UPGRADE_CATEGORIES.UTILITY,
    maxLevel: 10,
    baseCost: 50,
    costMultiplier: 1.35,
    baseValue: 0,
    valuePerLevel: 50,
    affirmation: 'Abundance flows to you.'
  },
  bonusAffirmations: {
    id: 'bonusAffirmations',
    name: 'Bonus Affirmations',
    description: 'Spawn rare wisdom more often',
    icon: '✨',
    category: UPGRADE_CATEGORIES.UTILITY,
    maxLevel: 10,
    baseCost: 60,
    costMultiplier: 1.5,
    baseValue: 0,
    valuePerLevel: 5,
    affirmation: 'Wisdom finds you easily.'
  },
  cooldownReduction: {
    id: 'cooldownReduction',
    name: 'Cooldown Reduction',
    description: 'Use abilities more frequently',
    icon: '⏱️',
    category: UPGRADE_CATEGORIES.UTILITY,
    maxLevel: 10,
    baseCost: 45,
    costMultiplier: 1.45,
    baseValue: 0,
    valuePerLevel: 5,
    affirmation: 'Time bends to your will.'
  },
  extraLives: {
    id: 'extraLives',
    name: 'Life Fragments',
    description: 'Increase maximum health',
    icon: '💖',
    category: UPGRADE_CATEGORIES.UTILITY,
    maxLevel: 5,
    baseCost: 100,
    costMultiplier: 1.8,
    baseValue: 3,
    valuePerLevel: 1,
    affirmation: 'Your vitality overflows.'
  },
  
  // Special Abilities
  serenityBurst: {
    id: 'serenityBurst',
    name: 'Serenity Burst',
    description: 'Screen-wide stun wave',
    icon: '🌊',
    category: UPGRADE_CATEGORIES.SPECIAL,
    maxLevel: 5,
    baseCost: 150,
    costMultiplier: 2.0,
    baseValue: 0,
    valuePerLevel: 1,
    affirmation: 'Peace radiates from within.'
  },
  harmonyWave: {
    id: 'harmonyWave',
    name: 'Harmony Wave',
    description: 'Clear projectiles around you',
    icon: '🌀',
    category: UPGRADE_CATEGORIES.SPECIAL,
    maxLevel: 5,
    baseCost: 180,
    costMultiplier: 2.0,
    baseValue: 0,
    valuePerLevel: 1,
    affirmation: 'Harmony restores balance.'
  },
  innerFire: {
    id: 'innerFire',
    name: 'Inner Fire',
    description: 'Temporary double damage mode',
    icon: '🔥',
    category: UPGRADE_CATEGORIES.SPECIAL,
    maxLevel: 5,
    baseCost: 200,
    costMultiplier: 2.0,
    baseValue: 0,
    valuePerLevel: 2,
    affirmation: 'Your inner flame burns bright.'
  }
};

class UpgradeSystemManager {
  constructor() {
    this.upgradeLevels = {};
    this.coins = 0;
    this.load();
  }
  
  load() {
    try {
      const saved = localStorage.getItem('chakra_blaster_upgrades');
      if (saved) {
        const data = JSON.parse(saved);
        this.upgradeLevels = data.levels || {};
        this.coins = data.coins || 0;
      } else {
        this.reset();
      }
    } catch (error) {
      console.error('Failed to load upgrades:', error);
      this.reset();
    }
  }
  
  save() {
    try {
      localStorage.setItem('chakra_blaster_upgrades', JSON.stringify({
        levels: this.upgradeLevels,
        coins: this.coins
      }));
    } catch (error) {
      console.error('Failed to save upgrades:', error);
    }
  }
  
  reset() {
    this.upgradeLevels = {};
    Object.keys(UPGRADES).forEach(id => {
      this.upgradeLevels[id] = 0;
    });
    this.coins = 0;
    this.save();
  }
  
  getLevel(upgradeId) {
    return this.upgradeLevels[upgradeId] || 0;
  }
  
  getCost(upgradeId) {
    const upgrade = UPGRADES[upgradeId];
    if (!upgrade) return 0;
    
    const currentLevel = this.getLevel(upgradeId);
    if (currentLevel >= upgrade.maxLevel) return 0;
    
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
  }
  
  canAfford(upgradeId) {
    return this.coins >= this.getCost(upgradeId);
  }
  
  canUpgrade(upgradeId) {
    const upgrade = UPGRADES[upgradeId];
    if (!upgrade) return false;
    
    const currentLevel = this.getLevel(upgradeId);
    return currentLevel < upgrade.maxLevel && this.canAfford(upgradeId);
  }
  
  purchase(upgradeId) {
    if (!this.canUpgrade(upgradeId)) return false;
    
    const cost = this.getCost(upgradeId);
    this.coins -= cost;
    this.upgradeLevels[upgradeId]++;
    this.save();
    
    return true;
  }
  
  addCoins(amount) {
    this.coins += amount;
    this.save();
  }
  
  getCoins() {
    return this.coins;
  }
  
  getValue(upgradeId) {
    const upgrade = UPGRADES[upgradeId];
    if (!upgrade) return 0;
    
    const level = this.getLevel(upgradeId);
    return upgrade.baseValue + (upgrade.valuePerLevel * level);
  }
  
  getAllUpgradeStats() {
    const stats = {};
    Object.keys(UPGRADES).forEach(id => {
      stats[id] = this.getValue(id);
    });
    return stats;
  }
  
  getUpgradesByCategory(category) {
    return Object.values(UPGRADES).filter(u => u.category === category);
  }
}

export const upgradeManager = new UpgradeSystemManager();