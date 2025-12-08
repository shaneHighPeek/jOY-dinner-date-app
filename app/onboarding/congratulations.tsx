import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useOnboarding } from '@/hooks/useOnboarding';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
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
    marginBottom: 40,
    lineHeight: 24,
  },
  rewardContainer: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  rewardText: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 12,
  },
  rewardImageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  rewardImage: {
    width: 280,
    height: 80,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});


export default function CongratulationsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const { setOnboardingComplete } = useOnboarding();

  useEffect(() => {
    const awardFirstHint = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          hints: 1, // Award first hint
        });
      }
    };
    awardFirstHint();
  }, [user]);

  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
      <Animated.Text entering={FadeInUp.duration(500).delay(200)} style={styles.title}>
        Congratulations!
      </Animated.Text>
      <Animated.Text entering={FadeInUp.duration(500).delay(400)} style={styles.subtitle}>
        Your taste profile is ready.
      </Animated.Text>

      <Animated.View entering={FadeInUp.duration(500).delay(600)} style={styles.rewardImageContainer}>
        <Image source={require('../../assets/images/button.png')} style={styles.rewardImage} resizeMode="contain" />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(1000)} style={{ width: '100%' }}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/onboarding/paywall')}>
          <Text style={styles.buttonText}>Finish & Start Swiping</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
