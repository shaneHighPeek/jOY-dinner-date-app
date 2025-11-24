import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { HintService } from '@/services/hintService';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
};

const createStyles = (colors: Colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
  },
  optionCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  costBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  costText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  freeBadge: {
    backgroundColor: '#10B981',
  },
  optionDescription: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  disabledCard: {
    opacity: 0.5,
  },
  closeButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  closeButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  noPartnerText: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginVertical: 24,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default function HintsMenuScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { userData } = useUser();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  if (!theme) throw new Error('HintsMenuScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);
  
  const isPremium = userData?.isPremium === true;
  const hasPartner = !!userData?.partnerId;
  const currentHints = userData?.hints || 0;

  const handleRevealTopCuisine = async () => {
    if (!hasPartner) {
      Alert.alert('No Partner', 'You need to be paired with someone to use this hint!');
      return;
    }

    const cost = 1;
    if (!isPremium && currentHints < cost) {
      Alert.alert('Not Enough Hints', `You need ${cost} hint to use this feature. Keep swiping to earn more!`);
      return;
    }

    Alert.alert(
      'Reveal Top Cuisine',
      isPremium 
        ? 'Reveal your partner\'s favorite cuisine?' 
        : `Spend ${cost} hint to reveal your partner\'s favorite cuisine?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reveal',
          onPress: async () => {
            setLoading(true);
            try {
              // Validate user data
              if (!user || !userData || !userData.partnerId) {
                Alert.alert('Error', 'Partner information not found.');
                setLoading(false);
                return;
              }

              // Spend hints if not premium
              if (!isPremium) {
                const success = await HintService.spendHints(user.uid, cost);
                if (!success) {
                  Alert.alert('Error', 'Failed to spend hints. Please try again.');
                  setLoading(false);
                  return;
                }
              }

              // Reveal top cuisine
              const topCuisine = await HintService.revealTopCuisine(userData.partnerId);
              
              setLoading(false);
              
              // Close this modal first
              router.back();
              
              // Small delay to ensure modal is closed
              setTimeout(() => {
                router.push({
                  pathname: '/hint-reveal' as any,
                  params: {
                    type: 'top-cuisine',
                    data: topCuisine || 'No data available',
                  },
                });
              }, 300);
            } catch (error) {
              console.error('Top cuisine reveal error:', error);
              setLoading(false);
              Alert.alert('Error', 'Failed to reveal partner\'s top cuisine. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRevealRecentLikes = async () => {
    if (!hasPartner) {
      Alert.alert('No Partner', 'You need to be paired with someone to use this hint!');
      return;
    }

    const cost = 2;
    if (!isPremium && currentHints < cost) {
      Alert.alert('Not Enough Hints', `You need ${cost} hints to use this feature. Keep swiping to earn more!`);
      return;
    }

    Alert.alert(
      'Reveal Recent Likes',
      isPremium 
        ? 'Reveal your partner\'s last 5 liked items?' 
        : `Spend ${cost} hints to reveal your partner\'s last 5 liked items?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reveal',
          onPress: async () => {
            setLoading(true);
            try {
              // Validate user data
              if (!user || !userData || !userData.partnerId) {
                Alert.alert('Error', 'Partner information not found.');
                setLoading(false);
                return;
              }

              // Spend hints if not premium
              if (!isPremium) {
                const success = await HintService.spendHints(user.uid, cost);
                if (!success) {
                  Alert.alert('Error', 'Failed to spend hints. Please try again.');
                  setLoading(false);
                  return;
                }
              }

              // Reveal recent likes
              const recentLikes = await HintService.revealRecentLikes(userData.partnerId);
              
              setLoading(false);
              
              // Close this modal first
              router.back();
              
              // Small delay to ensure modal is closed
              setTimeout(() => {
                router.push({
                  pathname: '/hint-reveal' as any,
                  params: {
                    type: 'recent-likes',
                    data: JSON.stringify(recentLikes || []),
                  },
                });
              }, 300);
            } catch (error) {
              console.error('Recent likes reveal error:', error);
              setLoading(false);
              Alert.alert('Error', 'Failed to reveal partner\'s recent likes. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.subtitle, { marginTop: 16 }]}>Revealing...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Modal transparent animationType="fade" visible={true} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Animated.View style={styles.container} entering={FadeInDown.duration(300)}>
          <View style={styles.header}>
            <Text style={styles.title}>💡 Use a Hint</Text>
            <Text style={styles.subtitle}>
              {isPremium 
                ? 'Unlimited hints with Premium! 👑' 
                : `You have ${currentHints} hint${currentHints !== 1 ? 's' : ''}`}
            </Text>
          </View>

          {!hasPartner && (
            <Text style={styles.noPartnerText}>
              Partner features will be available once you're paired! 💑
            </Text>
          )}

          {/* Reveal Top Cuisine */}
          <TouchableOpacity
            style={[styles.optionCard, !hasPartner && styles.disabledCard]}
            onPress={handleRevealTopCuisine}
            disabled={!hasPartner}
          >
            <View style={styles.optionHeader}>
              <Text style={styles.optionTitle}>🍝 Top Cuisine</Text>
              <View style={[styles.costBadge, isPremium && styles.freeBadge]}>
                <Text style={styles.costText}>{isPremium ? 'FREE' : '1 Hint'}</Text>
              </View>
            </View>
            <Text style={styles.optionDescription}>
              Reveal your partner's #1 favorite cuisine
            </Text>
          </TouchableOpacity>

          {/* Reveal Recent Likes */}
          <TouchableOpacity
            style={[styles.optionCard, !hasPartner && styles.disabledCard]}
            onPress={handleRevealRecentLikes}
            disabled={!hasPartner}
          >
            <View style={styles.optionHeader}>
              <Text style={styles.optionTitle}>❤️ Recent Likes</Text>
              <View style={[styles.costBadge, isPremium && styles.freeBadge]}>
                <Text style={styles.costText}>{isPremium ? 'FREE' : '2 Hints'}</Text>
              </View>
            </View>
            <Text style={styles.optionDescription}>
              See the last 5 items your partner liked
            </Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
