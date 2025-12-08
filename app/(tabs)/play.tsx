import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

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
    marginBottom: 48,
  },
  hubContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  hubButton: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
  },
  hubButtonEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  hubButtonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  hubButtonSubtitle: {
    fontSize: 14,
    color: colors.muted,
  },
});

export default function PlayScreen() {
  const { userData, loading } = useUser();
  const router = useRouter();
  const theme = useTheme();

  if (!theme) throw new Error('PlayScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);

  if (loading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const hasPartner = !!userData.coupleId;

  return (
    <Animated.View style={styles.hubContainer} entering={FadeIn.duration(300)}>
      <Text style={styles.title}>{hasPartner ? 'Ready to Play?' : 'Solo Mode'}</Text>
      <Text style={styles.subtitle}>
        {hasPartner ? "Let's find your next great meal together." : 'Connect with your partner or explore solo features.'}
      </Text>

      {/* Start Swiping - only show if partnered */}
      {hasPartner && (
        <TouchableOpacity style={styles.hubButton} onPress={() => router.push('/play-vibe' as any)}>
          <Text style={styles.hubButtonEmoji}>🎉</Text>
          <Text style={styles.hubButtonTitle}>Start Swiping</Text>
          <Text style={styles.hubButtonSubtitle}>Begin a new session with your partner.</Text>
        </TouchableOpacity>
      )}

      {/* Connect with Partner - only show if solo */}
      {!hasPartner && (
        <TouchableOpacity style={styles.hubButton} onPress={() => router.push('/(tabs)/connect' as any)}>
          <Text style={styles.hubButtonEmoji}>💑</Text>
          <Text style={styles.hubButtonTitle}>Connect with Partner</Text>
          <Text style={styles.hubButtonSubtitle}>Link up and start swiping together!</Text>
        </TouchableOpacity>
      )}

      {/* Date Night Planner - always show */}
      <TouchableOpacity style={styles.hubButton} onPress={() => router.push('/solo/date-planner' as any)}>
        <Text style={styles.hubButtonEmoji}>💌</Text>
        <Text style={styles.hubButtonTitle}>Date Night Planner</Text>
        <Text style={styles.hubButtonSubtitle}>Plan a perfect date night experience.</Text>
      </TouchableOpacity>

      {/* Dinner Companion - always show */}
      <TouchableOpacity style={styles.hubButton} onPress={() => router.push('/solo/dinner-companion' as any)}>
        <Text style={styles.hubButtonEmoji}>🧘</Text>
        <Text style={styles.hubButtonTitle}>Dinner Companion</Text>
        <Text style={styles.hubButtonSubtitle}>A guided mindfulness session, just for you.</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
