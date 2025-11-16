# jOY App Development Roadmap

## Project Overview
Building "Dinner Date Without Debate" - a mobile app that helps couples decide what to eat using swipeable cards, shared preferences, and gamification.

## Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Backend**: Firebase (Auth + Firestore)
- **Styling**: React Native StyleSheet (migrating from styled-components for stability)
- **Animations**: React Native Reanimated & Gesture Handler

---

## Phase 1: Foundation & Core Setup ✅ (IN PROGRESS)

### 1.1 Project Setup ✅
- [x] Initialize Expo project
- [x] Install dependencies
- [x] Configure TypeScript
- [x] Set up Firebase configuration
- [x] Enable Anonymous Authentication in Firebase

### 1.2 Theme & Styling 🔄
- [x] Create color palettes (light/dark)
- [x] Set up theme provider
- [ ] **TODO**: Migrate all styled-components to StyleSheet for web compatibility
- [ ] **TODO**: Test theme switching

### 1.3 Navigation Structure 🔄
- [x] Root layout with auth routing
- [x] Auth group (login)
- [x] Onboarding group
- [x] Main tabs group
- [ ] **TODO**: Fix navigation infinite loop issue
- [ ] **TODO**: Test all navigation flows

### 1.4 Authentication 🔄
- [x] Firebase initialization
- [x] Anonymous sign-in implementation
- [x] Auth context provider
- [ ] **TODO**: Test auth state persistence
- [ ] **TODO**: Handle auth errors gracefully

---

## Phase 2: Onboarding Flow (CURRENT PRIORITY)

### 2.1 Onboarding Screens
- [x] Welcome screen
- [x] Name & Avatar selection
- [x] Vibe selection
- [x] Cuisine preferences (swipe cards)
- [x] Progress/loading screen
- [x] Congratulations screen
- [x] Paywall/trial screen

### 2.2 Onboarding State Management
- [x] Create useOnboarding hook
- [x] OnboardingProvider setup
- [ ] **TODO**: Test state persistence across screens
- [ ] **TODO**: Handle back navigation properly

### 2.3 Firestore Integration
- [ ] **TODO**: Create user document on completion
- [ ] **TODO**: Save onboarding preferences
- [ ] **TODO**: Set trial period
- [ ] **TODO**: Test data persistence

---

## Phase 3: Main App Features

### 3.1 Play Screen
- [x] XP Bar component
- [x] Swipe deck component
- [x] Food items data structure
- [ ] **TODO**: Implement vote recording
- [ ] **TODO**: Match detection logic
- [ ] **TODO**: Match celebration screen
- [ ] **TODO**: Test swipe gestures on web

### 3.2 Surprise Me Feature
- [x] Service logic created
- [x] Bottom sheet component
- [ ] **TODO**: Integrate with user preferences
- [ ] **TODO**: Test suggestion algorithm
- [ ] **TODO**: Handle edge cases (no preferences)

### 3.3 Cookbook Screen
- [x] Basic screen structure
- [x] Premium gating
- [ ] **TODO**: Display saved matches
- [ ] **TODO**: Filter/search functionality
- [ ] **TODO**: Recipe details view

### 3.4 Connect Screen
- [x] Basic UI
- [x] Invite code generation
- [ ] **TODO**: Partner linking logic
- [ ] **TODO**: Test invite flow
- [ ] **TODO**: Handle already connected state

### 3.5 Settings Screen
- [x] Theme toggle
- [ ] **TODO**: Account management
- [ ] **TODO**: Notification preferences
- [ ] **TODO**: Privacy settings
- [ ] **TODO**: Logout functionality

---

## Phase 4: Gamification

### 4.1 XP System
- [x] XP bar UI
- [ ] **TODO**: Award XP for swipes
- [ ] **TODO**: Award XP for matches
- [ ] **TODO**: Level progression logic
- [ ] **TODO**: Level-up celebrations

### 4.2 Streaks
- [ ] **TODO**: Track daily usage
- [ ] **TODO**: Streak counter UI
- [ ] **TODO**: Streak rewards
- [ ] **TODO**: Streak recovery (hints)

### 4.3 Hints System
- [ ] **TODO**: Hint earning logic
- [ ] **TODO**: Hint usage UI
- [ ] **TODO**: Reveal partner preferences
- [ ] **TODO**: Test hint mechanics

---

## Phase 5: Premium Features

### 5.1 Trial System
- [x] Trial period setup (7 days)
- [x] Premium status hook
- [ ] **TODO**: Trial expiration handling
- [ ] **TODO**: Trial countdown UI

### 5.2 Paywall
- [x] Paywall component
- [ ] **TODO**: Integrate payment provider (RevenueCat/Stripe)
- [ ] **TODO**: Subscription tiers
- [ ] **TODO**: Purchase flow
- [ ] **TODO**: Restore purchases

### 5.3 Premium-Gated Features
- [x] Cookbook access gating
- [ ] **TODO**: Unlimited hints for premium
- [ ] **TODO**: Advanced filters
- [ ] **TODO**: Custom food items

---

## Phase 6: Polish & Testing

### 6.1 UI/UX Polish
- [ ] **TODO**: Consistent spacing and typography
- [ ] **TODO**: Loading states for all async operations
- [ ] **TODO**: Error states and messages
- [ ] **TODO**: Empty states
- [ ] **TODO**: Animations and transitions

### 6.2 Testing
- [ ] **TODO**: Test on iOS simulator
- [ ] **TODO**: Test on Android emulator
- [ ] **TODO**: Test on physical devices
- [ ] **TODO**: Test all user flows end-to-end
- [ ] **TODO**: Test edge cases

### 6.3 Performance
- [ ] **TODO**: Optimize re-renders
- [ ] **TODO**: Image optimization
- [ ] **TODO**: Lazy loading
- [ ] **TODO**: Bundle size optimization

---

## Phase 7: Production Preparation

### 7.1 Firebase Setup
- [ ] **TODO**: Set up production Firebase project
- [ ] **TODO**: Configure security rules
- [ ] **TODO**: Set up indexes
- [ ] **TODO**: Enable analytics

### 7.2 App Store Preparation
- [ ] **TODO**: App icons (all sizes)
- [ ] **TODO**: Splash screens
- [ ] **TODO**: Screenshots
- [ ] **TODO**: App description
- [ ] **TODO**: Privacy policy
- [ ] **TODO**: Terms of service

### 7.3 Deployment
- [ ] **TODO**: iOS App Store submission
- [ ] **TODO**: Google Play Store submission
- [ ] **TODO**: Set up app monitoring
- [ ] **TODO**: Set up crash reporting

---

## Current Blockers & Issues

### Critical Issues
1. **Navigation infinite loop** - Fixed in latest commit, needs testing
2. **Styled-components compatibility with web** - Migrating to StyleSheet

### Known Issues
1. React Native version mismatch warning (0.82.1 vs 0.81.5) - Non-critical
2. Web accessibility warnings (aria-hidden) - Non-critical
3. Need to test all screens on web platform

---

## Next Steps (Immediate)

1. **Test navigation fix** - Restart app and verify no infinite loops
2. **Complete onboarding flow** - Test all screens work properly
3. **Migrate styled-components** - Convert remaining screens to StyleSheet
4. **Test Firestore integration** - Verify user data is saved correctly
5. **Create comprehensive test plan** - Document all user flows to test

---

## Development Guidelines

### Code Standards
- Use TypeScript strictly (no `any` types)
- Follow React hooks best practices
- Keep components small and focused
- Use meaningful variable names
- Comment complex logic

### Git Workflow
- Commit after each working feature
- Use descriptive commit messages
- Test before committing

### Testing Checklist
- [ ] Test on web browser
- [ ] Test on iOS simulator (when Xcode installed)
- [ ] Test with Firebase in production mode
- [ ] Test all user flows
- [ ] Test error scenarios

---

## Resources & Documentation

### Firebase
- Project: `joy-windsurf-4979a`
- Console: https://console.firebase.google.com

### Key Files
- Firebase config: `src/lib/firebase.ts`
- Root navigation: `app/_layout.tsx`
- Theme: `src/theme/`
- Hooks: `src/hooks/`
- Components: `src/components/`

### Dependencies
- Expo SDK: ~54.0.23
- React: 19.1.0
- React Native: 0.82.1
- Firebase: 12.6.0
- Expo Router: ~6.0.14
