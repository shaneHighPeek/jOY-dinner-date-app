import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, FadeInUp } from 'react-native-reanimated';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 40,
  },
  progressContainer: {
    height: 12,
    width: '80%',
    backgroundColor: colors.card,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});

export default function ProgressScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { name, avatar, vibe, cuisinePreferences } = useOnboarding();
  const { user } = useAuth();
  const progress = useSharedValue(0);

  useEffect(() => {
    const createUserProfile = async () => {
      if (!user) return;

      progress.value = withTiming(1, { 
        duration: 2000, 
        easing: Easing.out(Easing.exp),
      });

      try {
        // Calculate trial end date (3 days from now)
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 3);

        await setDoc(doc(db, 'users', user.uid), {
          name,
          avatar,
          vibe,
          cuisinePreferences,
          createdAt: serverTimestamp(),
          xp: 0,
          level: 1,
          hints: 1, // Start with 1 hint after onboarding
          isPremium: false, // Not premium, just on trial
          isLifetime: false,
          trialStartDate: serverTimestamp(),
          trialEndDate: trialEndDate, // 3-day trial
          onboardingComplete: false, // Will be set to true on paywall screen
        });

        setTimeout(() => {
          router.push('/onboarding/congratulations');
        }, 500);
      } catch (error) {
        console.error('Failed to create user profile:', error);
        // Handle error, maybe show a message to the user
      }
    };

    createUserProfile();
  }, [user, router]);

  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeInUp.duration(500)} style={styles.title}>
        Creating your taste profile...
      </Animated.Text>
      <Animated.Text entering={FadeInUp.duration(500).delay(200)} style={styles.subtitle}>
        Good things take a second.
      </Animated.Text>
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, animatedStyle]} />
      </View>
    </View>
  );
}
