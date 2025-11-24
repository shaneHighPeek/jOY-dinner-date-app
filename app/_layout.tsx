import { ThemeProvider as NavThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { PremiumProvider } from '@/contexts/PremiumContext';
import { useUser } from '@/hooks/useUser';
import { calculateStreakUpdate, STREAK_REWARDS } from '@/utils/streakSystem';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const unstable_settings = {
  initialRouteName: 'welcome',
};

function RootNavigator() {
  const { isDarkMode } = useTheme() || {};
  const { user, onboardingComplete, loading } = useAuth();
  const { userData } = useUser();
  const segments = useSegments();
  const router = useRouter();

  // Check and update streak on app open
  useEffect(() => {
    if (!user || !userData) return;

    const checkStreak = async () => {
      try {
        const streakUpdate = calculateStreakUpdate(
          userData.lastActiveDate || null,
          userData.currentStreak || 0,
          userData.streakRewards || {
            '3day': false,
            '7day': false,
            '14day': false,
            '30day': false,
          }
        );

        if (!streakUpdate.shouldUpdate) return;

        const userRef = doc(db, 'users', user.uid);
        const updates: any = {
          currentStreak: streakUpdate.newStreak,
          lastActiveDate: new Date().toISOString().split('T')[0],
        };

        // Update longest streak if needed
        if (streakUpdate.newStreak > (userData.longestStreak || 0)) {
          updates.longestStreak = streakUpdate.newStreak;
        }

        // Award hints for milestone
        if (streakUpdate.milestoneReached && streakUpdate.hintsEarned) {
          updates.hints = (userData.hints || 0) + streakUpdate.hintsEarned;
          
          // Mark milestone as claimed
          const milestoneKey = `${streakUpdate.milestoneReached}day`;
          updates[`streakRewards.${milestoneKey}`] = true;

          // Show celebration
          setTimeout(() => {
            router.push({
              pathname: '/streak-milestone' as any,
              params: {
                streak: streakUpdate.newStreak.toString(),
                milestone: streakUpdate.milestoneReached!.toString(),
                hintsEarned: streakUpdate.hintsEarned!.toString(),
              },
            });
          }, 1000); // Delay to let app load first
        }

        await updateDoc(userRef, updates);
      } catch (error) {
        console.error('Error updating streak:', error);
      }
    };

    checkStreak();
  }, [user, userData?.lastActiveDate]);

  useEffect(() => {
    if (loading) return;

    const inWelcomeGroup = segments[0] === 'welcome';

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('Navigation check:', { user: !!user, onboardingComplete, segments });

    if (inWelcomeGroup) return;

    if (!user && !inAuthGroup) {
      // Redirect to the login page.
      console.log('Redirecting to login');
      router.replace('/login');
    } else if (user && !onboardingComplete && !inOnboardingGroup) {
      // Redirect to the onboarding flow.
      console.log('Redirecting to onboarding');
      router.replace('/onboarding' as any);
    } else if (user && onboardingComplete && !inTabsGroup) {
      // Redirect to the main app.
      console.log('Redirecting to main app');
      router.replace('/play');
    }
  }, [user, onboardingComplete, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const navTheme = isDarkMode ? DarkTheme : DefaultTheme;

  return (
    <NavThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AuthProvider>
            <PremiumProvider>
              <RootNavigator />
            </PremiumProvider>
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}


