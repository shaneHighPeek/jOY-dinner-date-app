import React, { useEffect, useRef } from 'react';
import { ThemeProvider as NavThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ActivityIndicator, View, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { PremiumProvider } from '@/contexts/PremiumContext';
import { useUser } from '@/hooks/useUser';
import { calculateStreakUpdate, STREAK_REWARDS } from '@/utils/streakSystem';
import { doc, updateDoc, collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const unstable_settings = {
  initialRouteName: 'welcome',
};

// Note: Cuisine images are now bundled locally in assets/images/cuisines/
// No preloading needed - they load instantly

// Detects when a partner connects to the current user (from ANY screen)
// This handles the case where User B is on Play/Cookbook/Settings when User A connects
function PartnerConnectionDetector() {
  const { user } = useAuth();
  const { userData, loading: userLoading } = useUser();
  const router = useRouter();
  const segments = useSegments();
  
  // Track the previous coupleId to detect changes
  const previousCoupleIdRef = useRef<string | null | undefined>(undefined);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    // Don't run until we have user data loaded
    if (userLoading || !user) return;
    
    const currentCoupleId = userData?.coupleId || null;
    const previousCoupleId = previousCoupleIdRef.current;
    
    // Initialize on first load
    if (previousCoupleId === undefined) {
      previousCoupleIdRef.current = currentCoupleId;
      console.log('PartnerConnectionDetector: Initialized with coupleId:', currentCoupleId);
      return;
    }
    
    // Detect transition from no partner to having a partner
    const justGotConnected = previousCoupleId === null && currentCoupleId !== null;
    
    if (justGotConnected && !hasNavigatedRef.current) {
      console.log('PartnerConnectionDetector: Partner just connected! Previous:', previousCoupleId, 'Current:', currentCoupleId);
      
      // Check if we're already on the connection-success screen
      const isOnConnectionSuccess = segments.some(s => s === 'connection-success');
      
      if (!isOnConnectionSuccess) {
        hasNavigatedRef.current = true;
        console.log('PartnerConnectionDetector: Navigating to connection-success');
        // @ts-ignore - expo-router type inference issue
        router.push('/connection-success');
      }
    }
    
    // Update the ref for next comparison
    previousCoupleIdRef.current = currentCoupleId;
  }, [userData?.coupleId, userLoading, user, segments]);

  return null;
}

// Separate component for streak checking - only runs after user is in the app
function StreakChecker() {
  const { user } = useAuth();
  const { userData } = useUser();
  const router = useRouter();
  const streakCheckedRef = useRef(false);

  useEffect(() => {
    // Only check once per app session, and only when we have user data
    if (!user || !userData || streakCheckedRef.current) return;
    streakCheckedRef.current = true;

    const checkStreak = async () => {
      try {
        // Defensive Programming: Ensure streakRewards is a plain object.
        const safeStreakRewards = userData.streakRewards ? { ...userData.streakRewards } : {
          '3day': false,
          '7day': false,
          '14day': false,
          '30day': false,
        };

        const streakUpdate = calculateStreakUpdate(
          userData.lastActiveDate || null,
          userData.currentStreak || 0,
          safeStreakRewards
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

        // Award hints for milestone (only for non-premium users - premium have unlimited)
        if (streakUpdate.milestoneReached && streakUpdate.hintsEarned) {
          // Only add hints for non-premium users
          if (userData.isPremium !== true) {
            updates.hints = (userData.hints || 0) + streakUpdate.hintsEarned;
          }
          
          // Mark milestone as claimed
          const milestoneKey = `${streakUpdate.milestoneReached}day`;
          updates[`streakRewards.${milestoneKey}`] = true;

          // Show celebration (show to everyone, but premium users see 0 hints earned)
          const displayHints = userData.isPremium === true ? 0 : streakUpdate.hintsEarned;
          setTimeout(() => {
            router.push({
              pathname: '/streak-milestone' as any,
              params: {
                streak: streakUpdate.newStreak.toString(),
                milestone: streakUpdate.milestoneReached!.toString(),
                hintsEarned: displayHints!.toString(),
                isPremium: userData.isPremium ? 'true' : 'false',
              },
            });
          }, 1000);
        }

        await updateDoc(userRef, updates);
      } catch (error) {
        console.error('Error updating streak:', error);
      }
    };

    checkStreak();
  }, [user, userData]);

  return null; // This component doesn't render anything
}

// Checks if trial has expired and redirects to paywall
function TrialExpirationChecker() {
  const { user } = useAuth();
  const { userData } = useUser();
  const router = useRouter();
  const segments = useSegments();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Only check once per session, and only when we have user data
    if (!user || !userData || hasCheckedRef.current) return;
    
    // Don't check if already on paywall or onboarding
    const isOnPaywall = segments.some(s => s === 'paywall');
    const isOnOnboarding = segments[0] === 'onboarding';
    if (isOnPaywall || isOnOnboarding) return;

    // Check if user is premium (purchased)
    if (userData.isPremium === true) return;

    // Check if trial has expired
    let trialEndDate: Date | null = null;
    if (userData.trialEndDate) {
      trialEndDate = userData.trialEndDate.toDate?.() || new Date(userData.trialEndDate);
    }

    if (trialEndDate && trialEndDate <= new Date()) {
      hasCheckedRef.current = true;
      console.log('Trial expired! Redirecting to paywall...');
      // Small delay to ensure navigation is ready
      setTimeout(() => {
        router.push('/paywall' as any);
      }, 500);
    }
  }, [user, userData, segments]);

  return null;
}

// Listens for new matches and shows in-app alert
function MatchListener() {
  const { user } = useAuth();
  const { userData } = useUser();
  const router = useRouter();
  const segments = useSegments();
  const lastMatchIdRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Only listen if user has a partner
    if (!user || !userData?.coupleId) return;

    // Don't show alerts if already on match screen
    const isOnMatchScreen = segments.some(s => s === 'match');
    
    const matchesRef = collection(db, 'matches');
    const q = query(
      matchesRef,
      where('coupleId', '==', userData.coupleId),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) return;
      
      const latestMatch = snapshot.docs[0];
      const matchData = latestMatch.data();
      const matchId = latestMatch.id;

      // Skip if this is the first load (initialization)
      if (!isInitializedRef.current) {
        lastMatchIdRef.current = matchId;
        isInitializedRef.current = true;
        return;
      }

      // Skip if we've already seen this match
      if (matchId === lastMatchIdRef.current) return;
      
      // Skip if on match screen already
      if (isOnMatchScreen) {
        lastMatchIdRef.current = matchId;
        return;
      }

      // New match detected!
      lastMatchIdRef.current = matchId;
      console.log('New match detected:', matchData.itemName);

      // Show alert and navigate to match screen
      Alert.alert(
        "🎉 It's a Match!",
        `You both want ${matchData.itemName}! Time to eat!`,
        [
          {
            text: "Let's Go!",
            onPress: () => router.push({ pathname: '/match', params: { itemName: matchData.itemName } }),
          },
        ],
        { cancelable: false }
      );
    }, (error) => {
      console.error('Match listener error:', error);
    });

    return () => unsubscribe();
  }, [user, userData?.coupleId, segments]);

  return null;
}

function RootNavigator() {
  const { isDarkMode } = useTheme() || {};
  const { user, onboardingComplete, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inWelcomeGroup = segments[0] === 'welcome';
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('Navigation check:', { user: !!user, onboardingComplete, segments });

    if (inWelcomeGroup) return;

    if (!user && !inAuthGroup) {
      console.log('Redirecting to login');
      router.replace('/login');
    } else if (user && !onboardingComplete && !inOnboardingGroup) {
      console.log('Redirecting to onboarding');
      router.replace('/onboarding' as any);
    } else if (user && onboardingComplete && !inTabsGroup) {
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
      <PartnerConnectionDetector />
      <StreakChecker />
      <TrialExpirationChecker />
      <MatchListener />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
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


