// Achievement System for Chakra Blaster MAX

export const ACHIEVEMENTS = {
  angerSlayer: {
    id: 'angerSlayer',
    name: 'Anger Slayer',
    description: 'Defeat 100 Anger enemies',
    icon: '⚔️',
    goal: 100,
    coinReward: 100,
    trackingKey: 'angerDefeated'
  },
  fearConqueror: {
    id: 'fearConqueror',
    name: 'Fear Conqueror',
    description: 'Defeat 100 Fear enemies',
    icon: '🛡️',
    goal: 100,
    coinReward: 100,
    trackingKey: 'fearDefeated'
  },
  anxietyHealer: {
    id: 'anxietyHealer',
    name: 'Anxiety Healer',
    description: 'Defeat 100 Anxiety enemies',
    icon: '✨',
    goal: 100,
    coinReward: 100,
    trackingKey: 'anxietyDefeated'
  },
  levelMaster: {
    id: 'levelMaster',
    name: 'Level Master',
    description: 'Reach Level 10',
    icon: '🏆',
    goal: 10,
    coinReward: 250,
    trackingKey: 'maxLevelReached'
  },
  levelLegend: {
    id: 'levelLegend',
    name: 'Level Legend',
    description: 'Reach Level 20',
    icon: '👑',
    goal: 20,
    coinReward: 500,
    trackingKey: 'maxLevelReached'
  },
  untouchable: {
    id: 'untouchable',
    name: 'Untouchable',
    description: 'Survive 3 minutes without taking damage',
    icon: '💎',
    goal: 180,
    coinReward: 300,
    trackingKey: 'longestNoDamageTime'
  },
  coinCollector: {
    id: 'coinCollector',
    name: 'Coin Collector',
    description: 'Collect 1000 Lumina Coins total',
    icon: '💰',
    goal: 1000,
    coinReward: 200,
    trackingKey: 'totalCoinsCollected'
  },
  scoreChaser: {
    id: 'scoreChaser',
    name: 'Score Chaser',
    description: 'Score 10,000 points in one game',
    icon: '⭐',
    goal: 10000,
    coinReward: 150,
    trackingKey: 'highestScore'
  },
  bossSlayer: {
    id: 'bossSlayer',
    name: 'Boss Slayer',
    description: 'Defeat 10 bosses',
    icon: '🔥',
    goal: 10,
    coinReward: 200,
    trackingKey: 'bossesDefeated'
  },
  perfectionist: {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete a level without missing a shot',
    icon: '🎯',
    goal: 1,
    coinReward: 250,
    trackingKey: 'perfectLevels'
  },
  survivor: {
    id: 'survivor',
    name: 'Survivor',
    description: 'Play 50 games total',
    icon: '🌟',
    goal: 50,
    coinReward: 300,
    trackingKey: 'gamesPlayed'
  },
  dedication: {
    id: 'dedication',
    name: 'Dedication',
    description: 'Play on 7 different days',
    icon: '📅',
    goal: 7,
    coinReward: 200,
    trackingKey: 'uniqueDaysPlayed'
  }
};

class AchievementTracker {
  constructor() {
    this.stats = {};
    this.sessionStats = {
      noDamageTime: 0,
      shotsFired: 0,
      shotsHit: 0
    };
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem('chakra_blaster_stats');
      if (saved) {
        this.stats = JSON.parse(saved);
      } else {
        this.reset();
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      this.reset();
    }
  }

  save() {
    try {
      localStorage.setItem('chakra_blaster_stats', JSON.stringify(this.stats));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  }

  reset() {
    this.stats = {
      angerDefeated: 0,
      fearDefeated: 0,
      anxietyDefeated: 0,
      doubtDefeated: 0,
      sadnessDefeated: 0,
      regretDefeated: 0,
      maxLevelReached: 0,
      longestNoDamageTime: 0,
      totalCoinsCollected: 0,
      highestScore: 0,
      bossesDefeated: 0,
      perfectLevels: 0,
      gamesPlayed: 0,
      uniqueDaysPlayed: 0,
      lastPlayedDate: null
    };
    this.save();
  }

  trackEnemyKill(enemyType) {
    const key = `${enemyType}Defeated`;
    if (this.stats[key] !== undefined) {
      this.stats[key]++;
      this.sessionStats.shotsHit++;
      this.save();
      return this.checkAchievements();
    }
    return [];
  }

  trackBossKill() {
    this.stats.bossesDefeated++;
    this.save();
    return this.checkAchievements();
  }

  trackLevel(level) {
    if (level > this.stats.maxLevelReached) {
      this.stats.maxLevelReached = level;
      this.save();
      return this.checkAchievements();
    }
    return [];
  }

  trackScore(score) {
    if (score > this.stats.highestScore) {
      this.stats.highestScore = score;
      this.save();
      return this.checkAchievements();
    }
    return [];
  }

  trackCoins(amount) {
    this.stats.totalCoinsCollected += amount;
    this.save();
    return this.checkAchievements();
  }

  trackNoDamageTime(seconds) {
    this.sessionStats.noDamageTime = seconds;
    if (seconds > this.stats.longestNoDamageTime) {
      this.stats.longestNoDamageTime = seconds;
      this.save();
      return this.checkAchievements();
    }
    return [];
  }

  resetNoDamageTime() {
    this.sessionStats.noDamageTime = 0;
  }

  trackShot() {
    this.sessionStats.shotsFired++;
  }

  trackGameStart() {
    this.stats.gamesPlayed++;
    
    // Track unique days
    const today = new Date().toDateString();
    if (this.stats.lastPlayedDate !== today) {
      this.stats.uniqueDaysPlayed++;
      this.stats.lastPlayedDate = today;
    }

    // Reset session stats
    this.sessionStats = {
      noDamageTime: 0,
      shotsFired: 0,
      shotsHit: 0
    };

    this.save();
    return this.checkAchievements();
  }

  trackLevelComplete() {
    // Check for perfect level
    if (this.sessionStats.shotsFired > 0 && 
        this.sessionStats.shotsFired === this.sessionStats.shotsHit) {
      this.stats.perfectLevels++;
      this.save();
      return this.checkAchievements();
    }
    return [];
  }

  checkAchievements() {
    const unlocked = [];
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      const statValue = this.stats[achievement.trackingKey] || 0;
      if (statValue >= achievement.goal) {
        const alreadyUnlocked = localStorage.getItem(`achievement_${achievement.id}`);
        if (!alreadyUnlocked) {
          localStorage.setItem(`achievement_${achievement.id}`, 'true');
          unlocked.push(achievement);
        }
      }
    });

    return unlocked;
  }

  getProgress(achievementId) {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return { current: 0, goal: 0, percentage: 0 };

    const current = this.stats[achievement.trackingKey] || 0;
    const goal = achievement.goal;
    const percentage = Math.min(100, (current / goal) * 100);

    return { current, goal, percentage };
  }

  getAllProgress() {
    const progress = {};
    Object.keys(ACHIEVEMENTS).forEach(id => {
      progress[id] = this.getProgress(id);
    });
    return progress;
  }

  getStats() {
    return { ...this.stats };
  }
}

export const achievementTracker = new AchievementTracker();