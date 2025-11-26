/**
 * RevenueCat Service - STUB IMPLEMENTATION
 * 
 * The react-native-purchases native module has been temporarily removed
 * to stabilize the app. This stub provides the same interface but returns
 * safe default values.
 * 
 * TODO: Re-add react-native-purchases once the app is stable
 */

// Stub types to match RevenueCat interface
export interface CustomerInfo {
  entitlements: {
    active: Record<string, any>;
    all: Record<string, any>;
  };
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
  latestExpirationDate: string | null;
  firstSeen: string;
  originalAppUserId: string;
  requestDate: string;
  originalApplicationVersion: string | null;
  originalPurchaseDate: string | null;
  managementURL: string | null;
}

export interface PurchasesPackage {
  identifier: string;
  packageType: string;
  product: {
    identifier: string;
    description: string;
    title: string;
    price: number;
    priceString: string;
    currencyCode: string;
  };
  offeringIdentifier: string;
}

export interface PurchasesOffering {
  identifier: string;
  serverDescription: string;
  availablePackages: PurchasesPackage[];
  lifetime: PurchasesPackage | null;
  annual: PurchasesPackage | null;
  sixMonth: PurchasesPackage | null;
  threeMonth: PurchasesPackage | null;
  twoMonth: PurchasesPackage | null;
  monthly: PurchasesPackage | null;
  weekly: PurchasesPackage | null;
}

export interface PurchasesOfferings {
  current: PurchasesOffering | null;
  all: Record<string, PurchasesOffering>;
}

/**
 * Initialize RevenueCat SDK (STUB)
 */
export const initializeRevenueCat = async (userId: string): Promise<void> => {
  console.log('ℹ️ RevenueCat stub: initializeRevenueCat called for user:', userId);
  // No-op - RevenueCat is disabled
};

/**
 * Get available subscription offerings (STUB)
 */
export const getOfferings = async (): Promise<PurchasesOfferings | null> => {
  console.log('ℹ️ RevenueCat stub: getOfferings called - returning null');
  return null;
};

/**
 * Purchase a package (STUB)
 */
export const purchasePackage = async (
  packageToPurchase: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> => {
  console.log('ℹ️ RevenueCat stub: purchasePackage called');
  return {
    success: false,
    error: 'Purchases are temporarily unavailable',
  };
};

/**
 * Restore previous purchases (STUB)
 */
export const restorePurchases = async (): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> => {
  console.log('ℹ️ RevenueCat stub: restorePurchases called');
  return {
    success: false,
    error: 'Restore is temporarily unavailable',
  };
};

/**
 * Check if user has premium access (STUB)
 */
export const checkPremiumStatus = async (): Promise<boolean> => {
  console.log('ℹ️ RevenueCat stub: checkPremiumStatus called - returning false');
  return false;
};

/**
 * Get customer info (STUB)
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  console.log('ℹ️ RevenueCat stub: getCustomerInfo called - returning null');
  return null;
};

/**
 * Check if user can access premium levels (10-20)
 */
export const canAccessPremiumLevels = async (currentLevel: number): Promise<boolean> => {
  // Levels 1-9 are free for everyone
  if (currentLevel < 10) {
    return true;
  }
  // Premium levels require subscription (currently disabled)
  return false;
};

/**
 * Check if user has unlimited hints (STUB)
 */
export const hasUnlimitedHints = async (): Promise<boolean> => {
  return false;
};

/**
 * Log out user from RevenueCat (STUB)
 */
export const logoutRevenueCat = async (): Promise<void> => {
  console.log('ℹ️ RevenueCat stub: logoutRevenueCat called');
};

/**
 * Set user attributes for analytics (STUB)
 */
export const setUserAttributes = async (attributes: {
  email?: string;
  displayName?: string;
  level?: number;
}): Promise<void> => {
  console.log('ℹ️ RevenueCat stub: setUserAttributes called');
};
