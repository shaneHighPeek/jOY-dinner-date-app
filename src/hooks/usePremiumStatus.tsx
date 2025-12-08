import { useUser } from './useUser';

export interface PremiumStatus {
  isPremium: boolean;      // Has paid for premium (not trial)
  isLifetime: boolean;     // Has lifetime purchase
  isOnTrial: boolean;      // Currently in trial period
  trialExpired: boolean;   // Trial has ended and not premium
  trialEndDate: Date | null;
  trialDaysLeft: number;   // Days remaining in trial
  hasFullAccess: boolean;  // Can access all features (premium OR active trial)
  loading: boolean;
}

export const usePremiumStatus = (): PremiumStatus => {
  const { userData, loading } = useUser();

  if (!userData) {
    return { 
      isPremium: false, 
      isLifetime: false, 
      isOnTrial: false,
      trialExpired: false,
      trialEndDate: null, 
      trialDaysLeft: 0,
      hasFullAccess: false,
      loading 
    };
  }

  // Check if user has paid premium (either from purchase or shared from partner)
  const isPremium = userData.isPremium === true;
  const isLifetime = userData.isLifetime === true;
  
  // Parse trial end date
  let trialEndDate: Date | null = null;
  if (userData.trialEndDate) {
    // Handle both Firestore Timestamp and Date objects
    trialEndDate = userData.trialEndDate.toDate?.() || new Date(userData.trialEndDate);
  }
  
  // Calculate trial status
  const now = new Date();
  const isOnTrial = trialEndDate ? trialEndDate > now : false;
  const trialExpired = trialEndDate ? trialEndDate <= now : false;
  
  // Calculate days left in trial
  let trialDaysLeft = 0;
  if (trialEndDate && isOnTrial) {
    const msLeft = trialEndDate.getTime() - now.getTime();
    trialDaysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  }

  // User has full access if they're premium OR on active trial
  const hasFullAccess = isPremium || isOnTrial;

  return { 
    isPremium, 
    isLifetime, 
    isOnTrial,
    trialExpired: trialExpired && !isPremium, // Only expired if not premium
    trialEndDate, 
    trialDaysLeft,
    hasFullAccess,
    loading 
  };
};
