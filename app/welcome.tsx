import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const WelcomeScreen = () => {
  const router = useRouter();
  const theme = useTheme();

  if (!theme) {
    return null; // Or a loading indicator
  }

  const { colors, isDarkMode } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeIn.duration(1000)} style={styles.logoContainer}>
        <Text style={[styles.logo, { color: colors.primary }]}>joy</Text>
      </Animated.View>

      <Animated.Text entering={FadeInUp.duration(1000).delay(500)} style={[styles.subtitle, { color: colors.text }]}>
        Let's end the dinner debate forever
      </Animated.Text>

      <Animated.View entering={FadeInDown.duration(1000).delay(1000)} style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 96,
    fontWeight: 'bold',
    fontFamily: 'Georgia', // A more elegant font
  },
  subtitle: {
    fontSize: 22,
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 60,
    opacity: 0.8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
