# Dinner Without Debate - Launch Checklist

**Last Updated:** December 13, 2025

---

## 🎯 Current Status

| Platform | Status | Next Step |
|----------|--------|-----------|
| **iOS** | **✅ LIVE** | Monitor analytics |
| **Android** | **🚀 SUBMITTED** | Wait for Review (1-3 days) |
| **RevenueCat** | **✅ ACTIVE** | Monitor purchase events |

---

## 🚀 GOOGLE PLAY SUBMISSION (COMPLETED)

### Phase 1: Google Play Console Configuration ✅
- [x] **Closed Testing Track:** Active & Approved.
- [x] **Subscriptions Created:**
  - Weekly Plan (`dwd_premium_weekly`): $4.99 + 3-day trial.
  - Lifetime Plan (`dwd_premium_lifetime`): $24.99 (Managed Product).
- [x] **Store Listing:** Screenshots, Descriptions, Icon, Feature Graphic.
- [x] **App Content:** Privacy Policy, Data Safety, Target Audience (18+).

### Phase 2: RevenueCat Connection ✅
- [x] **Service Account:** Created in Google Cloud (`revenuecat-service-account`).
- [x] **Permissions:** Granted "Financial Data" & "Manage Orders" access.
- [x] **Connection:** Validated in RevenueCat Dashboard.
- [x] **Sync:** Products imported and mapped to Entitlements/Offerings.

### Phase 3: Build & Deploy ✅
- [x] **API Key:** `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` added to EAS secrets.
- [x] **App Polish:** Dark splash screen fixed, unused permissions removed.
- [x] **Build:** Production `.aab` (Version 7) built successfully.
- [x] **Submit:** Uploaded to Production Track & Rolled Out.

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
- `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` ✅ (`goog_UdzGnqvmbPxPzidoTcOeccfjKQH`)

### RevenueCat API Keys
- **iOS:** `appl_UhSCgECKAvjYMMzIBkDrvfakxdu`
- **Android:** `goog_UdzGnqvmbPxPzidoTcOeccfjKQH`

---

## 📝 Next Steps (Post-Launch)

1.  **Monitor Review:** Google typically takes 1-3 days for the first review.
2.  **Test Purchases:** Once live, verify a real purchase on an Android device.
3.  **Celebrate:** You have shipped a cross-platform app with complex subscriptions and backend integration! 🎉
