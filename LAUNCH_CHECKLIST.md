# Dinner Without Debate - Launch Checklist

**Last Updated:** December 6, 2025

---

## 🎯 Current Status

| Platform | Status | Next Step |
|----------|--------|-----------|
| **iOS** | Ready to build | Build & submit to TestFlight |
| **Android** | In Review | Wait for Google approval, then create subscriptions |
| **RevenueCat** | iOS connected | Add Android after Google approves |

---

## ✅ COMPLETED

### App Development
- [x] Core app functionality (swipe, match, connect)
- [x] Firebase authentication & Firestore
- [x] Onboarding flow with paywall
- [x] Premium/subscription UI
- [x] All test buttons removed
- [x] Branding updated (jOY → Dinner Without Debate)
- [x] Fake stats removed from review-prompt
- [x] Login screen with splash background
- [x] Code committed to GitHub

### RevenueCat Setup
- [x] RevenueCat account created
- [x] iOS app connected in RevenueCat
- [x] `react-native-purchases` package installed
- [x] Real RevenueCat service implementation restored
- [x] iOS API key added to EAS environment (`EXPO_PUBLIC_REVENUECAT_IOS_KEY`)

### App Store Connect (iOS)
- [x] App created in App Store Connect
- [x] In-app purchases created:
  - Lifetime Plan: $24.99
  - Weekly Plan: $4.99/week (3-day trial)
- [x] Paywall screenshots uploaded

### Google Play Console (Android)
- [x] App created in Google Play Console
- [x] Store listing completed (description, screenshots, etc.)
- [x] Data safety form completed
- [x] Content rating completed
- [x] AAB uploaded to closed testing
- [x] **Closed testing submitted for review** ← CURRENT

---

## 🔄 IN PROGRESS

### Waiting on Google (1-24 hours)
- [ ] Google closed testing review approval
- [ ] Once approved: Create Android subscriptions
- [ ] Once approved: Connect Android to RevenueCat
- [ ] Once approved: Add Android API key to EAS

---

## 📋 NEXT STEPS (In Order)

### Step 1: Build iOS for TestFlight
```bash
eas build --platform ios --profile production
```
Then submit to TestFlight:
```bash
eas submit --platform ios --latest
```

### Step 2: Test on TestFlight
- [ ] Install from TestFlight
- [ ] Verify splash screen looks correct
- [ ] Test anonymous login
- [ ] Complete onboarding
- [ ] Test paywall displays correctly
- [ ] Test sandbox purchase (if RevenueCat products configured)

### Step 3: When Google Approves (check email/console)
1. Go to **Monetise with Play** → **Subscriptions**
2. Create subscriptions:
   - `dwd_premium_lifetime` - $24.99
   - `dwd_premium_weekly` - $4.99/week with 3-day trial
3. Go to RevenueCat → Add Android app
4. Upload Google service account JSON
5. Import products to RevenueCat
6. Add to EAS:
   ```bash
   eas env:create --environment production --visibility sensitive --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "goog_xxxxx"
   ```

### Step 4: Configure RevenueCat Products
1. Create entitlement: `premium`
2. Create offering: `default`
3. Add packages:
   - Lifetime package → lifetime product
   - Weekly package → weekly product

### Step 5: Final Production Build
```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

### Step 6: Submit for Review
- iOS: Submit via App Store Connect
- Android: Promote from closed testing to production

---

## 🔑 Important Info

### App Details
- **Name:** Dinner Without Debate
- **Short Name:** Dinner WO Debate
- **Bundle ID (iOS):** com.highpeekpro.dinnerwithoutdebate
- **Package (Android):** com.highpeekpro.dinnerwithoutdebate

### Pricing
- **Lifetime:** $24.99 (one-time)
- **Weekly:** $4.99/week (3-day free trial)

### EAS Environment Variables (Production)
- `EXPO_PUBLIC_FIREBASE_API_KEY` ✅
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` ✅
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID` ✅
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` ✅
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` ✅
- `EXPO_PUBLIC_FIREBASE_APP_ID` ✅
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY` ✅
- `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` ⏳ (after Google approves)

### RevenueCat API Keys
- **iOS:** `appl_UhSCgECKAvjYMMzIBkDrvfakxdu`
- **Android:** TBD (after Google approves)

---

## 📝 Notes

- Google closed testing review typically takes a few hours to 1 day
- You'll receive an email when approved
- iOS can proceed independently of Android
- TestFlight builds can be tested while waiting for Google

---

*This checklist will be updated as we progress.*
