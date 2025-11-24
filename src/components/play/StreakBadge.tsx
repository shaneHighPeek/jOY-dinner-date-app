import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { getStreakEmoji } from '@/utils/streakSystem';
import Animated, { FadeIn } from 'react-native-reanimated';

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
};

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});

interface StreakBadgeProps {
  streak: number;
  isPremium?: boolean;
}

export const StreakBadge = ({ streak, isPremium = false }: StreakBadgeProps) => {
  const theme = useTheme();
  if (!theme) throw new Error('StreakBadge must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);
  
  const emoji = getStreakEmoji(streak);
  
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.streakText}>
        {streak} day{streak !== 1 ? 's' : ''}
        {isPremium && ' 👑'}
      </Text>
    </Animated.View>
  );
};
