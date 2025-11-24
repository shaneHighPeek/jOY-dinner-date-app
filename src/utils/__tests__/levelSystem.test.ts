import {
  calculateLevel,
  getNextLevel,
  getProgressToNextLevel,
  checkLevelUp,
  LEVELS,
} from '../levelSystem';

describe('Level System', () => {
  describe('calculateLevel', () => {
    it('should return level 1 for 0 XP', () => {
      const level = calculateLevel(0);
      expect(level.level).toBe(1);
      expect(level.title).toBe('Foodie Newbie');
    });

    it('should return level 1 for XP below level 2 threshold', () => {
      const level = calculateLevel(99);
      expect(level.level).toBe(1);
    });

    it('should return level 2 for exactly 100 XP', () => {
      const level = calculateLevel(100);
      expect(level.level).toBe(2);
      expect(level.title).toBe('Taste Explorer');
    });

    it('should return level 5 for 1000 XP', () => {
      const level = calculateLevel(1000);
      expect(level.level).toBe(5);
      expect(level.title).toBe('Master Chef');
    });

    it('should return level 10 for 7500 XP', () => {
      const level = calculateLevel(7500);
      expect(level.level).toBe(10);
      expect(level.title).toBe('Food Connoisseur');
      expect(level.isPremium).toBe(true);
    });

    it('should return max level (20) for very high XP', () => {
      const level = calculateLevel(100000);
      expect(level.level).toBe(20);
      expect(level.title).toBe('Legendary Epicure');
    });

    it('should handle negative XP by returning level 1', () => {
      const level = calculateLevel(-100);
      expect(level.level).toBe(1);
    });
  });

  describe('getNextLevel', () => {
    it('should return level 2 when current level is 1', () => {
      const nextLevel = getNextLevel(1);
      expect(nextLevel).not.toBeNull();
      expect(nextLevel?.level).toBe(2);
    });

    it('should return level 10 when current level is 9', () => {
      const nextLevel = getNextLevel(9);
      expect(nextLevel).not.toBeNull();
      expect(nextLevel?.level).toBe(10);
      expect(nextLevel?.isPremium).toBe(true);
    });

    it('should return null when at max level (20)', () => {
      const nextLevel = getNextLevel(20);
      expect(nextLevel).toBeNull();
    });

    it('should return null for invalid level above max', () => {
      const nextLevel = getNextLevel(99);
      expect(nextLevel).toBeNull();
    });
  });

  describe('getProgressToNextLevel', () => {
    it('should show 0% progress at the start of level 1', () => {
      const progress = getProgressToNextLevel(0);
      expect(progress.currentLevel.level).toBe(1);
      expect(progress.nextLevel?.level).toBe(2);
      expect(progress.progress).toBe(0);
      expect(progress.xpIntoLevel).toBe(0);
      expect(progress.xpNeeded).toBe(100);
    });

    it('should show 50% progress halfway through level 1', () => {
      const progress = getProgressToNextLevel(50);
      expect(progress.currentLevel.level).toBe(1);
      expect(progress.progress).toBe(0.5);
      expect(progress.xpIntoLevel).toBe(50);
    });

    it('should show 100% progress at level 2 threshold', () => {
      const progress = getProgressToNextLevel(100);
      expect(progress.currentLevel.level).toBe(2);
      expect(progress.nextLevel?.level).toBe(3);
      expect(progress.progress).toBe(0); // Just started level 2
    });

    it('should handle max level correctly', () => {
      const progress = getProgressToNextLevel(60000);
      expect(progress.currentLevel.level).toBe(20);
      expect(progress.nextLevel).toBeNull();
      expect(progress.progress).toBe(1);
      expect(progress.xpNeeded).toBe(0);
    });

    it('should calculate progress correctly for level 5 (1000 XP)', () => {
      const progress = getProgressToNextLevel(1250);
      expect(progress.currentLevel.level).toBe(5);
      expect(progress.nextLevel?.level).toBe(6);
      expect(progress.xpIntoLevel).toBe(250); // 1250 - 1000
      expect(progress.xpNeeded).toBe(750); // 1750 - 1000
      expect(progress.progress).toBeCloseTo(0.333, 2);
    });
  });

  describe('checkLevelUp', () => {
    it('should detect no level up when XP increases within same level', () => {
      const result = checkLevelUp(50, 99);
      expect(result.didLevelUp).toBe(false);
      expect(result.oldLevel.level).toBe(1);
      expect(result.newLevel.level).toBe(1);
      expect(result.levelsGained).toBe(0);
    });

    it('should detect level up from 1 to 2', () => {
      const result = checkLevelUp(99, 100);
      expect(result.didLevelUp).toBe(true);
      expect(result.oldLevel.level).toBe(1);
      expect(result.newLevel.level).toBe(2);
      expect(result.levelsGained).toBe(1);
    });

    it('should detect multiple level ups', () => {
      const result = checkLevelUp(0, 500);
      expect(result.didLevelUp).toBe(true);
      expect(result.oldLevel.level).toBe(1);
      expect(result.newLevel.level).toBe(4);
      expect(result.levelsGained).toBe(3);
    });

    it('should handle level down (XP decrease)', () => {
      const result = checkLevelUp(500, 100);
      expect(result.didLevelUp).toBe(false);
      expect(result.oldLevel.level).toBe(4);
      expect(result.newLevel.level).toBe(2);
      expect(result.levelsGained).toBe(-2);
    });

    it('should detect level up to premium tier', () => {
      const result = checkLevelUp(7499, 7500);
      expect(result.didLevelUp).toBe(true);
      expect(result.oldLevel.level).toBe(9);
      expect(result.newLevel.level).toBe(10);
      expect(result.newLevel.isPremium).toBe(true);
    });
  });

  describe('LEVELS constant', () => {
    it('should have 20 levels', () => {
      expect(LEVELS).toHaveLength(20);
    });

    it('should have levels numbered 1-20 in order', () => {
      LEVELS.forEach((level, index) => {
        expect(level.level).toBe(index + 1);
      });
    });

    it('should have increasing XP requirements', () => {
      for (let i = 1; i < LEVELS.length; i++) {
        expect(LEVELS[i].xpRequired).toBeGreaterThan(LEVELS[i - 1].xpRequired);
      }
    });

    it('should have premium flag starting at level 10', () => {
      LEVELS.forEach((level) => {
        if (level.level >= 10) {
          expect(level.isPremium).toBe(true);
        } else {
          expect(level.isPremium).toBeUndefined();
        }
      });
    });

    it('should have unique titles', () => {
      const titles = LEVELS.map(l => l.title);
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(LEVELS.length);
    });
  });
});
