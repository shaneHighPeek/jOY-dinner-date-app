import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

// Define the color type based on your ThemeProvider
type Colors = {
  background: string;
  text: string;
  primary: string;
  card: string;
  border: string;
  muted: string;
  [key: string]: any; // Allow other properties
};

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'Georgia',
    marginBottom: 20,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  planContainer: {
    width: '100%',
    marginBottom: 20,
  },
  plan: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedPlan: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}1A`, // Light primary background
  },
  planDetails: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  strikethroughPrice: {
    textDecorationLine: 'line-through',
    color: colors.muted,
    marginRight: 8,
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
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  saveBadge: {
    backgroundColor: '#ff3232',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  saveBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  freeBadge: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  selectionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  trialToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${colors.primary}1A`,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
  },
  trialToggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  noPaymentText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonArrow: {
    marginLeft: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    marginTop: 20,
  },
  footerLink: {
    fontSize: 14,
    color: colors.muted,
    textDecorationLine: 'underline',
  },
});

export default function PaywallScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, setOnboardingComplete } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('weekly'); // Default to weekly trial
  const [isTrialEnabled, setIsTrialEnabled] = useState(true);

  // Animation for the logo
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 150 }),
        withTiming(5, { duration: 150 }),
        withTiming(0, { duration: 200 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

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
        trialEndDate: isTrialEnabled ? trialEndDate : null,
        isPremium: true, // During trial or if purchased
      });
      setOnboardingComplete(true);
      setLoading(false);
      router.replace('/play');
    } catch (e: any) {
      console.error('Failed to update user profile:', e);
      setError(e.message || 'Failed to complete onboarding.');
      setLoading(false);
    }
  };

  const SelectionCircle = ({ isSelected }: { isSelected: boolean }) => (
    <View style={[styles.selectionIcon, isSelected && styles.selectedIcon]}>
      {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <Animated.Image
            source={require('../../assets/images/icon.png')}
            style={[styles.logo, animatedStyle]}
          />
          <Text style={styles.title}>Unlimited Access</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(100)} style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <Ionicons name="infinite" size={24} color={colors.primary} />
            <Text style={styles.featureText}>Unlimited Date Ideas</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="game-controller" size={24} color={colors.primary} />
            <Text style={styles.featureText}>Unlock 'Eat In' Mode</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="scan" size={24} color={colors.primary} />
            <Text style={styles.featureText}>Unlimited Recipe Scans</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="heart" size={24} color={colors.primary} />
            <Text style={styles.featureText}>Personalized Advice</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.planContainer}>
          {/* Lifetime Plan */}
          <TouchableOpacity
            style={[styles.plan, selectedPlan === 'yearly' && styles.selectedPlan]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.planDetails}>
              <Text style={styles.planTitle}>Lifetime Plan</Text>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planPrice}>$24.99</Text>
              </View>
            </View>
            <View style={styles.badgeContainer}>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>BEST VALUE</Text>
              </View>
              <SelectionCircle isSelected={selectedPlan === 'yearly'} />
            </View>
          </TouchableOpacity>

          {/* Weekly Plan (Trial) */}
          <TouchableOpacity
            style={[styles.plan, selectedPlan === 'weekly' && styles.selectedPlan]}
            onPress={() => setSelectedPlan('weekly')}
          >
            <View style={styles.planDetails}>
              <Text style={styles.planTitle}>3-Day Trial</Text>
              <Text style={styles.planSubtext}>then $4.99 per week</Text>
            </View>
            <View style={styles.badgeContainer}>
              <Text style={styles.freeBadge}>Short Term</Text>
              <SelectionCircle isSelected={selectedPlan === 'weekly'} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(400)} style={styles.trialToggleContainer}>
          <Text style={styles.trialToggleText}>Free Trial Enabled</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={'#ffffff'}
            ios_backgroundColor="#767577"
            onValueChange={setIsTrialEnabled}
            value={isTrialEnabled}
          />
        </Animated.View>

        {error && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</Text>}

        <Animated.View entering={FadeInUp.duration(500).delay(600)} style={styles.footer}>
          <Text style={styles.noPaymentText}>NO PAYMENT REQUIRED TODAY</Text>
          <TouchableOpacity style={styles.button} onPress={handleContinue} disabled={loading}>
            {loading ? (
              <Text style={styles.buttonText}>Loading...</Text>
            ) : (
              <>
                <Text style={styles.buttonText}>Try 3 Days Free</Text>
                <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonArrow} />
              </>
            )}
          </TouchableOpacity>
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => alert('Restore purchases!')}>
              <Text style={styles.footerLink}>Restore</Text>
            </TouchableOpacity>
            <Text style={{ color: colors.muted, marginHorizontal: 10 }}> | </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://dinnerwodebate.com/privacy')}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={{ color: colors.muted, marginHorizontal: 10 }}> | </Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://dinnerwodebate.com/terms')}>
              <Text style={styles.footerLink}>Terms</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}
