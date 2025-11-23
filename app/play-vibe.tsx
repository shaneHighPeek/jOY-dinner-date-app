import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

const vibes = [
  { name: 'Date Night', emoji: '🍷', icon: 'wine-glass' },
  { name: 'Healthy', emoji: '🥗', icon: 'salad' },
  { name: 'Quick Eats', emoji: '⚡', icon: 'zap' },
  { name: 'Adventurous', emoji: '🌮', icon: 'globe' },
];

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  error: string;
};

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
  },
  vibeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  vibeTile: {
    width: '48%',
    aspectRatio: 1.2,
    backgroundColor: colors.card,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vibeTileSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  vibeEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  vibeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  buttonContainer: {
    gap: 12,
  },
  startButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: colors.muted,
    opacity: 0.5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  surpriseButton: {
    backgroundColor: 'transparent',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  surpriseButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default function PlayVibeScreen() {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();
  
  if (!theme) throw new Error('PlayVibeScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleStartSwiping = () => {
    if (!selectedVibe) return;
    router.push({
      pathname: '/(tabs)/play-swipe' as any,
      params: { vibe: selectedVibe },
    });
  };

  const handleSurpriseMe = () => {
    // TODO: Revert this to '/play-surprise' after testing
    router.push('/recipe/123' as any); // Navigate to the recipe page with a mock ID
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
      <Animated.View style={styles.header} entering={FadeInUp.duration(500).delay(200)}>
        <Text style={styles.icon}>🎉</Text>
        <Text style={styles.title}>What's the vibe?</Text>
        <Text style={styles.subtitle}>Choose a mood to tailor your session.</Text>
      </Animated.View>

      <View style={styles.vibeGrid}>
        {vibes.map((vibe, index) => (
          <TouchableOpacity
            key={vibe.name}
            style={[
              styles.vibeTile,
              selectedVibe === vibe.name && styles.vibeTileSelected,
            ]}
            onPress={() => setSelectedVibe(vibe.name)}
          >
            <Text style={styles.vibeEmoji}>{vibe.emoji}</Text>
            <Text style={styles.vibeText}>{vibe.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.startButton, !selectedVibe && styles.startButtonDisabled]}
          onPress={handleStartSwiping}
          disabled={!selectedVibe}
        >
          <Text style={styles.startButtonText}>Start Swiping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.surpriseButton}
          onPress={handleSurpriseMe}
        >
          <Text style={styles.surpriseButtonText}>🧪 TEST RECIPE PAGE</Text>
        </TouchableOpacity>

      </View>
    </Animated.View>
  );
}
