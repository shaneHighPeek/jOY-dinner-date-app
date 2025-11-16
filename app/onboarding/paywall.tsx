import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  diamond: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 32,
  },
  featureList: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  planContainer: {
    marginBottom: 24,
  },
  plan: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 16,
  },
  selectedPlan: {
    borderColor: colors.primary,
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  planPrice: {
    fontSize: 16,
    color: colors.text,
  },
  planSubtext: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  saveBadge: {
    backgroundColor: colors.primary,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 8,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default function PaywallScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { setOnboardingComplete } = useOnboarding();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleContinue = async () => {
    if (!user) {
      setError('No user found. Please try signing in again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 3);

      await updateDoc(doc(db, 'users', user.uid), {
        onboardingComplete: true,
        trialEndDate,
        isPremium: true, // During trial
      });

      setOnboardingComplete(true);
      setLoading(false);
      
      // Navigate to main app
      router.replace('/play');
    } catch (error: any) {
      console.error('Failed to update user profile:', error);
      setError(error.message || 'Failed to complete onboarding. Please try again.');
      setLoading(false);
    }
  };

  const features = [
    'One subscription covers both you and your partner',
    'Unlock the \'Eat In\' game mode',
    'Scan and save unlimited recipes',
    'Get personalized recipe suggestions',
  ];

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <Text style={styles.diamond}>💎</Text>
        <Text style={styles.title}>Unlock Premium Access</Text>
        <Text style={styles.subtitle}>Create your account and start your free 3-day trial.</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.featureList}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text>✅</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(400)} style={styles.planContainer}>
        <TouchableOpacity 
          style={[styles.plan, selectedPlan === 'yearly' && styles.selectedPlan]}
          onPress={() => setSelectedPlan('yearly')}
        >
          <View style={styles.planDetails}>
            <View>
              <Text style={styles.planName}>Yearly Plan</Text>
              <Text style={styles.planSubtext}>$34.99 per year</Text>
            </View>
            <Text style={styles.saveBadge}>SAVE 42%</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.plan, selectedPlan === 'monthly' && styles.selectedPlan]}
          onPress={() => setSelectedPlan('monthly')}
        >
          <View style={styles.planDetails}>
            <View>
              <Text style={styles.planName}>3-day Trial then Monthly</Text>
              <Text style={styles.planSubtext}>Free for 3 days, then $4.99 per month</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(600)} style={{ marginTop: 'auto' }}>
        <TouchableOpacity style={styles.button} onPress={handleContinue} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Start Free Trial & Create Account</Text>
          )}
        </TouchableOpacity>
        {error && <Text style={{ color: 'red', marginTop: 16, textAlign: 'center' }}>{error}</Text>}
        <TouchableOpacity onPress={() => setOnboardingComplete(true)}>
          <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 16 }}>Skip for now</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
