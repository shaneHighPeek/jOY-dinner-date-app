import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePremium } from '@/contexts/PremiumContext';
import { getOfferings } from '@/services/revenueCatService';
import { PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';

export default function PaywallScreen() {
  const router = useRouter();
  const { isPremium, purchasePackage, restorePurchases } = usePremium();
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      const offers = await getOfferings();
      setOfferings(offers);
      
      // Auto-select the first package
      if (offers?.current?.availablePackages.length) {
        setSelectedPackage(offers.current.availablePackages[0]);
      }
    } catch (error) {
      console.error('Failed to load offerings:', error);
      Alert.alert('Error', 'Failed to load subscription options');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    try {
      setPurchasing(true);
      const result = await purchasePackage(selectedPackage);

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
        <Text style={styles.loadingText}>Loading subscription options...</Text>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Unlock Premium</Text>
          <Text style={styles.heroSubtitle}>
            Get unlimited access to all features
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="star"
            title="Premium Levels 10-20"
            description="Unlock exclusive titles and achievements"
          />
          <FeatureItem
            icon="bulb"
            title="Unlimited Hints"
            description="Get as many hints as you need"
          />
          <FeatureItem
            icon="heart"
            title="Priority Support"
            description="Get help when you need it"
          />
          <FeatureItem
            icon="sparkles"
            title="Exclusive Features"
            description="Access new features first"
          />
        </View>

        {/* Pricing Options */}
        {offerings?.current?.availablePackages && (
          <View style={styles.packagesContainer}>
            {offerings.current.availablePackages.map((pkg) => (
              <TouchableOpacity
                key={pkg.identifier}
                style={[
                  styles.packageCard,
                  selectedPackage?.identifier === pkg.identifier && styles.packageCardSelected,
                ]}
                onPress={() => setSelectedPackage(pkg)}
              >
                <View style={styles.packageHeader}>
                  <Text style={styles.packageTitle}>
                    {pkg.product.title ? pkg.product.title.replace(/\s*\(.*?\)\s*/g, '') : ''}
                  </Text>
                  {selectedPackage?.identifier === pkg.identifier && (
                    <Ionicons name="checkmark-circle" size={24} color="#ff3232" />
                  )}
                </View>
                <Text style={styles.packagePrice}>
                  {pkg.product.priceString}
                  {pkg.packageType === 'ANNUAL' && '/year'}
                  {pkg.packageType === 'MONTHLY' && '/month'}
                </Text>
                <Text style={styles.packageDescription}>
                  {pkg.product.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.ctaButton, purchasing && styles.ctaButtonDisabled]}
          onPress={handlePurchase}
          disabled={purchasing || !selectedPackage}
        >
          {purchasing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.ctaButtonText}>Start Premium</Text>
          )}
        </TouchableOpacity>

        {/* Restore Button */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={purchasing}
        >
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legalText}>
          Subscription automatically renews unless auto-renew is turned off at least 24 hours
          before the end of the current period.
        </Text>
      </ScrollView>
    </View>
  );
}

const FeatureItem: React.FC<{ icon: any; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
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
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  featuresContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  packagesContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  packageCard: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  packageCardSelected: {
    borderColor: '#ff3232',
    backgroundColor: '#FFF5F5',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff3232',
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
  },
  ctaButton: {
    backgroundColor: '#ff3232',
    marginHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
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
  restoreButton: {
    marginHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  restoreButtonText: {
    color: '#ff3232',
    fontSize: 16,
    fontWeight: '600',
  },
  legalText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 18,
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
