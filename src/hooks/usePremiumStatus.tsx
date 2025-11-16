import { useUser } from './useUser';

export const usePremiumStatus = () => {
  const { userData } = useUser();

  if (!userData) {
    return { isPremium: false, trialEndDate: null };
  }

  const trialEndDate = userData.trialEndDate?.toDate();
  const isPremium = trialEndDate ? trialEndDate > new Date() : false;

  return { isPremium, trialEndDate };
};
