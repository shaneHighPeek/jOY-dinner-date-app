import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { foodItems as defaultFoodItems } from '@/data';
import { getUserMeals, MealItem } from '@/services/mealService';
import { checkLevelUp } from '@/utils/levelSystem';
import { SwipeableCard } from '@/components/onboarding/SwipeableCard';
import { StreakBadge } from '@/components/play/StreakBadge';
import Animated, { FadeIn } from 'react-native-reanimated';

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  error: string;
  border: string;
};

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  levelBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  hintsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  hintIcon: {
    fontSize: 18,
  },
  hintText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
    gap: 40,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dislikeButton: {
    backgroundColor: colors.error,
  },
  likeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonIcon: {
    fontSize: 32,
  },
  testMatchButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  testMatchText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

// Seeded random number generator for consistent shuffling between partners
const seededRandom = (seed: number): (() => number) => {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
};

// Convert string to numeric seed
const stringToSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Shuffle array with optional seed for consistent ordering between partners
const shuffleArray = <T,>(array: T[], seed?: string): T[] => {
  const shuffled = [...array];
  const random = seed ? seededRandom(stringToSeed(seed)) : Math.random;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get today's date as string for daily deck rotation
const getTodaysSeed = (coupleId: string): string => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `${coupleId}-${today}`;
};

export default function PlaySwipeScreen() {
  const { vibe } = useLocalSearchParams<{ vibe: string }>();
  const theme = useTheme();
  const { userData, loading: userLoading } = useUser();
  const { user } = useAuth();
  const router = useRouter();
  const [foodItems, setFoodItems] = useState<MealItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [swipeCount, setSwipeCount] = useState(0);
  const swipeableCardRefs = useRef<Array<{ swipe: (direction: 'left' | 'right') => void } | null>>([]);

  // Fetch all meals (default + custom) and shuffle them
  // If user has a partner, use seeded shuffle so both see same order
  useEffect(() => {
    if (user && userData !== null) {
      const fetchMeals = async () => {
        setIsLoading(true);
        const allMeals = await getUserMeals(user.uid);
        
        // Use seeded shuffle if user has a partner (coupleId)
        // This ensures both partners see foods in the same order
        if (userData?.coupleId) {
          const seed = getTodaysSeed(userData.coupleId);
          console.log('Using shared deck with seed:', seed);
          setFoodItems(shuffleArray(allMeals, seed));
        } else {
          // Solo user gets random shuffle
          setFoodItems(shuffleArray(allMeals));
        }
        setIsLoading(false);
      };
      fetchMeals();
    }
  }, [user, userData?.coupleId]);

  if (!theme) throw new Error('PlaySwipeScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleSwipe = async (item: { id: string; name: string }, direction: 'left' | 'right') => {
    if (!user || !userData) return;

    // Increment swipe count
    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);

    // Check if user has no partner and has swiped 3 times
    if (!userData.coupleId && newSwipeCount >= 3) {
      router.push('/partner-prompt' as any);
      return;
    }

    setTimeout(() => {
      setFoodItems(prev => {
        const remaining = prev.filter(i => i.id !== item.id);
        
        // If running low (less than 10 items), add more shuffled default items
        if (remaining.length < 10) {
          // Use same seed for partners, random for solo users
          const seed = userData?.coupleId ? getTodaysSeed(userData.coupleId) + '-refill' : undefined;
          const newBatch = shuffleArray(defaultFoodItems, seed);
          return [...remaining, ...newBatch];
        }
        
        return remaining;
      });
    }, 300);

    try {
      // Award XP for the swipe (2x for premium users)
      const oldXP = userData.xp || 0;
      const baseXP = 10;
      const xpGained = userData.isPremium === true ? baseXP * 2 : baseXP;
      const newXP = oldXP + xpGained;
      
      // Check for level up
      const { didLevelUp, newLevel } = checkLevelUp(oldXP, newXP);
      
      // Update user XP
      const userRef = doc(db, 'users', user.uid);
      const userUpdates: any = { xp: newXP };
      
      // If leveled up, award hints and update level
      if (didLevelUp) {
        const hintsEarned = 1;
        userUpdates.hints = (userData.hints || 0) + hintsEarned;
        userUpdates.level = newLevel.level;
        
        // Update Firestore first
        await updateDoc(userRef, userUpdates);
        
        // Show level-up celebration
        router.push({
          pathname: '/level-up' as any,
          params: {
            level: newLevel.level.toString(),
            title: newLevel.title,
            hintsEarned: hintsEarned.toString(),
            isPremium: userData.isPremium ? 'true' : 'false',
          },
        });
      } else {
        // Just update XP
        await updateDoc(userRef, userUpdates);
      }
      
      // Record the vote
      const voteRef = doc(db, 'votes', `${user.uid}_${item.id}`);
      await setDoc(voteRef, {
        userId: user.uid,
        itemId: item.id,
        liked: direction === 'right',
        timestamp: serverTimestamp(),
        vibe: vibe || 'none',
      });

      if (direction === 'right' && userData.coupleId) {
        const partnerId = userData.partnerId;
        const partnerVoteRef = doc(db, 'votes', `${partnerId}_${item.id}`);
        const partnerVoteSnap = await getDoc(partnerVoteRef);

        if (partnerVoteSnap.exists() && partnerVoteSnap.data().liked) {
          const matchRef = doc(db, 'matches', `${userData.coupleId}_${item.id}`);
          await setDoc(matchRef, {
            coupleId: userData.coupleId,
            itemId: item.id,
            itemName: item.name,
            timestamp: serverTimestamp(),
          });

          router.push({ pathname: '/match', params: { itemName: item.name } });
        }
      }
    } catch (error) {
      console.error('Failed to record vote or check match:', error);
    }
  };

  const handleButtonPress = (direction: 'left' | 'right') => {
    const currentCardRef = swipeableCardRefs.current[0];
    if (currentCardRef) {
      currentCardRef.swipe(direction);
    }
  };

  // Test match function - simulates a match for testing
  const handleTestMatch = () => {
    const currentItem = foodItems[0];
    if (currentItem) {
      router.push({ pathname: '/match', params: { itemName: currentItem.name } });
    }
  };

  // Test level-up function - adds 100 XP to trigger level-up
  const handleTestLevelUp = async () => {
    if (!user || !userData) return;
    
    const oldXP = userData.xp || 0;
    const newXP = oldXP + 100; // Add 100 XP
    
    const { didLevelUp, newLevel } = checkLevelUp(oldXP, newXP);
    const userRef = doc(db, 'users', user.uid);
    
    if (didLevelUp) {
      const hintsEarned = 1;
      await updateDoc(userRef, {
        xp: newXP,
        hints: (userData.hints || 0) + hintsEarned,
        level: newLevel.level,
      });
      
      router.push({
        pathname: '/level-up' as any,
        params: {
          level: newLevel.level.toString(),
          title: newLevel.title,
          hintsEarned: hintsEarned.toString(),
          isPremium: userData.isPremium ? 'true' : 'false',
        },
      });
    } else {
      await updateDoc(userRef, { xp: newXP });
      alert(`Added 100 XP! Total: ${newXP} XP`);
    }
  };

  // Test partner function - simulates having a partner
  const handleTestPartner = async () => {
    if (!user || !userData) return;
    
    const userRef = doc(db, 'users', user.uid);
    
    if (userData.partnerId) {
      // Remove partner
      await updateDoc(userRef, {
        partnerId: null,
        coupleId: null,
      });
      alert('Partner removed!');
    } else {
      // Add fake partner (use your own user ID as partner for testing)
      await updateDoc(userRef, {
        partnerId: user.uid, // Self as partner for testing
        coupleId: `test_${user.uid}`,
      });
      alert('Test partner added! You can now use hints.');
    }
  };

  // Test streak function - advances streak by 1 day
  const handleTestStreak = async () => {
    if (!user || !userData) return;
    
    const userRef = doc(db, 'users', user.uid);
    const newStreak = (userData.currentStreak || 0) + 1;
    
    // Check if this is a milestone
    const milestones = [3, 7, 14, 30];
    const milestone = milestones.find(m => m === newStreak);
    
    const updates: any = {
      currentStreak: newStreak,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    
    if (newStreak > (userData.longestStreak || 0)) {
      updates.longestStreak = newStreak;
    }
    
    if (milestone) {
      const hintsEarned = milestone === 3 ? 1 : milestone === 7 ? 2 : milestone === 14 ? 3 : 5;
      updates.hints = (userData.hints || 0) + hintsEarned;
      updates[`streakRewards.${milestone}day`] = true;
      
      await updateDoc(userRef, updates);
      
      router.push({
        pathname: '/streak-milestone' as any,
        params: {
          streak: newStreak.toString(),
          milestone: milestone.toString(),
          hintsEarned: hintsEarned.toString(),
        },
      });
    } else {
      await updateDoc(userRef, updates);
      alert(`Streak: ${newStreak} days! Keep going!`);
    }
  };

  // Test premium function - toggles premium status
  const handleTestPremium = async () => {
    if (!user || !userData) return;
    
    const userRef = doc(db, 'users', user.uid);
    const newPremiumStatus = !userData.isPremium;
    
    await updateDoc(userRef, {
      isPremium: newPremiumStatus,
    });
    
    alert(newPremiumStatus ? 'Premium activated! 👑\n- Unlimited hints\n- 2x XP boost\n- Exclusive titles' : 'Premium deactivated');
  };

  if (userLoading || !userData || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.muted, marginTop: 16 }}>Loading your kitchen...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      {/* Test Match Button - Remove in production */}
      <TouchableOpacity style={styles.testMatchButton} onPress={handleTestMatch}>
        <Text style={styles.testMatchText}>TEST MATCH</Text>
      </TouchableOpacity>

      {/* Test Level-Up Button - Remove in production */}
      <TouchableOpacity 
        style={[styles.testMatchButton, { top: 160 }]} 
        onPress={handleTestLevelUp}
      >
        <Text style={styles.testMatchText}>+100 XP</Text>
      </TouchableOpacity>

      {/* Test Partner Button - Remove in production */}
      <TouchableOpacity 
        style={[styles.testMatchButton, { top: 220 }]} 
        onPress={handleTestPartner}
      >
        <Text style={styles.testMatchText}>{userData.partnerId ? 'REMOVE PARTNER' : 'ADD PARTNER'}</Text>
      </TouchableOpacity>

      {/* Test Streak Button - Remove in production */}
      <TouchableOpacity 
        style={[styles.testMatchButton, { top: 280 }]} 
        onPress={handleTestStreak}
      >
        <Text style={styles.testMatchText}>+1 DAY STREAK</Text>
      </TouchableOpacity>

      {/* Test Premium Button - Remove in production */}
      <TouchableOpacity 
        style={[styles.testMatchButton, { top: 340 }]} 
        onPress={handleTestPremium}
      >
        <Text style={styles.testMatchText}>{userData.isPremium ? 'DISABLE PREMIUM' : 'ENABLE PREMIUM'}</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        {/* This space is intentionally left blank to push hints to the right */}
        <View style={{ flex: 1 }} />
        <TouchableOpacity 
          style={styles.hintsContainer}
          onPress={() => router.push('/hints-menu' as any)}
        >
          <Text style={styles.hintIcon}>💡</Text>
          <Text style={styles.hintText}>{userData.isPremium === true ? '∞' : (userData.hints || 0)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.deckContainer}>
        {foodItems.slice(0, 3).map((item, index) => (
          <SwipeableCard
            key={item.id}
            item={item}
            onSwipe={handleSwipe}
            index={index}
            ref={(ref) => {
              swipeableCardRefs.current[index] = ref;
            }}
          />
        )).reverse()}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={() => handleButtonPress('left')}
        >
          <Text style={styles.buttonIcon}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleButtonPress('right')}
        >
          <Text style={styles.buttonIcon}>♥</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
