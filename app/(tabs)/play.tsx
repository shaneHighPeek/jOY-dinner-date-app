import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { XPBar } from '@/components/play/XPBar';
import { SwipeDeck } from '@/components/play/SwipeDeck';
import { SurpriseMeSheet } from '@/components/play/SurpriseMeSheet';
import { SurpriseMeService } from '@/services/surpriseMeService';
import { foodItems } from '@/data';
import Animated, { FadeIn } from 'react-native-reanimated';

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  error: string;
};

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.text,
    marginTop: 12,
    fontSize: 16,
  },
  topContainer: {
    padding: 20,
    paddingTop: 60, // For status bar
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surpriseButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 9999,
    margin: 20,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  surpriseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default function PlayScreen() {
  const { userData, loading } = useUser();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [suggestion, setSuggestion] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();

  // Redirect to vibe selection at start of each session
  useEffect(() => {
    if (!loading && userData) {
      router.replace('/play-vibe');
    }
  }, [loading, userData]);

  const handleSurpriseMe = async () => {
    if (!userData) return;

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
    setSheetVisible(true);
  };

  const handleAccept = async () => {
    if (!userData || !suggestion) return;

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
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, {
        xp: (userData.xp || 0) + 10, // 10 XP for accepting a suggestion
      });

    } catch (error) {
      console.error('Failed to accept suggestion:', error);
    }

    setSheetVisible(false);
  };

  const theme = useTheme();
  if (!theme) throw new Error('PlayScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const styles = createStyles(colors);

  if (loading || !userData) {
    return (
      <Animated.View 
        style={styles.loadingContainer}
        entering={FadeIn.duration(300)}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <View style={styles.topContainer}>
        <XPBar xp={userData.xp || 0} isPremium={userData.isPremium === true} />
      </View>
      <View style={styles.deckContainer}>
        <SwipeDeck />
      </View>
      <TouchableOpacity 
        style={styles.surpriseButton} 
        onPress={handleSurpriseMe}
      >
        <Text style={styles.surpriseButtonText}>Surprise Me</Text>
      </TouchableOpacity>

      <SurpriseMeSheet
        visible={sheetVisible}
        suggestion={suggestion}
        onClose={() => setSheetVisible(false)}
        onAccept={handleAccept}
        onSpinAgain={handleSurpriseMe}
      />
    </Animated.View>
  );
}
