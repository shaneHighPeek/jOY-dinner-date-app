import React from 'react';
import { Dimensions, Text, StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
  card: {
    width: '90%',
    height: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    color: '#17202A',
    fontWeight: 'bold',
  },
});

interface SwipeableCardProps {
  item: { id: string; name: string };
  onSwipe: (item: { id: string; name: string }, direction: 'left' | 'right') => void;
  index: number;
}

export const SwipeableCard = ({ item, onSwipe, index }: SwipeableCardProps) => {
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
        <Text style={styles.cardTitle}>{item.name}</Text>
      </Animated.View>
    </GestureDetector>
  );
};
