import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/hooks/useOnboarding';
import { SwipeableCard } from '@/components/onboarding/SwipeableCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: '#17202A',
    textAlign: 'center',
    position: 'absolute',
    top: 100,
  },
});

const initialCuisines = [
  { id: '1', name: 'Italian' },
  { id: '2', name: 'Mexican' },
  { id: '3', name: 'Japanese' },
  { id: '4', name: 'Indian' },
  { id: '5', name: 'Thai' },
  { id: '6', name: 'Chinese' },
  { id: '7', name: 'American' },
  { id: '8', name: 'French' },
  { id: '9', name: 'Greek' },
  { id: '10', name: 'Spanish' },
];

export default function CuisineScreen() {
  const router = useRouter();
  const { addCuisinePreference } = useOnboarding();
  const [cuisines, setCuisines] = useState(initialCuisines);

  const handleSwipe = (item: { id: string; name: string }, direction: 'left' | 'right') => {
    if (direction === 'right') {
      addCuisinePreference(item.name);
    }

    setCuisines(prev => prev.filter(c => c.id !== item.id));

    if (cuisines.length === 1) {
      router.push('/onboarding/progress');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are you in the mood for?</Text>
      {cuisines.map((item, index) => (
        <SwipeableCard
          key={item.id}
          item={item}
          onSwipe={handleSwipe}
          index={index}
        />
      )).reverse()}
    </View>
  );
}
