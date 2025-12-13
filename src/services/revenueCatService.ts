// src/services/revenueCatService.ts
import Purchases, { 
  PurchasesOfferings, 
  CustomerInfo,
  PurchasesPackage,
  LOG_LEVEL 
} from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '';
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '';

export const initializeRevenueCat = async (userId: string): Promise<boolean> => {
  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    
    if (!apiKey || apiKey.trim() === '') {
      console.warn('⚠️ RevenueCat API key not configured, skipping initialization');
      return false;
    }

    await Purchases.configure({ apiKey, appUserID: userId });

    if (__DEV__) {
      await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    console.log('✅ RevenueCat initialized for user:', userId);
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize RevenueCat:', error);
    return false;
  }
};

export const getOfferings = async (): Promise<PurchasesOfferings | null> => {
  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    if (!apiKey || apiKey.trim() === '') {
      return null;
    }
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.error('❌ Failed to get offerings:', error);
    return null;
  }
};

export const purchasePackage = async (
  packageToPurchase: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> => {
  try {
    console.log('🛒 Starting purchase for package:', {
      id: packageToPurchase.identifier,
      type: packageToPurchase.packageType,
      productId: packageToPurchase.product.identifier,
      price: packageToPurchase.product.priceString,
    });
    
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    console.log('✅ Purchase successful!');
    return { success: true, customerInfo };
  } catch (error: any) {
    console.log('❌ Purchase error:', error);
    if (error.userCancelled) {
      console.log('User cancelled purchase');
      return { success: false, error: 'User cancelled' };
    }
    return { success: false, error: error.message || 'Purchase failed' };
  }
};

export const restorePurchases = async (): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return { success: true, customerInfo };
  } catch (error: any) {
    return { success: false, error: error.message || 'Restore failed' };
  }
};

export const checkPremiumStatus = async (): Promise<boolean> => {
  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    if (!apiKey || apiKey.trim() === '') {
      return false;
    }

    const customerInfo = await Purchases.getCustomerInfo();
    const premiumEntitlement = customerInfo.entitlements.active['premium'];
    return !!premiumEntitlement;
  } catch (error) {
    console.error('❌ Failed to check premium status:', error);
    return false;
  }
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('❌ Failed to get customer info:', error);
    return null;
  }
};

export const canAccessPremiumLevels = async (currentLevel: number): Promise<boolean> => {
  if (currentLevel < 10) return true;
  return await checkPremiumStatus();
};

export const hasUnlimitedHints = async (): Promise<boolean> => {
  // Only lifetime purchasers get unlimited hints
  return await checkIsLifetime();
};

export const checkIsLifetime = async (): Promise<boolean> => {
  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    if (!apiKey || apiKey.trim() === '') {
      return false;
    }
    const customerInfo = await Purchases.getCustomerInfo();
    // Check if user has the lifetime entitlement or a non-expiring subscription
    // RevenueCat marks lifetime purchases with no expiration date
    const premiumEntitlement = customerInfo.entitlements.active['premium'];
    if (!premiumEntitlement) return false;
    
    // If expirationDate is null, it's a lifetime purchase
    return premiumEntitlement.expirationDate === null;
  } catch (error) {
    console.error('❌ Failed to check lifetime status:', error);
    return false;
  }
};

export const logoutRevenueCat = async (): Promise<void> => {
  try {
    await Purchases.logOut();
  } catch (error) {
    console.error('❌ Failed to logout from RevenueCat:', error);
  }
};

export const setUserAttributes = async (attributes: {
  email?: string;
  displayName?: string;
  level?: number;
}): Promise<void> => {
  try {
    if (attributes.email) await Purchases.setEmail(attributes.email);
    if (attributes.displayName) await Purchases.setDisplayName(attributes.displayName);
    if (attributes.level !== undefined) {
      await Purchases.setAttributes({ level: attributes.level.toString() });
    }
  } catch (error) {
    console.error('❌ Failed to set user attributes:', error);
  }
};
