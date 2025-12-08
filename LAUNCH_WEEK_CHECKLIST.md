# 🚀 LAUNCH WEEK CHECKLIST - iOS App Store Release

**Goal:** Get Dinner Without Debate live on the App Store by end of week  
**Date:** December 8-13, 2025  
**Focus:** iOS first, Android after

---

## 📋 PRE-LAUNCH TASKS (Monday-Tuesday)

### 1. Remove Test Buttons ✅ DONE
- [x] Remove TEST MATCH button from `play-swipe.tsx`
- [x] Remove +100 XP button from `play-swipe.tsx`
- [x] Remove ADD/REMOVE PARTNER button from `play-swipe.tsx`
- [x] Remove +1 DAY STREAK button from `play-swipe.tsx`
- [x] Remove ENABLE/DISABLE PREMIUM button from `play-swipe.tsx`
- [x] Remove test-splash.tsx file (created today)

### 2. Restore RevenueCat ✅ DONE
- [x] Install package: `react-native-purchases@^9.6.9` installed
- [x] iOS API key in EAS: `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (sensitive)
- [x] Real `revenueCatService.ts` implementation active
- [x] Imports correct in `PremiumContext.tsx`
- [x] Paywall has dynamic pricing from RevenueCat offerings
- [ ] Test purchase flow in sandbox (TestFlight)

### 3. Splash/Welcome Screen ✅ DONE
- [x] Keep `login.tsx` as welcome screen (splash.png background + button)
- [x] User taps button to start - intentional design
- [x] Native splash → Welcome screen → Onboarding flow

### 4. Match History ✅ DONE
- [x] Matches save to `matches` collection in Firestore
- [x] Query fetches last 10 matches for couple
- [x] Displayed in Connect screen (premium feature)
- [x] Partner connection locked (can't connect to already-connected user)

### 5. Auth Persistence ✅ DONE
- [x] Onboarding status persists via AsyncStorage (`@onboardingComplete`)
- [x] Firebase auth state persists automatically
- [x] User won't have to onboard twice

---

## 🔧 BUG STATUS

### ✅ ALREADY FIXED
- ✅ **BUG-003: Shared Food Deck** - DONE! Uses seeded shuffle with `coupleId + date` so partners see same order daily
- ✅ **BUG-002: Remove Partner** - DONE! Settings screen has "Remove Partner" button with confirmation
- ✅ **BUG-004: Uber Eats deep link** - DONE! Opens web URL + offers DoorDash as alternative

- ✅ **BUG-005: Match notifications for both partners** - DONE! Cloud Function deployed Dec 8

### 🔧 DEFERRED TO V2
- ❌ "Did you go?" tracking - Nice to have, not critical
- ❌ Smart Search in Cookbook
- ❌ Android release (focus on iOS first)
- ❌ Analytics/tracking implementation

---

## 🏗️ BUILD & TEST (Tuesday-Wednesday)

### 6. Final iOS Build
```bash
cd "/Users/shaneanderson1/Desktop/Vibe Coders/jOY v2/joy-app"
eas build --platform ios --profile production
```

### 7. Submit to TestFlight
```bash
eas submit --platform ios --latest
```

### 8. TestFlight Testing (48 hours)
- [ ] Fresh install test (new user flow)
- [ ] Onboarding complete flow
- [ ] Partner connection works
- [ ] Swiping and matching works
- [ ] Paywall displays with real prices
- [ ] Purchase flow works (sandbox)
- [ ] Restore purchases works
- [ ] App doesn't crash

---

## 📱 APP STORE SUBMISSION (Thursday-Friday)

### 8. App Store Connect Checklist
- [ ] App description finalized
- [ ] Keywords optimized
- [ ] Screenshots uploaded (all required sizes)
- [ ] App preview video (optional but recommended)
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] Age rating questionnaire completed
- [ ] App category selected (Lifestyle or Food & Drink)

### 9. In-App Purchases
- [ ] Verify products in App Store Connect:
  - Lifetime: $24.99
  - Weekly: $4.99/week (3-day trial)
- [ ] Products linked to RevenueCat
- [ ] Sandbox testing passed

### 10. Submit for Review
- [ ] Select build from TestFlight
- [ ] Submit for App Review
- [ ] Respond quickly to any reviewer questions

---

## ✅ ALREADY COMPLETED

- [x] App icons (all sizes)
- [x] Splash screen
- [x] Firebase configured in EAS
- [x] iOS products created in App Store Connect
- [x] RevenueCat iOS connected
- [x] Core app functionality working
- [x] Onboarding flow complete
- [x] Partner connection working
- [x] Gamification system (levels, hints, streaks)
- [x] Cookbook with web importer
- [x] Push notifications configured
- [x] Light/dark mode themes

---

## 🎯 SUCCESS CRITERIA

**Minimum Viable Launch:**
1. User can sign up and complete onboarding
2. User can swipe on foods
3. User can connect with partner
4. User can match with partner
5. User can purchase premium (RevenueCat working)
6. App doesn't crash

**Everything else is V2.**

---

## 📞 QUICK COMMANDS

```bash
# Build iOS
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios --latest

# Check EAS environment
eas env:list --environment production

# View builds
# https://expo.dev/accounts/shanehighpeek/projects/joy-app/builds
```

---

*Be ruthless. Ship it. Iterate later.*
