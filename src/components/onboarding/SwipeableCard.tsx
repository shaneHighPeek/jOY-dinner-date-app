import React, { useImperativeHandle } from 'react';
import { Dimensions, Text, StyleSheet, View, ImageBackground } from 'react-native';
import { placeholderImages } from '@/data';
import { useTheme } from '@/theme/ThemeProvider';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const swipeThreshold = screenWidth * 0.4;

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
  imageBackground: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    height: '70%',
    backgroundColor: colors.card,
    borderRadius: 20,
    position: 'absolute',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    fontFamily: 'Georgia',
  },
});

export interface SwipeableCardRef {
  swipe: (direction: 'left' | 'right') => void;
}

interface SwipeableCardProps {
  item: { id: string; name: string; emoji: string; caption: string; image: { id: string; hint: string } };
  onSwipe: (item: { id: string; name: string; emoji: string; caption: string; image: { id: string; hint: string } }, direction: 'left' | 'right') => void;
  index: number;
}

export const SwipeableCard = React.forwardRef<SwipeableCardRef, SwipeableCardProps>(({ item, onSwipe, index }, ref) => {
  const imageUrl = placeholderImages[item.image.id as keyof typeof placeholderImages];
  const theme = useTheme();
  if (!theme) throw new Error('SwipeableCard must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) < swipeThreshold) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        return;
      }

      const direction = event.translationX > 0 ? 'right' : 'left';
      translateX.value = withSpring(
        Math.sign(event.translationX) * screenWidth * 1.5,
        { damping: 100, stiffness: 100 }
      );
      runOnJS(onSwipe)(item, direction);
    });

  useImperativeHandle(ref, () => ({
    swipe: (direction: 'left' | 'right') => {
      translateX.value = withSpring(
        direction === 'right' ? screenWidth * 1.5 : -screenWidth * 1.5,
        { damping: 100, stiffness: 100 }
      );
      runOnJS(onSwipe)(item, direction);
    },
  }));

  const animatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      translateX.value,
      [-screenWidth / 2, screenWidth / 2],
      [-15, 15],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <ImageBackground 
          source={{ uri: imageUrl }} 
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)'}} />
          <Text style={styles.cardTitle}>{item.name}</Text>
        </ImageBackground>
      </Animated.View>
    </GestureDetector>
  );
});