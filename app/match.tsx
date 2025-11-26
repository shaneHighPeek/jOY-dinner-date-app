import { Text, View, TouchableOpacity, StyleSheet, Linking, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 40,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cuisineName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  funnyPhrase: {
    fontSize: 16,
    color: colors.accent,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.card,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  orderButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  keepSwipingButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  keepSwipingText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '600',
  },
});

const funnyPhrases = [
  "Harmony tastes like sushi 🍣!",
  "Two forks, one dish! 🍴",
  "Love at first bite! 💕",
  "You both have great taste! 😋",
  "Dinner debate: SOLVED! 🎯",
  "Match made in food heaven! ✨",
  "Your taste buds are in sync! 🎵",
  "Foodie soulmates detected! 💫",
];

export default function MatchScreen() {
  const router = useRouter();
  const { itemName } = useLocalSearchParams();
  const theme = useTheme();
  const { user } = useAuth();
  const { userData } = useUser();
  const confettiRef = useRef<any>(null);
  const [funnyPhrase] = useState(() => funnyPhrases[Math.floor(Math.random() * funnyPhrases.length)]);
  
  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  useEffect(() => {
    // Trigger confetti on mount
    if (confettiRef.current) {
      confettiRef.current.start();
    }

    // Track match count
    const trackMatch = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        
        // Increment match count
        await updateDoc(userRef, {
          matchCount: increment(1),
        });

        // Get updated match count
        const updatedUserSnap = await getDoc(userRef);
        const updatedUserData = updatedUserSnap.data();
        const currentMatchCount = updatedUserData?.matchCount || 0;

        console.log('Current match count:', currentMatchCount);

        // Check if this is the 3rd match
        if (currentMatchCount === 3 && !updatedUserData?.hasReviewed) {
          console.log('Showing review prompt after 3 matches!');
          // Show review prompt after a delay
          setTimeout(() => {
            router.push('/review-prompt' as any);
          }, 2000);
        }
      } catch (error) {
        console.error('Failed to track match:', error);
      }
    };

    trackMatch();
  }, []);

  const handleFindNearby = () => {
    const query = encodeURIComponent(itemName as string || 'restaurant');
    const url = Platform.select({
      ios: `maps://maps.apple.com/?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/${query}`,
    });
    Linking.openURL(url);
  };

  const handleOrderIn = async () => {
    const query = encodeURIComponent(itemName as string || 'food');
    
    // Define delivery app options with their URL schemes
    const deliveryApps = [
      {
        name: 'Uber Eats',
        scheme: `https://www.ubereats.com/search?q=${query}`, // Web URL works better
        appStoreUrl: 'https://apps.apple.com/app/uber-eats-food-delivery/id1058959277',
      },
      {
        name: 'DoorDash', 
        scheme: `https://www.doordash.com/search/store/${query}`,
        appStoreUrl: 'https://apps.apple.com/app/doordash-food-delivery/id719972451',
      },
    ];

    // Show action sheet with delivery options
    const buttons = deliveryApps.map(app => app.name);
    buttons.push('Cancel');

    Alert.alert(
      'Order Delivery',
      `Search for "${itemName}" on:`,
      [
        {
          text: 'Uber Eats',
          onPress: () => Linking.openURL(`https://www.ubereats.com/search?q=${query}`),
        },
        {
          text: 'DoorDash',
          onPress: () => Linking.openURL(`https://www.doordash.com/search/store/${query}`),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleKeepSwiping = () => {
    router.back();
  };

  // Test function - remove in production
  const handleTestReview = () => {
    router.push('/review-prompt' as any);
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      {/* Test Review Button - Remove in production */}
      <TouchableOpacity 
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          zIndex: 1000,
        }}
        onPress={handleTestReview}
      >
        <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
          TEST REVIEW
        </Text>
      </TouchableOpacity>

      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut={true}
      />
      
      <View style={styles.content}>
        <Animated.Text 
          style={styles.emoji}
          entering={FadeInDown.duration(800).delay(200)}
        >
          ✨
        </Animated.Text>
        <Animated.Text 
          style={styles.title}
          entering={FadeInDown.duration(800).delay(400)}
        >
          You Matched!
        </Animated.Text>
        
        <Animated.Text 
          style={styles.cuisineName}
          entering={FadeInDown.duration(800).delay(500)}
        >
          {itemName || 'Something Delicious'}
        </Animated.Text>
        
        <Animated.Text 
          style={styles.funnyPhrase}
          entering={FadeInDown.duration(800).delay(600)}
        >
          {funnyPhrase}
        </Animated.Text>

        <Animated.View
          entering={FadeInUp.duration(800).delay(800)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleFindNearby}
          >
            <Text style={styles.primaryButtonText}>🗺️  Find Nearby</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.orderButton} 
            onPress={handleOrderIn}
          >
            <Text style={styles.orderButtonText}>📦  Order In</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.keepSwipingButton} 
            onPress={handleKeepSwiping}
          >
            <Text style={styles.keepSwipingText}>Keep Swiping</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
