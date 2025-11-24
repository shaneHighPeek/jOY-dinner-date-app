# RevenueCat Setup Guide

This guide will walk you through setting up RevenueCat for in-app purchases and subscriptions in the jOY app.

## 📋 Prerequisites

- Apple Developer Account ($99/year)
- Google Play Developer Account ($25 one-time)
- RevenueCat account (free to start)

---

## 🚀 Step 1: Create RevenueCat Account

1. Go to [https://app.revenuecat.com](https://app.revenuecat.com)
2. Sign up for a free account
3. Create a new project called "jOY"

---

## 🍎 Step 2: iOS Setup

### 2.1 App Store Connect Setup

1. Log into [App Store Connect](https://appstoreconnect.apple.com)
2. Go to **My Apps** → **Create New App**
3. Fill in app details:
   - **Platform**: iOS
   - **Name**: jOY
   - **Primary Language**: English
   - **Bundle ID**: Create a unique bundle ID (e.g., `com.yourcompany.joy`)
   - **SKU**: `joy-ios`

### 2.2 Create In-App Purchases

1. In App Store Connect, go to your app → **In-App Purchases**
2. Click **+** to create a new subscription group
3. Name it "jOY Premium"
4. Create subscriptions:

   **Monthly Subscription:**
   - Product ID: `joy_premium_monthly`
   - Reference Name: jOY Premium Monthly
   - Duration: 1 Month
   - Price: $4.99 (or your preferred price)

   **Annual Subscription:**
   - Product ID: `joy_premium_annual`
   - Reference Name: jOY Premium Annual
   - Duration: 1 Year
   - Price: $39.99 (or your preferred price)

5. Add localized descriptions and screenshots for each subscription

### 2.3 Connect to RevenueCat

1. In RevenueCat dashboard, go to **Project Settings** → **Apps**
2. Click **+ New** → **iOS**
3. Enter your **Bundle ID** from App Store Connect
4. Go to App Store Connect → **Users and Access** → **Keys**
5. Create a new **App Store Connect API Key**:
   - Name: RevenueCat
   - Access: App Manager
   - Download the `.p8` file
6. Upload the `.p8` file to RevenueCat
7. Enter **Issuer ID** and **Key ID** from App Store Connect

### 2.4 Configure Products in RevenueCat

1. In RevenueCat, go to **Products**
2. Click **+ New** to create products:
   - Import `joy_premium_monthly` from App Store Connect
   - Import `joy_premium_annual` from App Store Connect

### 2.5 Create Entitlements

1. Go to **Entitlements** → **+ New**
2. Create entitlement: `premium`
3. Attach both products to this entitlement

### 2.6 Create Offerings

1. Go to **Offerings** → **+ New**
2. Create offering: `default`
3. Add packages:
   - **Monthly**: `joy_premium_monthly`
   - **Annual**: `joy_premium_annual` (mark as default)

---

## 🤖 Step 3: Android Setup

### 3.1 Google Play Console Setup

1. Log into [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Fill in app details:
   - **App name**: jOY
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free

### 3.2 Create In-App Products

1. Go to **Monetize** → **In-app products** → **Subscriptions**
2. Create subscription group: "jOY Premium"
3. Create subscriptions:

   **Monthly Subscription:**
   - Product ID: `joy_premium_monthly`
   - Name: jOY Premium Monthly
   - Billing period: 1 month
   - Price: $4.99

   **Annual Subscription:**
   - Product ID: `joy_premium_annual`
   - Name: jOY Premium Annual
   - Billing period: 1 year
   - Price: $39.99

### 3.3 Connect to RevenueCat

1. In RevenueCat dashboard, go to **Project Settings** → **Apps**
2. Click **+ New** → **Android**
3. Enter your **Package Name** from Google Play Console
4. In Google Play Console, go to **Setup** → **API access**
5. Link to a Google Cloud project
6. Create a **Service Account**
7. Grant **Finance** permissions
8. Download the JSON key file
9. Upload the JSON file to RevenueCat

### 3.4 Configure Products (same as iOS)

Follow the same steps as iOS section 2.4-2.6 for Android products.

---

## 🔑 Step 4: Get API Keys

1. In RevenueCat dashboard, go to **Project Settings** → **API Keys**
2. Copy your **Public API Keys**:
   - iOS: `appl_xxxxxxxxxxxxx`
   - Android: `goog_xxxxxxxxxxxxx`

---

## 💻 Step 5: Add Keys to Your App

1. Open your `.env` file in the jOY app
2. Add your RevenueCat API keys:

```env
EXPO_PUBLIC_REVENUECAT_IOS_KEY="appl_xxxxxxxxxxxxx"
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY="goog_xxxxxxxxxxxxx"
```

3. Restart your development server

---

## 🧪 Step 6: Testing

### Sandbox Testing (iOS)

1. In App Store Connect, create a **Sandbox Tester** account
2. On your iOS device, sign out of your Apple ID
3. Run the app and attempt a purchase
4. Sign in with your sandbox tester account when prompted

### Test Purchases (Android)

1. In Google Play Console, add **License testers**
2. Add your Google account email
3. Install the app via internal testing track
4. Attempt a purchase (it will be free for testers)

### RevenueCat Test Mode

RevenueCat automatically detects sandbox/test purchases and won't charge real money during development.

---

## 📱 Step 7: Update App Configuration

### Update app.json

Add your bundle IDs to `app.json`:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.joy"
    },
    "android": {
      "package": "com.yourcompany.joy"
    }
  }
}
```

---

## ✅ Verification Checklist

- [ ] RevenueCat account created
- [ ] iOS app created in App Store Connect
- [ ] iOS subscriptions created
- [ ] iOS App Store Connect API key uploaded to RevenueCat
- [ ] Android app created in Google Play Console
- [ ] Android subscriptions created
- [ ] Android service account JSON uploaded to RevenueCat
- [ ] Products configured in RevenueCat
- [ ] Entitlements created (`premium`)
- [ ] Offerings created (`default`)
- [ ] API keys added to `.env` file
- [ ] Sandbox testing completed
- [ ] App builds successfully

---

## 🎯 Next Steps

Once setup is complete:

1. Test the paywall: Navigate to Settings → Upgrade to Premium
2. Verify premium features unlock after purchase
3. Test restore purchases functionality
4. Monitor analytics in RevenueCat dashboard

---

## 📚 Resources

- [RevenueCat Documentation](https://docs.revenuecat.com)
- [App Store Connect Help](https://developer.apple.com/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [React Native Purchases SDK](https://docs.revenuecat.com/docs/reactnative)

---

## 🆘 Troubleshooting

### "No offerings available"
- Ensure products are created in both App Store Connect/Google Play Console AND RevenueCat
- Check that offerings are configured in RevenueCat dashboard
- Verify API keys are correct in `.env` file

### "Purchase failed"
- For iOS: Ensure you're signed in with a sandbox tester account
- For Android: Ensure you're added as a license tester
- Check RevenueCat dashboard for error logs

### "Entitlement not unlocking"
- Verify the entitlement identifier is `premium` (lowercase)
- Check RevenueCat dashboard → Customer → Entitlements
- Ensure products are attached to the entitlement

---

## 💰 Pricing Recommendations

Based on app store best practices:

- **Monthly**: $4.99 - $9.99
- **Annual**: $39.99 - $79.99 (save 30-40%)
- **Lifetime**: $99.99 - $149.99 (optional)

Consider offering a **free trial** (7 days) to increase conversions.
