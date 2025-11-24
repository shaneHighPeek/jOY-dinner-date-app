export interface Level {
  level: number;
  xpRequired: number;
  title: string;
  isPremium?: boolean;
}

export const LEVELS: Level[] = [
  { level: 1, xpRequired: 0, title: "Foodie Newbie" },
  { level: 2, xpRequired: 100, title: "Taste Explorer" },
  { level: 3, xpRequired: 250, title: "Flavor Hunter" },
  { level: 4, xpRequired: 500, title: "Culinary Adventurer" },
  { level: 5, xpRequired: 1000, title: "Master Chef" },
  { level: 6, xpRequired: 1750, title: "Gourmet Guru" },
  { level: 7, xpRequired: 2750, title: "Kitchen Wizard" },
  { level: 8, xpRequired: 4000, title: "Flavor Maestro" },
  { level: 9, xpRequired: 5500, title: "Culinary Legend" },
  { level: 10, xpRequired: 7500, title: "Food Connoisseur", isPremium: true },
  { level: 11, xpRequired: 10000, title: "Epicurean Elite", isPremium: true },
  { level: 12, xpRequired: 13000, title: "Taste Virtuoso", isPremium: true },
  { level: 13, xpRequired: 16500, title: "Gastronomic Genius", isPremium: true },
  { level: 14, xpRequired: 20500, title: "Culinary Royalty", isPremium: true },
  { level: 15, xpRequired: 25000, title: "Master of Flavors", isPremium: true },
  { level: 16, xpRequired: 30000, title: "Food Sage", isPremium: true },
  { level: 17, xpRequired: 36000, title: "Taste Champion", isPremium: true },
  { level: 18, xpRequired: 43000, title: "Culinary Titan", isPremium: true },
  { level: 19, xpRequired: 51000, title: "Flavor Deity", isPremium: true },
  { level: 20, xpRequired: 60000, title: "Legendary Epicure", isPremium: true },
];

/**
 * Calculate the current level based on XP
 */
export const calculateLevel = (xp: number): Level => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
};

/**
 * Get the next level after the current one
 */
export const getNextLevel = (currentLevel: number): Level | null => {
  return LEVELS.find(l => l.level === currentLevel + 1) || null;
};

/**
 * Get detailed progress information for the current level
 */
export const getProgressToNextLevel = (xp: number): {
  currentLevel: Level;
  nextLevel: Level | null;
  progress: number; // 0-1
  xpNeeded: number;
  xpIntoLevel: number;
} => {
  const currentLevel = calculateLevel(xp);
  const nextLevel = getNextLevel(currentLevel.level);
  
  if (!nextLevel) {
    // Max level reached
    return {
      currentLevel,
      nextLevel: null,
      progress: 1,
      xpNeeded: 0,
      xpIntoLevel: xp - currentLevel.xpRequired,
    };
  }
  
  const xpIntoLevel = xp - currentLevel.xpRequired;
  const xpNeeded = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = xpIntoLevel / xpNeeded;
  
  return {
    currentLevel,
    nextLevel,
    progress,
    xpNeeded,
    xpIntoLevel,
  };
};

/**
 * Check if leveling up from oldXP to newXP
 */
export const checkLevelUp = (oldXP: number, newXP: number): {
  didLevelUp: boolean;
  oldLevel: Level;
  newLevel: Level;
  levelsGained: number;
} => {
  const oldLevel = calculateLevel(oldXP);
  const newLevel = calculateLevel(newXP);
  const didLevelUp = newLevel.level > oldLevel.level;
  const levelsGained = newLevel.level - oldLevel.level;
  
  return {
    didLevelUp,
    oldLevel,
    newLevel,
    levelsGained,
  };
};
