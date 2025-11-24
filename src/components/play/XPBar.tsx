import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getProgressToNextLevel } from '@/utils/levelSystem';

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

const createStyles = (colors: Colors) => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      padding: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    levelText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '600',
      marginBottom: 5,
      letterSpacing: 0.5,
    },
    xpText: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 4,
    },
    barBackground: {
      width: '100%',
      height: 10,
      backgroundColor: colors.border,
      borderRadius: 5,
      overflow: 'hidden',
      position: 'relative',
    },
  });

  return {
    ...styles,
    barProgress: (progress: number): ViewStyle => ({
      width: `${progress}%`,
      height: '100%',
      backgroundColor: colors.accent,
    }),
  };
};

interface XPBarProps {
  xp: number;
}

export const XPBar = ({ xp }: XPBarProps) => {
  const theme = useTheme();
  if (!theme) throw new Error('XPBar must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);
  
  const { currentLevel, nextLevel, progress, xpIntoLevel, xpNeeded } = getProgressToNextLevel(xp);
  const progressPercent = progress * 100;

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <Text style={styles.levelText}>
        {currentLevel.title} - Level {currentLevel.level}
        {nextLevel && ` → ${nextLevel.level}`}
      </Text>
      <View style={styles.barBackground}>
        <Animated.View 
          style={[{ position: 'absolute' }, styles.barProgress(progressPercent)]}
          entering={FadeIn.duration(600)}
        />
      </View>
      {nextLevel && (
        <Text style={styles.xpText}>
          {Math.floor(xpIntoLevel)} / {xpNeeded} XP
        </Text>
      )}
      {!nextLevel && (
        <Text style={styles.xpText}>Max Level Reached! 🎉</Text>
      )}
    </Animated.View>
  );
};
