import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import ConfettiCannon from 'react-native-confetti-cannon';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
};

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  level: {
    fontSize: 36,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.accent,
    marginBottom: 40,
    textAlign: 'center',
  },
  reward: {
    backgroundColor: colors.card,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  rewardText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  continueButton: {
    marginTop: 40,
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  premiumBadge: {
    fontSize: 24,
    marginLeft: 8,
  },
});

export default function LevelUpScreen() {
  const { level, title, hintsEarned, isPremium } = useLocalSearchParams<{
    level: string;
    title: string;
    hintsEarned: string;
    isPremium?: string;
  }>();
  const router = useRouter();
  const theme = useTheme();
  
  if (!theme) throw new Error('LevelUpScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);
  
  useEffect(() => {
    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      router.back();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  const handleContinue = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut={true} />
      
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.emoji}>🎉</Text>
      </Animated.View>
      
      <Animated.Text entering={FadeInUp.duration(500).delay(200)} style={styles.title}>
        Level Up!
      </Animated.Text>
      
      <Animated.View entering={FadeInUp.duration(500).delay(400)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.level}>Level {level}</Text>
        {isPremium === 'true' && Number(level) >= 10 && (
          <Text style={styles.premiumBadge}>👑</Text>
        )}
      </Animated.View>
      
      <Animated.Text entering={FadeInUp.duration(500).delay(600)} style={styles.levelTitle}>
        {title}
      </Animated.Text>
      
      <Animated.View entering={FadeInUp.duration(500).delay(800)} style={styles.reward}>
        <Text style={styles.rewardText}>
          💡 +{hintsEarned} Hint{Number(hintsEarned) > 1 ? 's' : ''} Earned!
        </Text>
      </Animated.View>
      
      <Animated.View entering={FadeInUp.duration(500).delay(1000)}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
