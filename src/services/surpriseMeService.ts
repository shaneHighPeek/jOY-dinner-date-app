import { DocumentData } from 'firebase/firestore';
import { foodItems } from '@/constants/foodItems';

const getSuggestions = (user1: DocumentData, user2?: DocumentData) => {
  const user1Prefs = user1.cuisinePreferences || [];
  
  if (!user2) {
    // Solo mode: suggest something the user likes, or a wildcard
    const liked = foodItems.filter(item => user1Prefs.includes(item.name));
    if (liked.length > 0 && Math.random() > 0.2) {
      return liked[Math.floor(Math.random() * liked.length)];
    }
    // Wildcard
    return foodItems[Math.floor(Math.random() * foodItems.length)];
  }

  const user2Prefs = user2.cuisinePreferences || [];
  const mutualLikes = foodItems.filter(
    item => user1Prefs.includes(item.name) && user2Prefs.includes(item.name)
  );

  if (mutualLikes.length > 0) {
    return mutualLikes[Math.floor(Math.random() * mutualLikes.length)];
  }

  // No overlap, pick from one partner's preferences
  // TODO: Implement 'turn' logic for fairness
  const combinedPrefs = [...user1Prefs, ...user2Prefs];
  const suggestions = foodItems.filter(item => combinedPrefs.includes(item.name));
  
  if (suggestions.length > 0) {
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  // Fallback to a random item
  return foodItems[Math.floor(Math.random() * foodItems.length)];
};

export const SurpriseMeService = {
  getSuggestions,
};
