import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePremium } from '@/contexts/PremiumContext';
import { getOfferings } from '@/services/revenueCatService';
import { PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export default function PaywallScreen() {
  const router = useRouter();
  const { isPremium, purchasePackage, restorePurchases } = usePremium();
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'lifetime' | 'weekly'>('lifetime');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      const offers = await getOfferings();
      setOfferings(offers);
    } catch (error) {
      console.error('Failed to load offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get package info for display
  const lifetimePkg = offerings?.current?.availablePackages.find(pkg => pkg.packageType === 'LIFETIME');
  const weeklyPkg = offerings?.current?.availablePackages.find(pkg => pkg.packageType === 'WEEKLY');
  const selectedPackage = selectedPlan === 'lifetime' ? lifetimePkg : weeklyPkg;

  // Debug logging
  console.log('Paywall offerings:', {
    hasOfferings: !!offerings,
    currentOffering: offerings?.current?.identifier,
    availablePackages: offerings?.current?.availablePackages?.map(p => ({
      id: p.identifier,
      type: p.packageType,
      price: p.product.priceString,
    })),
    lifetimePkg: lifetimePkg?.identifier,
    weeklyPkg: weeklyPkg?.identifier,
    selectedPlan,
    selectedPackage: selectedPackage?.identifier,
  });

  const handlePurchase = async () => {
    console.log('handlePurchase called, selectedPackage:', selectedPackage?.identifier);
    
    if (!selectedPackage) {
      console.error('No package selected!');
      Alert.alert(
        'Unable to Purchase',
        'No subscription package available. Please try again later.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setPurchasing(true);
      console.log('Starting purchase for package:', selectedPackage.identifier);
      const result = await purchasePackage(selectedPackage);
      console.log('Purchase result:', result);

      if (result.success) {
        Alert.alert(
          '🎉 Welcome to Premium!',
          'You now have access to all premium features!',
          [{ text: 'Continue', onPress: () => router.back() }]
        );
      } else if (result.error !== 'User cancelled') {
        Alert.alert('Purchase Failed', result.error || 'Something went wrong');
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      Alert.alert('Error', error.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setPurchasing(true);
      const result = await restorePurchases();

      if (result.success) {
        Alert.alert(
          '✅ Purchases Restored',
          'Your premium access has been restored!',
          [{ text: 'Continue', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases were found for this account.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Restore failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff3232" />
        <Text style={styles.loadingText}>Loading options...</Text>
      </View>
    );
  }

  if (isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.premiumContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          <Text style={styles.premiumTitle}>You're Premium! 🎉</Text>
          <Text style={styles.premiumSubtitle}>
            Enjoy unlimited access to all features
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with close button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Logo and Title */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.heroSection}>
          <Animated.Image
            source={require('../assets/images/heart-gavel.png')}
            style={[styles.logo, animatedStyle]}
          />
          <Text style={styles.heroTitle}>Lifetime Access</Text>
        </Animated.View>

        {/* Features List */}
        <Animated.View entering={FadeInUp.duration(500).delay(100)} style={styles.featuresContainer}>
          <FeatureItem 
            icon="infinite" 
            title="Unlimited Date Ideas" 
            description="Never run out of inspiration for your next meal"
          />
          <FeatureItem 
            icon="game-controller" 
            title="Unlock 'Eat In' Mode" 
            description="Discover recipes to cook together at home"
          />
          <FeatureItem 
            icon="scan" 
            title="Unlimited Recipe Scans" 
            description="Scan any recipe and add it to your collection"
          />
          <FeatureItem 
            icon="people" 
            title="Covers Both Partners" 
            description="One purchase unlocks premium for you and your partner"
          />
        </Animated.View>

        {/* Plan Buttons */}
        <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.planButtonsContainer}>
          {/* Lifetime Plan Button */}
          <TouchableOpacity
            style={[styles.planButton, selectedPlan === 'lifetime' && styles.planButtonSelected]}
            onPress={() => setSelectedPlan('lifetime')}
          >
            <View style={styles.planButtonContent}>
              <Text style={[styles.planButtonTitle, selectedPlan === 'lifetime' && styles.planButtonTitleSelected]}>
                Lifetime Plan
              </Text>
              <Text style={[styles.planButtonPrice, selectedPlan === 'lifetime' && styles.planButtonPriceSelected]}>
                {lifetimePkg?.product.priceString || '$24.99'}
              </Text>
            </View>
            <View style={styles.bestValueBadge}>
              <Text style={styles.bestValueText}>BEST VALUE</Text>
            </View>
          </TouchableOpacity>

          {/* Short Term Button */}
          <TouchableOpacity
            style={[styles.planButton, selectedPlan === 'weekly' && styles.planButtonSelected]}
            onPress={() => setSelectedPlan('weekly')}
          >
            <View style={styles.planButtonContent}>
              <Text style={[styles.planButtonTitle, selectedPlan === 'weekly' && styles.planButtonTitleSelected]}>
                Short Term
              </Text>
              <Text style={[styles.planButtonPrice, selectedPlan === 'weekly' && styles.planButtonPriceSelected]}>
                {weeklyPkg?.product.priceString || '$4.99'}/week
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View entering={FadeInUp.duration(500).delay(400)} style={styles.footer}>
          <TouchableOpacity
            style={[styles.ctaButton, purchasing && styles.ctaButtonDisabled]}
            onPress={handlePurchase}
            disabled={purchasing}
          >
            {purchasing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.ctaButtonText}>
                  {selectedPlan === 'lifetime' ? 'Get Lifetime Access' : 'Start Subscription'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

          {/* Restore */}
          <TouchableOpacity onPress={handleRestore} disabled={purchasing}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>

          {/* Legal Links */}
          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={() => Linking.openURL('https://dinnerwodebate.com/privacy')}>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.legalSeparator}>|</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://dinnerwodebate.com/terms')}>
              <Text style={styles.legalLink}>Terms</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const FeatureItem = ({ icon, title, description }: { icon: any; title: string; description: string }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIconContainer}>
      <Ionicons name={icon} size={24} color="#ff3232" />
    </View>
    <View style={styles.featureTextContainer}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 60,
  },
  closeButton: {
    padding: 8,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  featuresContainer: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: '#666',
  },
  planButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  planButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  planButtonSelected: {
    borderColor: '#ff3232',
    backgroundColor: '#FFF5F5',
  },
  planButtonContent: {
    alignItems: 'center',
  },
  planButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  planButtonTitleSelected: {
    color: '#ff3232',
  },
  planButtonPrice: {
    fontSize: 14,
    color: '#666',
  },
  planButtonPriceSelected: {
    color: '#333',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#ff3232',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  bestValueText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ctaButton: {
    backgroundColor: '#ff3232',
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restoreText: {
    color: '#ff3232',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLink: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 12,
  },
  premiumContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  premiumTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
