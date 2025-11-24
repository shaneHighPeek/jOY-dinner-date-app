import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { foodItems } from '@/data';

export interface HintReveal {
  type: 'top-cuisine' | 'recent-likes';
  data: any;
}

export const HintService = {
  /**
   * Reveal partner's #1 favorite cuisine
   * Cost: 1 hint
   */
  async revealTopCuisine(partnerId: string): Promise<string> {
    try {
      // Query all partner's votes
      const votesRef = collection(db, 'votes');
      const q = query(
        votesRef,
        where('userId', '==', partnerId),
        where('liked', '==', true)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return 'Your partner hasn\'t liked any items yet! 🤷‍♂️';
      }
      
      // Count cuisines
      const cuisineCounts: Record<string, number> = {};
      
      snapshot.forEach((doc) => {
        const vote = doc.data();
        const itemId = vote.itemId;
        
        // Find the food item
        const foodItem = foodItems.find(item => item.id === itemId);
        if (foodItem) {
          const cuisine = foodItem.cuisine;
          cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
        }
      });
      
      // Find top cuisine
      const topCuisine = Object.entries(cuisineCounts)
        .sort(([, a], [, b]) => b - a)[0];
      
      if (!topCuisine) {
        return 'Your partner hasn\'t liked any items yet! 🤷‍♂️';
      }
      
      return topCuisine[0]; // Return cuisine name
    } catch (error) {
      console.error('Error revealing top cuisine:', error);
      throw new Error('Failed to reveal partner\'s top cuisine');
    }
  },

  /**
   * Show partner's last 5 liked items
   * Cost: 2 hints
   */
  async revealRecentLikes(partnerId: string): Promise<Array<{ id: string; name: string; cuisine: string }>> {
    try {
      const votesRef = collection(db, 'votes');
      
      // First, get all liked votes without ordering (to avoid index requirement)
      const q = query(
        votesRef,
        where('userId', '==', partnerId),
        where('liked', '==', true)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return [];
      }
      
      const likes: Array<{ id: string; name: string; cuisine: string; timestamp: any }> = [];
      
      snapshot.forEach((doc) => {
        const vote = doc.data();
        const itemId = vote.itemId;
        
        // Find the food item
        const foodItem = foodItems.find(item => item.id === itemId);
        if (foodItem) {
          likes.push({
            id: foodItem.id,
            name: foodItem.name,
            cuisine: foodItem.cuisine,
            timestamp: vote.timestamp,
          });
        }
      });
      
      // Sort by timestamp in memory and take last 5
      const sortedLikes = likes
        .sort((a, b) => {
          // Handle case where timestamp might be null
          if (!a.timestamp) return 1;
          if (!b.timestamp) return -1;
          return b.timestamp.seconds - a.timestamp.seconds;
        })
        .slice(0, 5)
        .map(({ id, name, cuisine }) => ({ id, name, cuisine }));
      
      return sortedLikes;
    } catch (error) {
      console.error('Error revealing recent likes:', error);
      // Return empty array instead of throwing to prevent crashes
      return [];
    }
  },

  /**
   * Deduct hints from user's account
   */
  async spendHints(userId: string, amount: number): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userSnap.data();
      const currentHints = userData.hints || 0;
      
      // Check if user has enough hints
      if (currentHints < amount) {
        return false;
      }
      
      // Deduct hints
      await updateDoc(userRef, {
        hints: currentHints - amount,
      });
      
      return true;
    } catch (error) {
      console.error('Error spending hints:', error);
      throw new Error('Failed to spend hints');
    }
  },

  /**
   * Check if user has enough hints
   */
  async hasEnoughHints(userId: string, amount: number): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return false;
      }
      
      const userData = userSnap.data();
      const currentHints = userData.hints || 0;
      
      return currentHints >= amount;
    } catch (error) {
      console.error('Error checking hints:', error);
      return false;
    }
  },
};
