import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SurpriseMeService } from '@/services/surpriseMeService';
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
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  icon: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
  },
  suggestionCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  suggestionEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  suggestionName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  spinButton: {
    backgroundColor: 'transparent',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  spinButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function PlaySurpriseScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const { userData, loading: userLoading } = useUser();
  const router = useRouter();
  const [suggestion, setSuggestion] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  if (!theme) throw new Error('PlaySurpriseScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);

  const getSuggestion = async () => {
    if (!userData) return;

    setLoading(true);
    try {
      let partnerData: any;
      if (userData.partnerId) {
        const partnerRef = doc(db, 'users', userData.partnerId);
        const partnerSnap = await getDoc(partnerRef);
        if (partnerSnap.exists()) {
          partnerData = partnerSnap.data();
        }
      }

      const newSuggestion = SurpriseMeService.getSuggestions(userData, partnerData);
      setSuggestion(newSuggestion);
    } catch (error) {
      console.error('Failed to get suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSuggestion();
  }, [userData]);

  const handleAccept = async () => {
    if (!user || !userData || !suggestion) return;

    try {
      if (userData.coupleId) {
        const matchRef = doc(db, 'matches', `${userData.coupleId}_${suggestion.id}`);
        await setDoc(matchRef, {
          coupleId: userData.coupleId,
          itemId: suggestion.id,
          itemName: suggestion.name,
          timestamp: serverTimestamp(),
          source: 'surprise-me',
        });
      }

      // Award XP
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        xp: (userData.xp || 0) + 10,
      });

      router.push({ pathname: '/match', params: { itemName: suggestion.name } });
    } catch (error) {
      console.error('Failed to accept suggestion:', error);
    }
  };

  if (userLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
      <Animated.View style={styles.header} entering={FadeInDown.duration(500).delay(200)}>
        <Text style={styles.icon}>✨</Text>
        <Text style={styles.title}>Your Surprise!</Text>
        <Text style={styles.subtitle}>We picked this just for you</Text>
      </Animated.View>

      {suggestion && (
        <Animated.View style={styles.suggestionCard} entering={FadeInDown.duration(500).delay(400)}>
          <Text style={styles.suggestionEmoji}>🍽️</Text>
          <Text style={styles.suggestionName}>{suggestion.name}</Text>
        </Animated.View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.acceptButtonText}>Accept & Match</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.spinButton} onPress={getSuggestion}>
          <Text style={styles.spinButtonText}>Spin Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
