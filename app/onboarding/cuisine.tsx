import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/hooks/useOnboarding';
import { SwipeableCard, SwipeableCardRef } from '@/components/onboarding/SwipeableCard';
import { cuisines as allCuisines } from '@/data';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 80,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 40,
  },
  progressBar: {
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: colors.muted,
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});


export default function CuisineScreen() {
  const router = useRouter();
  const { addCuisinePreference } = useOnboarding();
  const [cuisines, setCuisines] = useState(allCuisines.slice(0, 8));
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const swipeableCardRefs = useRef<SwipeableCardRef[]>([]);
  const theme = useTheme();
  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  // Images are preloaded at app startup in _layout.tsx
  // This just ensures they're ready (should be instant since preload started earlier)
  useEffect(() => {
    // Give a tiny moment for any in-flight prefetch to complete
    // Images should already be cached from _layout.tsx preload
    const timer = setTimeout(() => {
      setImagesLoaded(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSwipe = (item: (typeof allCuisines)[0], direction: 'left' | 'right') => {
    if (direction === 'right') {
      addCuisinePreference(item.name);
    }

    // The swipe is initiated by the button, so we need to manually remove the card
    // from the state here.
    setTimeout(() => {
      setCuisines(prev => prev.filter(c => c.id !== item.id));
      if (cuisines.length === 1) {
        router.push('/onboarding/progress');
      }
    }, 300); // Delay to allow swipe animation to complete
  };

  const handleButtonPress = (direction: 'left' | 'right') => {
    // The topmost card is at index 0 after reversing
    const currentCardRef = swipeableCardRefs.current[0];
    if (currentCardRef) {
      currentCardRef.swipe(direction);
    }
  };

  // Show loading indicator while images are preloading
  if (!imagesLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.subtitle, { marginTop: 16 }]}>Preparing your experience...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={styles.progressContainer} entering={FadeIn.duration(500)}>
        <View style={[styles.progressBar, { backgroundColor: colors.primary, width: '80%' }]} />
      </Animated.View>

      <Animated.Text entering={FadeInUp.duration(500).delay(200)} style={styles.title}>
        Tell us what you like
      </Animated.Text>
      <Animated.Text entering={FadeInUp.duration(500).delay(400)} style={styles.subtitle}>
        Vote on a few cuisines to get started.
      </Animated.Text>

      <View style={styles.deckContainer}>
        {cuisines.map((item, index) => (
          <SwipeableCard
            ref={(ref) => {
              if (ref) {
                swipeableCardRefs.current[index] = ref;
              }
            }}
            key={item.id}
            item={item}
            onSwipe={handleSwipe}
            index={index}
          />
        )).reverse()}
      </View>

      <Animated.View entering={FadeInDown.duration(500).delay(800)} style={styles.buttonContainer}>
        <TouchableOpacity style={styles.circleButton} onPress={() => handleButtonPress('left')}>
          <Image source={require('../../assets/images/cross.png')} style={{ width: 40, height: 40 }} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton} onPress={() => handleButtonPress('right')}>
          <Image source={require('../../assets/images/heart2.png')} style={{ width: 40, height: 40 }} resizeMode="contain" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
