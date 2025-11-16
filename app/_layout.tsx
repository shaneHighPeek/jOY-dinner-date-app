import { ThemeProvider as NavThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

export const unstable_settings = {
  initialRouteName: 'welcome',
};

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
      // Redirect to the login page.
      console.log('Redirecting to login');
      router.replace('/login');
    } else if (user && !onboardingComplete && !inOnboardingGroup) {
      // Redirect to the onboarding flow.
      console.log('Redirecting to onboarding');
      router.replace('/onboarding');
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
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}


