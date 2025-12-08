import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

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
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 32,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export const Paywall = () => {
  const theme = useTheme();
  const router = useRouter();
  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleUpgrade = () => {
    router.push('/paywall' as any);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={28} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.centerContent}>
        <View style={styles.content}>
          <Animated.Text 
            style={styles.title}
            entering={FadeInDown.duration(800).delay(200)}
          >
            Your Trial has Ended
          </Animated.Text>
          <Animated.Text 
            style={styles.subtitle}
            entering={FadeInDown.duration(800).delay(400)}
          >
            Upgrade to Premium to continue using this feature and unlock more.
          </Animated.Text>
          <Animated.View
            entering={FadeInDown.duration(800).delay(600)}
            style={{ width: '100%' }}
          >
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleUpgrade}
            >
              <Text style={styles.buttonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};
