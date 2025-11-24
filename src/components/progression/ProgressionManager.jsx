import { base44 } from '@/api/base44Client';

const LEVEL_XP_REQUIREMENTS = {
  1: 0,
  2: 100,
  3: 250,
  4: 450,
  5: 700,
  10: 2000,
  15: 4500,
  20: 8000,
  25: 12000,
  30: 17000,
};

// Calculate XP needed for any level
export function getXPForLevel(level) {
  if (LEVEL_XP_REQUIREMENTS[level]) {
    return LEVEL_XP_REQUIREMENTS[level];
  }
  // Exponential growth formula
  return Math.floor(100 * Math.pow(level, 1.5));
}

// Calculate player level from XP
export function getLevelFromXP(xp) {
  let level = 1;
  while (getXPForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}

// Award XP for game completion
export async function awardGameXP(userEmail, gameType, score, levelReached) {
  const baseXP = Math.floor(score / 10);
  const levelBonus = levelReached * 5;
  const totalXP = baseXP + levelBonus;

  const progressionRecords = await base44.entities.GlobalProgression.filter({ user_email: userEmail });
  
  if (progressionRecords.length === 0) {
    await base44.entities.GlobalProgression.create({
      user_email: userEmail,
      total_games_played: 1,
      total_score: score,
      experience_points: totalXP,
      player_level: getLevelFromXP(totalXP)
    });
  } else {
    const progression = progressionRecords[0];
    const newXP = progression.experience_points + totalXP;
    const newLevel = getLevelFromXP(newXP);
    
    await base44.entities.GlobalProgression.update(progression.id, {
      total_games_played: progression.total_games_played + 1,
      total_score: progression.total_score + score,
      experience_points: newXP,
      player_level: newLevel
    });

    // Check for content unlocks
    if (newLevel > progression.player_level) {
      await checkUnlocks(userEmail, newLevel);
    }
  }

  return totalXP;
}

// Content unlocks based on player level
const UNLOCKABLE_CONTENT = [
  { level: 3, type: 'game_mode', id: 'chakra_survival', name: 'Chakra Blaster: Survival Mode' },
  { level: 5, type: 'game_mode', id: 'bubbles_timed', name: 'Challenge Bubbles: Timed Challenge' },
  { level: 7, type: 'game_mode', id: 'memory_puzzle', name: 'Memory Match: Puzzle Mode' },
  { level: 10, type: 'game_mode', id: 'chakra_boss_rush', name: 'Chakra Blaster: Boss Rush' },
  { level: 12, type: 'theme', id: 'cosmic_theme', name: 'Cosmic Theme' },
  { level: 15, type: 'game_mode', id: 'bubbles_powerup', name: 'Challenge Bubbles: Power-Up Mode' },
  { level: 18, type: 'theme', id: 'zen_theme', name: 'Zen Garden Theme' },
  { level: 20, type: 'game_mode', id: 'memory_expert', name: 'Memory Match: Expert Mode' },
  { level: 25, type: 'avatar', id: 'enlightened_master', name: 'Enlightened Master Avatar' },
];

async function checkUnlocks(userEmail, newLevel) {
  const existingUnlocks = await base44.entities.UnlockedContent.filter({ user_email: userEmail });
  const existingIds = new Set(existingUnlocks.map(u => u.content_id));

  const newUnlocks = UNLOCKABLE_CONTENT.filter(
    content => content.level <= newLevel && !existingIds.has(content.id)
  );

  for (const unlock of newUnlocks) {
    await base44.entities.UnlockedContent.create({
      user_email: userEmail,
      content_type: unlock.type,
      content_id: unlock.id,
      content_name: unlock.name,
      unlock_requirement: `Reached Player Level ${unlock.level}`
    });
  }

  return newUnlocks;
}

export async function getUserProgression(userEmail) {
  const progressionRecords = await base44.entities.GlobalProgression.filter({ user_email: userEmail });
  
  if (progressionRecords.length === 0) {
    return {
      player_level: 1,
      experience_points: 0,
      total_games_played: 0,
      total_score: 0,
      xp_to_next_level: getXPForLevel(2),
      global_upgrades: {
        focus_boost: 0,
        resilience: 0,
        clarity: 0
      }
    };
  }

  const progression = progressionRecords[0];
  const currentLevelXP = getXPForLevel(progression.player_level);
  const nextLevelXP = getXPForLevel(progression.player_level + 1);

  return {
    ...progression,
    xp_to_next_level: nextLevelXP - progression.experience_points,
    xp_progress: progression.experience_points - currentLevelXP,
    xp_needed_for_level: nextLevelXP - currentLevelXP
  };
}