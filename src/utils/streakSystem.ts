/**
 * Streak System Utility
 * Handles daily usage tracking and milestone rewards
 */

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  streakRewards: {
    '3day': boolean;
    '7day': boolean;
    '14day': boolean;
    '30day': boolean;
  };
}

export interface StreakUpdate {
  shouldUpdate: boolean;
  newStreak: number;
  isBroken: boolean;
  isIncremented: boolean;
  milestoneReached?: number;
  hintsEarned?: number;
}

/**
 * Milestone rewards: streak days → hints earned
 */
export const STREAK_REWARDS: Record<number, number> = {
  3: 1,   // 3 days → 1 hint
  7: 2,   // 7 days → 2 hints
  14: 3,  // 14 days → 3 hints
  30: 5,  // 30 days → 5 hints
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Calculate days between two dates
 */
export const getDaysDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Calculate streak update based on last active date
 */
export const calculateStreakUpdate = (
  lastActiveDate: string | null,
  currentStreak: number = 0,
  streakRewards: StreakData['streakRewards'] = {
    '3day': false,
    '7day': false,
    '14day': false,
    '30day': false,
  }
): StreakUpdate => {
  const today = getTodayDate();
  
  // First time user
  if (!lastActiveDate) {
    return {
      shouldUpdate: true,
      newStreak: 1,
      isBroken: false,
      isIncremented: true,
    };
  }
  
  // Already active today
  if (lastActiveDate === today) {
    return {
      shouldUpdate: false,
      newStreak: currentStreak,
      isBroken: false,
      isIncremented: false,
    };
  }
  
  const daysDiff = getDaysDifference(lastActiveDate, today);
  
  // Consecutive day (yesterday)
  if (daysDiff === 1) {
    const newStreak = currentStreak + 1;
    
    // Check for milestone
    const milestoneReached = Object.keys(STREAK_REWARDS)
      .map(Number)
      .find(milestone => {
        const key = `${milestone}day` as keyof StreakData['streakRewards'];
        return milestone === newStreak && !streakRewards[key];
      });
    
    return {
      shouldUpdate: true,
      newStreak,
      isBroken: false,
      isIncremented: true,
      milestoneReached,
      hintsEarned: milestoneReached ? STREAK_REWARDS[milestoneReached] : undefined,
    };
  }
  
  // Streak broken (missed a day)
  return {
    shouldUpdate: true,
    newStreak: 1, // Start fresh
    isBroken: true,
    isIncremented: false,
  };
};

/**
 * Get next milestone and progress
 */
export const getNextMilestone = (currentStreak: number): {
  nextMilestone: number | null;
  daysUntil: number;
  progress: number; // 0-1
} => {
  const milestones = Object.keys(STREAK_REWARDS).map(Number).sort((a, b) => a - b);
  
  const nextMilestone = milestones.find(m => m > currentStreak);
  
  if (!nextMilestone) {
    // Already at max milestone
    return {
      nextMilestone: null,
      daysUntil: 0,
      progress: 1,
    };
  }
  
  // Find previous milestone for progress calculation
  const prevMilestone = milestones
    .filter(m => m <= currentStreak)
    .sort((a, b) => b - a)[0] || 0;
  
  const daysUntil = nextMilestone - currentStreak;
  const totalRange = nextMilestone - prevMilestone;
  const currentProgress = currentStreak - prevMilestone;
  const progress = currentProgress / totalRange;
  
  return {
    nextMilestone,
    daysUntil,
    progress,
  };
};

/**
 * Get streak emoji based on count
 */
export const getStreakEmoji = (streak: number): string => {
  if (streak === 0) return '💤';
  if (streak < 3) return '🔥';
  if (streak < 7) return '🔥🔥';
  if (streak < 14) return '🔥🔥🔥';
  if (streak < 30) return '⚡';
  return '🌟';
};

/**
 * Get streak message
 */
export const getStreakMessage = (streak: number): string => {
  if (streak === 0) return 'Start your streak!';
  if (streak === 1) return 'Great start!';
  if (streak < 3) return 'Keep it going!';
  if (streak < 7) return 'You\'re on fire!';
  if (streak < 14) return 'Incredible streak!';
  if (streak < 30) return 'Unstoppable!';
  return 'Legendary streak!';
};
