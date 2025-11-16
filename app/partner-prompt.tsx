import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

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
    paddingTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  illustration: {
    fontSize: 120,
    marginBottom: 32,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 26,
  },
  highlight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  skipButtonText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function PartnerPromptScreen() {
  const router = useRouter();
  const theme = useTheme();
  
  if (!theme) throw new Error('PartnerPromptScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleConnect = () => {
    router.push('/(tabs)/connect');
  };

  const handleSkip = () => {
    router.back();
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
      <View style={styles.content}>
        <Animated.Text 
          style={styles.illustration}
          entering={FadeInDown.duration(800).delay(200)}
        >
          🎈❤️🎈
        </Animated.Text>
        
        <Animated.Text 
          style={styles.title}
          entering={FadeInDown.duration(800).delay(400)}
        >
          Teamwork Makes the Dream Work
        </Animated.Text>
        
        <Animated.Text 
          style={styles.subtitle}
          entering={FadeInDown.duration(800).delay(600)}
        >
          Connect with someone special and discover what you both love together!
        </Animated.Text>
        
        <Animated.Text 
          style={styles.highlight}
          entering={FadeInDown.duration(800).delay(700)}
        >
          Find your perfect match, together. 💕
        </Animated.Text>

        <Animated.View
          style={styles.buttonContainer}
          entering={FadeInUp.duration(800).delay(900)}
        >
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleConnect}
          >
            <Text style={styles.primaryButtonText}>Connect with Partner</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
