import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { NotificationService } from '@/services/notificationService';
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 40,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  highlight: {
    fontSize: 16,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  statBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  statTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  statText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default function ConnectionSuccessScreen() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  
  if (!theme) throw new Error('ConnectionSuccessScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleAllowNotifications = async () => {
    if (user) {
      await NotificationService.registerForPushNotificationsAsync(user.uid);
    }
    // Move to the next step regardless of permission status
    setStep(step + 1);
  };

  const handleDontAllowNotifications = () => {
    setStep(step + 1);
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.replace('/(tabs)/play');
    }
  };

  const renderStep1 = () => (
    <Animated.View style={styles.content} entering={FadeIn.duration(500)}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[styles.progressFill, { width: '33%' }]}
          entering={FadeIn.duration(800)}
        />
      </View>

      <Animated.Text 
        style={styles.icon}
        entering={FadeInDown.duration(800).delay(200)}
      >
        🤝
      </Animated.Text>
      
      <Animated.Text 
        style={styles.title}
        entering={FadeInDown.duration(800).delay(400)}
      >
        Thank you for trusting us!
      </Animated.Text>
      
      <Animated.Text 
        style={styles.subtitle}
        entering={FadeInDown.duration(800).delay(600)}
      >
        Your data is private, and your dinners are about to get easier.
      </Animated.Text>

      <Animated.View
        style={{ width: '100%', marginTop: 40 }}
        entering={FadeInUp.duration(800).delay(800)}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View style={styles.content} entering={FadeIn.duration(500)}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[styles.progressFill, { width: '66%' }]}
          entering={FadeIn.duration(800)}
        />
      </View>

      <Animated.Text 
        style={styles.icon}
        entering={FadeInDown.duration(800).delay(200)}
      >
        🔔
      </Animated.Text>
      
      <Animated.Text 
        style={styles.title}
        entering={FadeInDown.duration(800).delay(400)}
      >
        Don't miss a match.
      </Animated.Text>
      
      <Animated.Text 
        style={styles.subtitle}
        entering={FadeInDown.duration(800).delay(600)}
      >
        Dinner Without Debate would like to send you Notifications
      </Animated.Text>

      <Animated.Text 
        style={styles.highlight}
        entering={FadeInDown.duration(800).delay(700)}
      >
        Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.
      </Animated.Text>

      <Animated.View
        style={{ width: '100%', gap: 12 }}
        entering={FadeInUp.duration(800).delay(900)}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={handleAllowNotifications}
        >
          <Text style={styles.buttonText}>Allow</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.border }]}
          onPress={handleDontAllowNotifications}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Don't Allow</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={styles.content} entering={FadeIn.duration(500)}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[styles.progressFill, { width: '100%' }]}
          entering={FadeIn.duration(800)}
        />
      </View>

      <Animated.Text 
        style={styles.icon}
        entering={FadeInDown.duration(800).delay(200)}
      >
        💑
      </Animated.Text>
      
      <Animated.Text 
        style={styles.title}
        entering={FadeInDown.duration(800).delay(400)}
      >
        Small habits make big harmony 🕊️
      </Animated.Text>
      
      <Animated.View
        style={styles.statBox}
        entering={FadeInDown.duration(800).delay(600)}
      >
        <Text style={styles.statTitle}>Science shows that shared micro-habits build lasting connection in just a few minutes a day.</Text>
      </Animated.View>

      <Animated.View
        style={styles.statBox}
        entering={FadeInDown.duration(800).delay(700)}
      >
        <Text style={styles.statText}>
          We keep it simple: one fun swipe, one quick match, one easy win.
        </Text>
      </Animated.View>

      <Animated.Text 
        style={styles.highlight}
        entering={FadeInDown.duration(800).delay(800)}
      >
        It's like a date night for your thumbs 💕
      </Animated.Text>

      <Animated.View
        style={{ width: '100%', marginTop: 20 }}
        entering={FadeInUp.duration(800).delay(1000)}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>I'm ready!</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </View>
  );
}
