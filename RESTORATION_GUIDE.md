# App Restoration Guide

This document tracks all features that were temporarily disabled or stubbed to stabilize the iOS app. Once the app is confirmed working on TestFlight, follow this guide to restore full functionality.

---

## 🔴 REMOVED: RevenueCat (react-native-purchases)

### What Was Removed
- **Package**: `react-native-purchases` was removed from `package.json`
- **Service**: `src/services/revenueCatService.ts` was replaced with a stub implementation

### Current State
The app has a **stub implementation** that:
- Returns `false` for all premium checks
- Returns `null` for offerings
- Logs stub messages to console
- Does NOT crash the app

### Files Affected
1. `src/services/revenueCatService.ts` - Stub implementation (no native module)
2. `src/contexts/PremiumContext.tsx` - Imports from stub service
3. `app/paywall.tsx` - Imports types from stub service

### How to Restore

#### Step 1: Install the package
```bash
cd /Users/shaneanderson1/Desktop/Vibe\ Coders/jOY\ v2/joy-app
npm install react-native-purchases
```

#### Step 2: Add RevenueCat API keys to EAS environment
```bash
eas env:create --environment production --visibility sensitive --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "YOUR_IOS_KEY"
eas env:create --environment production --visibility sensitive --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "YOUR_ANDROID_KEY"
```

#### Step 3: Restore the original revenueCatService.ts
Replace the stub with the real implementation:

```typescript
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

export const initializeRevenueCat = async (userId: string): Promise<void> => {
  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    
    if (!apiKey || apiKey.trim() === '') {
      console.warn('⚠️ RevenueCat API key not configured, skipping initialization');
      return;
    }

    await Purchases.configure({ apiKey, appUserID: userId });

    if (__DEV__) {
      await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    console.log('✅ RevenueCat initialized for user:', userId);
  } catch (error) {
    console.error('❌ Failed to initialize RevenueCat:', error);
  }
};

export const getOfferings = async (): Promise<PurchasesOfferings | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to get offerings:', error);
    return null;
  }
};

export const purchasePackage = async (
  packageToPurchase: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return { success: true, customerInfo };
  } catch (error: any) {
    if (error.userCancelled) {
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
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (error) {
    console.error('❌ Failed to check premium status:', error);
    return false;
  }
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    if (!apiKey || apiKey.trim() === '') {
      return null;
    }
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
  return await checkPremiumStatus();
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
```

#### Step 4: Update PremiumContext.tsx imports
```typescript
// Change this:
import { CustomerInfo } from '../services/revenueCatService';

// To this:
import { CustomerInfo } from 'react-native-purchases';
```

#### Step 5: Update paywall.tsx imports
```typescript
// Change this:
import { getOfferings, PurchasesOfferings, PurchasesPackage } from '@/services/revenueCatService';

// To this:
import { getOfferings } from '@/services/revenueCatService';
import { PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';
```

#### Step 6: Rebuild and test
```bash
eas build --platform ios --profile production
```

---

## 🟡 MODIFIED: app.json

### Changes Made
1. **Removed** `"reactCompiler": true` from experiments (experimental feature causing potential issues)
2. **Added** `expo-build-properties` plugin with explicit New Architecture config

### Current State (app.json)
```json
{
  "expo": {
    "newArchEnabled": true,
    "experiments": {
      "typedRoutes": true
    },
    "plugins": [
      // ... other plugins
      [
        "expo-build-properties",
        {
          "ios": {
            "newArchEnabled": true
          },
          "android": {
            "newArchEnabled": true
          }
        }
      ]
    ]
  }
}
```

### To Restore React Compiler (if needed later)
Add back to experiments:
```json
"experiments": {
  "typedRoutes": true,
  "reactCompiler": true
}
```

---

## 🟢 ADDED: EAS Environment Variables

### Variables Added to Production
These are now configured in EAS and will be included in all production builds:

| Variable | Value |
|----------|-------|
| EXPO_PUBLIC_FIREBASE_API_KEY | AIzaSyBkIx7YIua5FioCDOaIX1metqGyvNA4lsc |
| EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN | joy-windsurf-4979a.firebaseapp.com |
| EXPO_PUBLIC_FIREBASE_PROJECT_ID | joy-windsurf-4979a |
| EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET | joy-windsurf-4979a.firebasestorage.app |
| EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | 53925701804 |
| EXPO_PUBLIC_FIREBASE_APP_ID | 1:53925701804:web:5742aa80e5b0d0043c1709 |

### To View Current Variables
```bash
eas env:list --environment production
```

### To Add RevenueCat Keys Later
```bash
eas env:create --environment production --visibility sensitive --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "YOUR_KEY"
eas env:create --environment production --visibility sensitive --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "YOUR_KEY"
```

---

## 📋 Restoration Checklist

When the app is confirmed stable, restore features in this order:

### Phase 1: Verify Stability
- [ ] Build 21 installs from TestFlight
- [ ] App launches without crashing
- [ ] Firebase authentication works
- [ ] Firestore data loads correctly
- [ ] Basic app navigation works

### Phase 2: Restore RevenueCat
- [ ] Get RevenueCat API keys from https://app.revenuecat.com
- [ ] Add keys to EAS environment variables
- [ ] Install `react-native-purchases` package
- [ ] Restore real `revenueCatService.ts` implementation
- [ ] Update imports in `PremiumContext.tsx` and `paywall.tsx`
- [ ] Build and test on TestFlight
- [ ] Verify purchases work in sandbox

### Phase 3: Re-enable Experimental Features (Optional)
- [ ] Consider re-enabling React Compiler if needed
- [ ] Test thoroughly before production release

---

## 🔧 Useful Commands

```bash
# Check EAS environment variables
eas env:list --environment production

# Build iOS
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios --latest

# View build logs
# Visit: https://expo.dev/accounts/shanehighpeek/projects/joy-app/builds
```

---

## 📝 Notes

- **Build 21** is the first build with proper Firebase environment variables
- Previous builds (1-20) all crashed due to missing Firebase config
- The RevenueCat stub is safe and won't crash - it just returns false/null for everything
- Always test on TestFlight before restoring features

---

*Last Updated: November 26, 2025*
*Stable Build: 21*
