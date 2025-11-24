# Gamification System - Complete Implementation Guide

**Last Updated**: November 24, 2025  
**Status**: Ready for Implementation  
**Estimated Total Time**: 8-12 hours

---

## Overview

The gamification system is the engagement engine of jOY. It creates a compelling progression loop that keeps users coming back daily and provides tangible rewards for their activity.

### Core Components
1. **Level System** - XP-based progression with titles and rewards
2. **Hint System** - Currency for unlocking partner insights
3. **Streak System** - Daily usage tracking with milestone rewards
4. **Premium Integration** - Enhanced benefits for subscribers

---

## Phase 1: Level System (2-3 hours)

### Objective
Transform the existing XP tracking into a full progression system with levels, titles, and celebrations.

### Files to Create/Modify

#### 1. Create `src/utils/levelSystem.ts`
```typescript
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

export const calculateLevel = (xp: number): Level => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
};

export const getNextLevel = (currentLevel: number): Level | null => {
  return LEVELS.find(l => l.level === currentLevel + 1) || null;
};

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
```

#### 2. Create `app/level-up.tsx` (Celebration Screen)
```typescript
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import ConfettiCannon from 'react-native-confetti-cannon';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

export default function LevelUpScreen() {
  const { level, title, hintsEarned } = useLocalSearchParams<{
    level: string;
    title: string;
    hintsEarned: string;
  }>();
  const router = useRouter();
  const theme = useTheme();
  
  useEffect(() => {
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      router.back();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <View style={styles.container}>
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
      
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.emoji}>🎉</Text>
      </Animated.View>
      
      <Animated.Text entering={FadeInUp.duration(500).delay(200)} style={styles.title}>
        Level Up!
      </Animated.Text>
      
      <Animated.Text entering={FadeInUp.duration(500).delay(400)} style={styles.level}>
        Level {level}
      </Animated.Text>
      
      <Animated.Text entering={FadeInUp.duration(500).delay(600)} style={styles.levelTitle}>
        {title}
      </Animated.Text>
      
      <Animated.View entering={FadeInUp.duration(500).delay(800)} style={styles.reward}>
        <Text style={styles.rewardText}>+{hintsEarned} Hint{Number(hintsEarned) > 1 ? 's' : ''} Earned!</Text>
      </Animated.View>
    </View>
  );
}
```

#### 3. Modify `app/(tabs)/play-swipe.tsx`
Add level-up detection after awarding XP:
```typescript
import { calculateLevel } from '@/utils/levelSystem';

// In handleSwipe, after awarding XP:
const oldLevel = calculateLevel(userData.xp || 0);
const newXP = (userData.xp || 0) + 10;
const newLevel = calculateLevel(newXP);

// Update user XP
await updateDoc(userRef, { xp: newXP });

// Check for level up
if (newLevel.level > oldLevel.level) {
  const hintsEarned = 1;
  await updateDoc(userRef, {
    hints: (userData.hints || 0) + hintsEarned,
    level: newLevel.level,
  });
  
  router.push({
    pathname: '/level-up',
    params: {
      level: newLevel.level.toString(),
      title: newLevel.title,
      hintsEarned: hintsEarned.toString(),
    },
  });
}
```

#### 4. Update XP Bar Component
Modify to show "Level X → Level Y" progress:
```typescript
import { getProgressToNextLevel } from '@/utils/levelSystem';

const { currentLevel, nextLevel, progress, xpIntoLevel, xpNeeded } = getProgressToNextLevel(userData.xp || 0);

// Display: "Level 3 → Level 4: 150/500 XP"
```

### Testing Checklist
- [ ] User gains XP from swipes
- [ ] Level-up celebration triggers at correct XP thresholds
- [ ] Hints are awarded on level-up
- [ ] XP bar shows correct progress
- [ ] Level title displays in UI
- [ ] Confetti animation plays
- [ ] Auto-dismiss works after 3 seconds

---

## Phase 2: Hint System (3-4 hours)

### Objective
Create a complete hint economy where users can spend hints to gain strategic advantages.

### Files to Create/Modify

#### 1. Create `app/hints-menu.tsx`
```typescript
// Modal/screen showing hint usage options
// - Reveal Partner's Top Cuisine (1 hint)
// - Show Partner's Recent Likes (2 hints)
// - Skip Partner Prompt (1 hint)
// Each option shows cost, description, and confirmation dialog
```

#### 2. Create `src/services/hintService.ts`
```typescript
export const HintService = {
  // Reveal partner's #1 favorite cuisine
  async revealTopCuisine(userId: string, partnerId: string): Promise<string> {
    // Query partner's cuisine preferences
    // Return their most liked cuisine
  },
  
  // Show partner's last 5 liked items
  async revealRecentLikes(userId: string, partnerId: string): Promise<FoodItem[]> {
    // Query votes collection for partner
    // Return last 5 liked items
  },
  
  // Deduct hints from user
  async spendHints(userId: string, amount: number): Promise<boolean> {
    // Validate user has enough hints
    // Deduct from Firestore
    // Return success/failure
  },
};
```

#### 3. Create `app/hint-reveal.tsx`
```typescript
// Screen showing revealed partner data
// Beautiful UI displaying the insight gained
// "Your partner loves Italian food! 🇮🇹"
```

### Testing Checklist
- [ ] Hints menu displays correctly
- [ ] Confirmation dialog shows before spending
- [ ] Hints are deducted from Firestore
- [ ] Partner data is revealed correctly
- [ ] Premium users see "Unlimited" instead of costs
- [ ] Error handling for insufficient hints

---

## Phase 3: Streak System (2-3 hours)

### Objective
Track daily app usage and reward consistent engagement.

### Files to Create/Modify

#### 1. Create `src/utils/streakSystem.ts`
```typescript
export const calculateStreak = (lastActiveDate: string | null): {
  currentStreak: number;
  isBroken: boolean;
} => {
  if (!lastActiveDate) return { currentStreak: 0, isBroken: false };
  
  const today = new Date().toISOString().split('T')[0];
  const lastActive = new Date(lastActiveDate).toISOString().split('T')[0];
  
  const daysDiff = Math.floor(
    (new Date(today).getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysDiff === 0) {
    // Same day, no change
    return { currentStreak: 0, isBroken: false };
  } else if (daysDiff === 1) {
    // Consecutive day, increment
    return { currentStreak: 1, isBroken: false };
  } else {
    // Streak broken
    return { currentStreak: 0, isBroken: true };
  }
};

export const STREAK_REWARDS = {
  3: 1,   // 3 days → 1 hint
  7: 2,   // 7 days → 2 hints
  14: 3,  // 14 days → 3 hints
  30: 5,  // 30 days → 5 hints
};
```

#### 2. Modify `app/_layout.tsx` (Root Layout)
Add streak check on app open:
```typescript
useEffect(() => {
  if (user && userData) {
    checkAndUpdateStreak(user.uid, userData);
  }
}, [user, userData]);

const checkAndUpdateStreak = async (userId: string, userData: any) => {
  const { currentStreak, isBroken } = calculateStreak(userData.lastActiveDate);
  
  if (isBroken) {
    // Reset streak
    await updateDoc(doc(db, 'users', userId), {
      currentStreak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
    });
  } else if (currentStreak > 0) {
    const newStreak = (userData.currentStreak || 0) + 1;
    const updates: any = {
      currentStreak: newStreak,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    
    // Check for milestone rewards
    if (STREAK_REWARDS[newStreak]) {
      updates.hints = (userData.hints || 0) + STREAK_REWARDS[newStreak];
      // Show streak celebration
    }
    
    await updateDoc(doc(db, 'users', userId), updates);
  }
};
```

#### 3. Create Streak UI Component
```typescript
// Display current streak in header or settings
// "🔥 7 Day Streak"
// Show progress to next milestone
```

### Testing Checklist
- [ ] Streak increments on consecutive days
- [ ] Streak resets after missing a day
- [ ] Hints awarded at milestones
- [ ] Streak celebration shows
- [ ] Longest streak tracked
- [ ] UI displays current streak

---

## Phase 4: Premium Integration (1-2 hours)

### Objective
Enhance gamification for premium users.

### Changes Needed

#### 1. Modify Hint Display
```typescript
// In hints menu and counter
const displayHints = userData.isPremium ? '∞' : userData.hints;
```

#### 2. Hide Costs for Premium
```typescript
// In hint usage options
if (!userData.isPremium) {
  // Show cost (1 hint, 2 hints, etc.)
} else {
  // Show "Free" or hide cost entirely
}
```

#### 3. Premium Badge
```typescript
// Add badge next to level in UI
{userData.isPremium && <Text style={styles.premiumBadge}>👑</Text>}
```

#### 4. Optional: 2x XP Multiplier
```typescript
const xpEarned = userData.isPremium ? 20 : 10;
```

### Testing Checklist
- [ ] Premium users see unlimited hints
- [ ] Premium users don't spend hints
- [ ] Premium badge displays
- [ ] 2x XP works (if implemented)

---

## Implementation Order (Recommended)

### Week 1: Foundation
1. **Day 1-2**: Phase 1 - Level System
   - Create level calculation logic
   - Build level-up celebration
   - Update XP bar

2. **Day 3-4**: Phase 2 - Hint System
   - Build hints menu
   - Implement hint spending
   - Create reveal screens

### Week 2: Polish
3. **Day 5-6**: Phase 3 - Streak System
   - Add streak tracking
   - Build streak UI
   - Implement rewards

4. **Day 7**: Phase 4 - Premium Integration
   - Add unlimited hints for premium
   - Polish UI for premium users

---

## Success Metrics

After implementation, track:
- **Level Distribution**: How many users at each level
- **Hint Usage**: Which hint features are most popular
- **Streak Retention**: % of users with 7+ day streaks
- **Premium Conversion**: Do gamification features drive upgrades?

---

## Future Enhancements

- **Leaderboards**: Compare levels with friends
- **Achievements**: Badges for milestones
- **Seasonal Events**: Limited-time XP bonuses
- **Hint Packs**: In-app purchase for hint bundles
- **Daily Challenges**: Bonus XP for specific tasks

---

## Notes

- All XP values are tunable - adjust based on user testing
- Hint costs can be rebalanced based on usage data
- Streak system should be forgiving (allow 1 missed day recovery)
- Premium benefits should feel generous but not game-breaking

---

**Ready to start implementation? Begin with Phase 1: Level System!**
