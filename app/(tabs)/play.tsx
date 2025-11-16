import { Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';
import { XPBar } from '@/components/play/XPBar';
import { SwipeDeck } from '@/components/play/SwipeDeck';
import { SurpriseMeSheet } from '@/components/play/SurpriseMeSheet';
import { SurpriseMeService } from '@/services/surpriseMeService';

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TopContainer = styled(View)`
  padding: 20px;
  padding-top: 60px; /* For status bar */
`;

const DeckContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const SurpriseButton = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.m}px;
  border-radius: 8px;
  margin: 20px;
  align-items: center;
`;

const SurpriseButtonText = styled(Text)`
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.m}px;
  font-weight: bold;
`;

// A simple XP model: 100 XP per level
const getXPForNextLevel = (level: number) => 100 * level;

export default function PlayScreen() {
  const { userData, loading } = useUser();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [suggestion, setSuggestion] = useState<{ id: string; name: string } | null>(null);

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

  if (loading || !userData) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container>
      <TopContainer>
        <XPBar
          level={userData.level}
          xp={userData.xp}
          xpForNextLevel={getXPForNextLevel(userData.level)}
        />
      </TopContainer>
      <DeckContainer>
        <SwipeDeck />
      </DeckContainer>
      <SurpriseButton onPress={handleSurpriseMe}>
        <SurpriseButtonText>Surprise Me</SurpriseButtonText>
      </SurpriseButton>

      <SurpriseMeSheet
        visible={sheetVisible}
        suggestion={suggestion}
        onClose={() => setSheetVisible(false)}
        onAccept={handleAccept}
        onSpinAgain={handleSurpriseMe}
      />
    </Container>
  );
}
