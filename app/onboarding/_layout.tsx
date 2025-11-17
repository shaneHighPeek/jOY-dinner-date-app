import { Stack } from 'expo-router';
import { OnboardingProvider } from '@/hooks/useOnboarding';
import { ThemeProvider } from '@/theme/ThemeProvider';

export default function OnboardingLayout() {
  return (
    <ThemeProvider forcedMode="dark">
      <OnboardingProvider>
        <Stack>
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="vibe" options={{ headerShown: false }} />
          <Stack.Screen name="cuisine" options={{ headerShown: false }} />
          <Stack.Screen name="progress" options={{ headerShown: false }} />
          <Stack.Screen name="congratulations" options={{ headerShown: false }} />
          <Stack.Screen name="paywall" options={{ headerShown: false }} />
        </Stack>
      </OnboardingProvider>
    </ThemeProvider>
  );
}
