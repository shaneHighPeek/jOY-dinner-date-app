import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CustomerInfo } from 'react-native-purchases';
import * as RevenueCatService from '../services/revenueCatService';
import { useAuth } from '../hooks/useAuth';

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  checkPremiumStatus: () => Promise<void>;
  purchasePackage: (pkg: any) => Promise<{ success: boolean; error?: string }>;
  restorePurchases: () => Promise<{ success: boolean; error?: string }>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

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
      await RevenueCatService.initializeRevenueCat(user.uid);
      await checkPremiumStatus();
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
      const [premium, info] = await Promise.all([
        RevenueCatService.checkPremiumStatus(),
        RevenueCatService.getCustomerInfo(),
      ]);
      
      setIsPremium(premium);
      setCustomerInfo(info);
    } catch (error) {
      console.error('Failed to check premium status:', error);
      setIsPremium(false);
    }
  };

  const purchasePackage = async (pkg: any) => {
    try {
      const result = await RevenueCatService.purchasePackage(pkg);
      
      if (result.success && result.customerInfo) {
        setCustomerInfo(result.customerInfo);
        await checkPremiumStatus();
      }
      
      return result;
    } catch (error: any) {
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
        await checkPremiumStatus();
      }
      
      return result;
    } catch (error: any) {
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
