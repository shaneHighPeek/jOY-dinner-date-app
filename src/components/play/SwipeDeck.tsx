import React, { useState } from 'react';
import { View } from 'react-native';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { foodItems as initialFoodItems } from '@/constants/foodItems';
import { SwipeableCard } from '@/components/onboarding/SwipeableCard';

export const SwipeDeck = () => {
  const { user } = useAuth();
  const { userData } = useUser();
  const router = useRouter();
  const [foodItems, setFoodItems] = useState(initialFoodItems);

  const handleSwipe = async (item: { id: string; name: string }, direction: 'left' | 'right') => {
    if (!user || !userData) return;

    setFoodItems(prev => prev.filter(i => i.id !== item.id));

    try {
      const voteRef = doc(db, 'votes', `${user.uid}_${item.id}`);
      await setDoc(voteRef, {
        userId: user.uid,
        itemId: item.id,
        liked: direction === 'right',
        timestamp: serverTimestamp(),
      });

      if (direction === 'right' && userData.coupleId) {
        const partnerId = userData.partnerId; // Assuming partnerId is on user doc
        const partnerVoteRef = doc(db, 'votes', `${partnerId}_${item.id}`);
        const partnerVoteSnap = await getDoc(partnerVoteRef);

        if (partnerVoteSnap.exists() && partnerVoteSnap.data().liked) {
          const matchRef = doc(db, 'matches', `${userData.coupleId}_${item.id}`);
          await setDoc(matchRef, {
            coupleId: userData.coupleId,
            itemId: item.id,
            itemName: item.name,
            timestamp: serverTimestamp(),
          });

          router.push({ pathname: '/match', params: { itemName: item.name } });
        }
      }
    } catch (error) {
      console.error('Failed to record vote or check match:', error);
    }
  };

  return (
    <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
      {foodItems.map((item, index) => (
        <SwipeableCard
          key={item.id}
          item={item}
          onSwipe={handleSwipe}
          index={index}
        />
      )).reverse()}
    </View>
  );
};

