import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { foodItems as initialFoodItems } from '@/data';
import { SwipeableCard } from '@/components/onboarding/SwipeableCard';
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

// Shuffle array helper function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function PlaySwipeScreen() {
  const { vibe } = useLocalSearchParams<{ vibe: string }>();
  const theme = useTheme();
  const { userData, loading: userLoading } = useUser();
  const { user } = useAuth();
  const router = useRouter();
  const [foodItems, setFoodItems] = useState<typeof initialFoodItems>([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const swipeableCardRefs = useRef<Array<{ swipe: (direction: 'left' | 'right') => void } | null>>([]);

  // Initialize with shuffled food items
  useEffect(() => {
    setFoodItems(shuffleArray(initialFoodItems));
  }, []);

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
        
        // If running low (less than 10 items), add more shuffled items
        if (remaining.length < 10) {
          const newBatch = shuffleArray(initialFoodItems);
          return [...remaining, ...newBatch];
        }
        
        return remaining;
      });
    }, 300);

    try {
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

  if (userLoading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      {/* Test Match Button - Remove in production */}
      <TouchableOpacity style={styles.testMatchButton} onPress={handleTestMatch}>
        <Text style={styles.testMatchText}>TEST MATCH</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Level {userData.level || 1}</Text>
        </View>
        <View style={styles.hintsContainer}>
          <Text style={styles.hintIcon}>💡</Text>
          <Text style={styles.hintText}>{userData.hints || 0}</Text>
        </View>
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
