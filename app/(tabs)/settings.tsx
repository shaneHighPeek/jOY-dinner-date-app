import { Text, View, Switch, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/contexts/PremiumContext';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { XPBar } from '@/components/play/XPBar';
import { doc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

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
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingText: {
    fontSize: 18,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 32,
    marginBottom: 12,
  },
  partnerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  partnerAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  partnerStatus: {
    fontSize: 14,
    color: colors.muted,
  },
  removeButton: {
    backgroundColor: colors.error + '20',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },
  removeButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  notConnectedText: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  // Premium styles
  premiumCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    overflow: 'hidden',
  },
  premiumGradient: {
    borderRadius: 16,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  premiumSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  premiumButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  premiumActiveCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.accent,
    marginBottom: 8,
  },
  premiumActiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumActiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  premiumActiveSubtitle: {
    fontSize: 14,
    color: colors.muted,
  },
  premiumBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  premiumBadgeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default function SettingsScreen() {
  const theme = useTheme();
  const { userData } = useUser();
  const { user } = useAuth();
  const { restorePurchases } = usePremium();
  const { isPremium, isLifetime, isOnTrial, trialDaysLeft } = usePremiumStatus();
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const [restoring, setRestoring] = useState(false);
  
  if (!theme || !userData) return null;
  const { colors, isDarkMode, toggleTheme } = theme;
  const styles = createStyles(colors);

  const handleUpgrade = () => {
    router.push('/paywall' as any);
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.success) {
        Alert.alert('Success', 'Your purchases have been restored!');
      } else {
        Alert.alert('No Purchases Found', 'We couldn\'t find any previous purchases to restore.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setRestoring(false);
    }
  };

  const handleRemovePartner = () => {
    if (!user || !userData.partnerId) return;

    Alert.alert(
      'Remove Partner',
      `Are you sure you want to disconnect from ${userData.partnerName || 'your partner'}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setRemoving(true);
            try {
              // Clear connection data from current user
              const userRef = doc(db, 'users', user.uid);
              await updateDoc(userRef, {
                coupleId: deleteField(),
                partnerId: deleteField(),
                partnerName: deleteField(),
                connectedAt: deleteField(),
              });

              // Clear connection data from partner
              const partnerRef = doc(db, 'users', userData.partnerId);
              await updateDoc(partnerRef, {
                coupleId: deleteField(),
                partnerId: deleteField(),
                partnerName: deleteField(),
                connectedAt: deleteField(),
              });

              Alert.alert('Disconnected', 'You have been disconnected from your partner.');
            } catch (error) {
              console.error('Failed to remove partner:', error);
              Alert.alert('Error', 'Failed to remove partner. Please try again.');
            } finally {
              setRemoving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(300)}>
        <Text style={styles.title}>Settings</Text>
        <XPBar xp={userData.xp || 0} isPremium={isPremium} />
        
        {/* Premium Section - Always visible */}
        <Text style={styles.sectionTitle}>Subscription</Text>
        {isPremium ? (
          // User has paid premium
          <View style={styles.premiumActiveCard}>
            <View style={styles.premiumActiveHeader}>
              <Text style={styles.premiumIcon}>👑</Text>
              <Text style={styles.premiumActiveTitle}>Premium Active</Text>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>
                  {isLifetime ? 'Lifetime' : 'Active'}
                </Text>
              </View>
            </View>
            <Text style={styles.premiumActiveSubtitle}>
              {userData.premiumSharedBy 
                ? 'Shared by your partner 💕' 
                : 'Thank you for your support!'}
            </Text>
          </View>
        ) : isOnTrial ? (
          // User is on trial
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumGradient}
          >
            <View style={styles.premiumCard}>
              <View style={styles.premiumHeader}>
                <Text style={styles.premiumIcon}>⏳</Text>
                <Text style={styles.premiumTitle}>Free Trial</Text>
              </View>
              <Text style={styles.premiumSubtitle}>
                {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining{'\n'}
                Upgrade now to keep all features!
              </Text>
              <TouchableOpacity 
                style={styles.premiumButton}
                onPress={handleUpgrade}
              >
                <Text style={styles.premiumButtonText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        ) : (
          // Trial expired, not premium
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumGradient}
          >
            <View style={styles.premiumCard}>
              <View style={styles.premiumHeader}>
                <Text style={styles.premiumIcon}>✨</Text>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              </View>
              <Text style={styles.premiumSubtitle}>
                Your trial has ended.{'\n'}
                Upgrade to unlock all features!
              </Text>
              <TouchableOpacity 
                style={styles.premiumButton}
                onPress={handleUpgrade}
              >
                <Text style={styles.premiumButtonText}>View Plans</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
        <TouchableOpacity 
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={restoring}
        >
          <Text style={styles.restoreButtonText}>
            {restoring ? 'Restoring...' : 'Restore Purchases'}
          </Text>
        </TouchableOpacity>
        
        {/* Appearance Section */}
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.muted, true: colors.primary }}
            thumbColor={isDarkMode ? colors.accent : colors.card}
            ios_backgroundColor={colors.border}
          />
        </View>

        {/* Partner Section */}
        <Text style={styles.sectionTitle}>Partner</Text>
        <View style={styles.partnerCard}>
          {userData.coupleId ? (
            <>
              <View style={styles.partnerInfo}>
                <Text style={styles.partnerAvatar}>💑</Text>
                <View>
                  <Text style={styles.partnerName}>{userData.partnerName || 'Partner'}</Text>
                  <Text style={styles.partnerStatus}>Connected</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemovePartner}
                disabled={removing}
              >
                <Text style={styles.removeButtonText}>
                  {removing ? 'Removing...' : 'Remove Partner'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.notConnectedText}>
              Not connected to a partner yet.{'\n'}Go to the Connect tab to link up!
            </Text>
          )}
        </View>
        
        {/* Bottom padding for scroll */}
        <View style={{ height: 40 }} />
      </Animated.View>
    </ScrollView>
  );
}
