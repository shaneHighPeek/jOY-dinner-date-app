import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as RevenueCatService from '../services/revenueCatService';
import { CustomerInfo } from 'react-native-purchases';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface PremiumContextType {
  isPremium: boolean;
  isLifetime: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  checkPremiumStatus: () => Promise<void>;
  purchasePackage: (pkg: any) => Promise<{ success: boolean; error?: string }>;
  restorePurchases: () => Promise<{ success: boolean; error?: string }>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { userData } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const [isLifetime, setIsLifetime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  // Share premium with partner when status changes
  const shareWithPartner = async (premiumStatus: boolean, lifetimeStatus: boolean) => {
    if (!user || !userData?.partnerId) return;
    
    try {
      // Update partner's premium status in Firestore
      const partnerRef = doc(db, 'users', userData.partnerId);
      await updateDoc(partnerRef, {
        isPremium: premiumStatus,
        isLifetime: lifetimeStatus,
        premiumSharedBy: user.uid, // Track who shared the premium
        premiumSharedAt: new Date().toISOString(),
      });
      console.log('Premium shared with partner:', userData.partnerId);
    } catch (error) {
      console.error('Failed to share premium with partner:', error);
    }
  };

  // Initialize RevenueCat when user logs in
  useEffect(() => {
    if (user?.uid) {
      initializeRevenueCat();
    }
  }, [user?.uid]);

  const initializeRevenueCat = async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const initialized = await RevenueCatService.initializeRevenueCat(user.uid);
      // Only check premium status if RevenueCat was actually initialized
      if (initialized) {
        await checkPremiumStatus();
      } else {
        // RevenueCat not initialized (no API key), use Firestore data instead
        setIsPremium(userData?.isPremium === true);
        setIsLifetime(userData?.isLifetime === true);
      }
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      // Don't throw - just set premium to false and continue
      setIsPremium(false);
      setCustomerInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPremiumStatus = async () => {
    try {
      const [premium, lifetime, info] = await Promise.all([
        RevenueCatService.checkPremiumStatus(),
        RevenueCatService.checkIsLifetime(),
        RevenueCatService.getCustomerInfo(),
      ]);
      
      // IMPORTANT: Check BOTH RevenueCat AND Firestore
      // Partner may have premium shared via Firestore but not in RevenueCat
      // Get fresh Firestore data to check for shared premium
      let finalPremium = premium;
      let finalLifetime = lifetime;
      
      if (user && !premium) {
        // RevenueCat says not premium - check if partner shared it via Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const firestoreData = userDoc.data();
        
        if (firestoreData?.isPremium === true && firestoreData?.premiumSharedBy) {
          // Premium was shared by partner - use Firestore values
          console.log('Premium shared by partner, using Firestore status');
          finalPremium = true;
          finalLifetime = firestoreData?.isLifetime === true;
        }
      }
      
      setIsPremium(finalPremium);
      setIsLifetime(finalLifetime);
      setCustomerInfo(info);
    } catch (error) {
      console.error('Failed to check premium status:', error);
      setIsPremium(false);
      setIsLifetime(false);
    }
  };

  const purchasePackage = async (pkg: any) => {
    try {
      const result = await RevenueCatService.purchasePackage(pkg);
      
      if (result.success && result.customerInfo) {
        setCustomerInfo(result.customerInfo);
        
        // Check new premium status
        const [newPremium, newLifetime] = await Promise.all([
          RevenueCatService.checkPremiumStatus(),
          RevenueCatService.checkIsLifetime(),
        ]);
        
        console.log('Purchase complete. newPremium:', newPremium, 'newLifetime:', newLifetime);
        
        setIsPremium(newPremium);
        setIsLifetime(newLifetime);
        
        // Update current user's Firestore record AND share with partner
        if (user && newPremium) {
          const userRef = doc(db, 'users', user.uid);
          
          // FETCH FRESH DATA FROM FIRESTORE - don't rely on React state
          const freshUserDoc = await getDoc(userRef);
          const freshUserData = freshUserDoc.data();
          const partnerId = freshUserData?.partnerId;
          
          console.log('Fresh Firestore data - partnerId:', partnerId);
          
          // Update buyer's record
          await updateDoc(userRef, {
            isPremium: newPremium,
            isLifetime: newLifetime,
          });
          console.log('Updated buyer Firestore:', user.uid);
          
          // Share premium with partner if connected
          if (partnerId) {
            console.log('Sharing premium with partner:', partnerId);
            try {
              const partnerRef = doc(db, 'users', partnerId);
              await updateDoc(partnerRef, {
                isPremium: newPremium,
                isLifetime: newLifetime,
                premiumSharedBy: user.uid,
                premiumSharedAt: new Date().toISOString(),
              });
              console.log('SUCCESS: Premium shared with partner:', partnerId);
            } catch (partnerError) {
              console.error('FAILED to update partner:', partnerError);
            }
          } else {
            console.log('No partner connected - partnerId is:', partnerId);
          }
        } else if (user) {
          // Not premium, just update the record
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            isPremium: newPremium,
            isLifetime: newLifetime,
          });
        }
      }
      
      return result;
    } catch (error: any) {
      console.error('Purchase error:', error);
      return {
        success: false,
        error: error.message || 'Purchase failed',
      };
    }
  };

  const restorePurchases = async () => {
    try {
      const result = await RevenueCatService.restorePurchases();
      
      if (result.success && result.customerInfo) {
        setCustomerInfo(result.customerInfo);
        
        // Check restored premium status
        const [newPremium, newLifetime] = await Promise.all([
          RevenueCatService.checkPremiumStatus(),
          RevenueCatService.checkIsLifetime(),
        ]);
        
        console.log('Restore complete. newPremium:', newPremium, 'newLifetime:', newLifetime);
        
        setIsPremium(newPremium);
        setIsLifetime(newLifetime);
        
        // Update current user's Firestore record AND share with partner
        if (user && newPremium) {
          const userRef = doc(db, 'users', user.uid);
          
          // FETCH FRESH DATA FROM FIRESTORE - don't rely on React state
          const freshUserDoc = await getDoc(userRef);
          const freshUserData = freshUserDoc.data();
          const partnerId = freshUserData?.partnerId;
          
          console.log('Fresh Firestore data - partnerId:', partnerId);
          
          // Update buyer's record
          await updateDoc(userRef, {
            isPremium: newPremium,
            isLifetime: newLifetime,
          });
          console.log('Updated buyer Firestore:', user.uid);
          
          // Share premium with partner if connected
          if (partnerId) {
            console.log('Sharing restored premium with partner:', partnerId);
            try {
              const partnerRef = doc(db, 'users', partnerId);
              await updateDoc(partnerRef, {
                isPremium: newPremium,
                isLifetime: newLifetime,
                premiumSharedBy: user.uid,
                premiumSharedAt: new Date().toISOString(),
              });
              console.log('SUCCESS: Restored premium shared with partner:', partnerId);
            } catch (partnerError) {
              console.error('FAILED to update partner:', partnerError);
            }
          } else {
            console.log('No partner connected - partnerId is:', partnerId);
          }
        } else if (user) {
          // Not premium, just update the record
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            isPremium: newPremium,
            isLifetime: newLifetime,
          });
        }
      }
      
      return result;
    } catch (error: any) {
      console.error('Restore error:', error);
      return {
        success: false,
        error: error.message || 'Restore failed',
      };
    }
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        isLifetime,
        isLoading,
        customerInfo,
        checkPremiumStatus,
        purchasePackage,
        restorePurchases,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = (): PremiumContextType => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};
