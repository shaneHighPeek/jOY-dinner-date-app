import Purchases, { 
  PurchasesOfferings, 
  CustomerInfo,
  PurchasesPackage,
  LOG_LEVEL 
} from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API Keys (you'll need to add these to your .env file)
const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '';
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '';

/**
 * Initialize RevenueCat SDK
 * Call this once when the app starts, after user authentication
 */
export const initializeRevenueCat = async (userId: string): Promise<void> => {
  try {
    // Check if API key exists
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    
    if (!apiKey || apiKey.trim() === '') {
      console.warn('⚠️ RevenueCat API key not configured, skipping initialization');
      return;
    }

    // Configure SDK
    if (Platform.OS === 'ios') {
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY_IOS, appUserID: userId });
    } else if (Platform.OS === 'android') {
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY_ANDROID, appUserID: userId });
    }

    // Enable debug logs in development
    if (__DEV__) {
      await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    console.log('✅ RevenueCat initialized for user:', userId);
  } catch (error) {
    console.error('❌ Failed to initialize RevenueCat:', error);
    // Don't throw - let the app continue without RevenueCat
  }
};

/**
 * Get available subscription offerings
 */
export const getOfferings = async (): Promise<PurchasesOfferings | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    
    if (offerings.current !== null) {
      console.log('📦 Available offerings:', offerings.current.availablePackages.length);
      return offerings;
    }
    
    console.warn('⚠️ No offerings available');
    return null;
  } catch (error) {
    console.error('❌ Failed to get offerings:', error);
    return null;
  }
};

/**
 * Purchase a package
 */
export const purchasePackage = async (
  packageToPurchase: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    console.log('✅ Purchase successful:', customerInfo.entitlements.active);
    
    return {
      success: true,
      customerInfo,
    };
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('ℹ️ User cancelled purchase');
      return {
        success: false,
        error: 'User cancelled',
      };
    }
    
    console.error('❌ Purchase failed:', error);
    return {
      success: false,
      error: error.message || 'Purchase failed',
    };
  }
};

/**
 * Restore previous purchases
 */
export const restorePurchases = async (): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    console.log('✅ Purchases restored:', customerInfo.entitlements.active);
    
    return {
      success: true,
      customerInfo,
    };
  } catch (error: any) {
    console.error('❌ Failed to restore purchases:', error);
    return {
      success: false,
      error: error.message || 'Restore failed',
    };
  }
};

/**
 * Check if user has premium access
 */
export const checkPremiumStatus = async (): Promise<boolean> => {
  try {
    // Check if RevenueCat is configured
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    if (!apiKey || apiKey.trim() === '') {
      console.warn('⚠️ RevenueCat not configured, returning false for premium status');
      return false;
    }

    const customerInfo = await Purchases.getCustomerInfo();
    
    // Check if user has the "premium" entitlement active
    const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
    
    console.log('🔐 Premium status:', isPremium);
    return isPremium;
  } catch (error) {
    console.error('❌ Failed to check premium status:', error);
    return false;
  }
};

/**
 * Get customer info
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    // Check if RevenueCat is configured
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    if (!apiKey || apiKey.trim() === '') {
      console.warn('⚠️ RevenueCat not configured, returning null for customer info');
      return null;
    }

    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('❌ Failed to get customer info:', error);
    return null;
  }
};

/**
 * Check if user can access premium levels (10-20)
 */
export const canAccessPremiumLevels = async (currentLevel: number): Promise<boolean> => {
  // Levels 1-9 are free for everyone
  if (currentLevel < 10) {
    return true;
  }
  
  // Levels 10+ require premium
  return await checkPremiumStatus();
};

/**
 * Check if user has unlimited hints
 */
export const hasUnlimitedHints = async (): Promise<boolean> => {
  return await checkPremiumStatus();
};

/**
 * Log out user from RevenueCat
 */
export const logoutRevenueCat = async (): Promise<void> => {
  try {
    await Purchases.logOut();
    console.log('✅ Logged out from RevenueCat');
  } catch (error) {
    console.error('❌ Failed to logout from RevenueCat:', error);
  }
};

/**
 * Set user attributes for analytics
 */
export const setUserAttributes = async (attributes: {
  email?: string;
  displayName?: string;
  level?: number;
}): Promise<void> => {
  try {
    if (attributes.email) {
      await Purchases.setEmail(attributes.email);
    }
    if (attributes.displayName) {
      await Purchases.setDisplayName(attributes.displayName);
    }
    
    // Custom attributes
    if (attributes.level !== undefined) {
      await Purchases.setAttributes({ level: attributes.level.toString() });
    }
    
    console.log('✅ User attributes set');
  } catch (error) {
    console.error('❌ Failed to set user attributes:', error);
  }
};
