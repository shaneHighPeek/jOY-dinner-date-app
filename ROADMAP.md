# jOY App Development Roadmap

## Project Overview
Building "Dinner Date Without Debate" - a mobile app that helps couples decide what to eat using swipeable cards, shared preferences, and gamification.

**Last Updated**: November 24, 2025

## Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (File-based routing)
- **Backend**: Firebase (Auth + Firestore)
- **Styling**: React Native StyleSheet
- **Animations**: React Native Reanimated & Gesture Handler
- **State Management**: React Context + Custom Hooks

---

## Phase 1: Foundation & Core Setup ✅ COMPLETED

### 1.1 Project Setup ✅
- [x] Initialize Expo project
- [x] Install dependencies
- [x] Configure TypeScript
- [x] Set up Firebase configuration
- [x] Enable Anonymous Authentication in Firebase

### 1.2 Theme & Styling ✅
- [x] Create color palettes (light/dark)
- [x] Set up theme provider
- [x] All components using StyleSheet
- [x] Theme switching tested and working

### 1.3 Navigation Structure ✅
- [x] Root layout with auth routing
- [x] Auth group (login)
- [x] Onboarding group
- [x] Main tabs group
- [x] File-based routing with Expo Router
- [x] Navigation flows tested

### 1.4 Authentication ✅
- [x] Firebase initialization
- [x] Anonymous sign-in implementation
- [x] Auth context provider
- [x] Auth state persistence
- [x] Error handling implemented

---

## Phase 2: Onboarding Flow ✅ COMPLETED

### 2.1 Onboarding Screens ✅
- [x] Welcome screen with subtitle "Let's end the dinner debate forever"
- [x] Name & Avatar selection with progress bar
- [x] Vibe selection (6 tiles in 2x3 grid)
- [x] Cuisine preferences (swipeable cards with like/dislike buttons)
- [x] Progress/loading screen with animations
- [x] Congratulations screen with confetti and hint reward
- [x] Paywall/trial screen with yearly and monthly plans
- [x] All screens with smooth animations and transitions

### 2.2 Onboarding State Management ✅
- [x] Create useOnboarding hook
- [x] OnboardingProvider setup
- [x] State persistence across screens
- [x] Navigation flow completed
- [x] SwipeableCard component with programmatic swipe

### 2.3 Firestore Integration ✅
- [x] Create user document on completion
- [x] Save onboarding preferences (name, avatar, vibe, cuisines)
- [x] Set trial period and premium status
- [x] Data persistence tested and working
- [x] Award initial hint on completion

---

## Phase 3: Main App Features ✅ COMPLETED

### 3.1 Play Screen ✅
- [x] Redesigned play flow with vibe selection at start
- [x] Play-vibe screen with "Start Swiping" and "Surprise Me" buttons
- [x] Play-swipe screen with swipeable food cards
- [x] Bottom action buttons (like/dislike)
- [x] Level badge and hints display in top corners
- [x] XP Bar component with level progression
- [x] Food items data structure (300+ items)
- [x] Vote recording to Firestore
- [x] Match detection logic
- [x] Swipe counter for partner prompt
- [x] TEST MATCH button for testing

### 3.2 Match Screen ✅
- [x] Match celebration screen with confetti animation
- [x] Random funny phrases on match
- [x] "Find Nearby" button with Maps deep linking
- [x] "Order In" button with Uber Eats deep linking
- [x] "Keep Swiping" button to continue
- [x] Match count tracking
- [x] Review prompt trigger after 3 matches
- [x] TEST REVIEW button for testing

### 3.3 Surprise Me Feature ✅
- [x] Service logic with preference matching
- [x] Play-surprise screen with suggestion display
- [x] "Accept & Match" button
- [x] "Spin Again" button for new suggestion
- [x] Integration with user and partner preferences
- [x] XP award on acceptance
- [x] Firebase permissions fixed

### 3.4 Cookbook Screen ✅
- [x] Basic screen structure
- [x] Premium gating implemented
- [x] Placeholder for saved matches
- [x] Clean UI design

### 3.5 Connect Screen ✅
- [x] Two-tile layout (Invite + Connect)
- [x] Invite code generation (8-character UID)
- [x] Share functionality for invite codes
- [x] Partner code input with validation
- [x] Partner linking logic with database sync
- [x] Shared premium membership between partners
- [x] Persistent couple ID and partner tracking
- [x] Error handling and loading states
- [x] Connected state view
- [x] TEST CONNECTION button for testing
- [x] Mobile-optimized layout

### 3.6 Settings Screen ✅
- [x] Theme toggle (light/dark mode)
- [x] Basic settings structure
- [x] Clean UI design

---

## Phase 4: Partner Connection & Social Features ✅ COMPLETED

### 4.1 Partner Connection Flow ✅
- [x] Partner prompt after 3 swipes (if not connected)
- [x] "Teamwork Makes the Dream Work" interstitial screen
- [x] Imagery to encourage connection
- [x] Skip or connect options

### 4.2 Connection Success Flow ✅
- [x] Three-screen success flow with progress bar
- [x] Screen 1: "Thank you for trusting us!" with privacy message
- [x] Screen 2: Notification permission request
- [x] Screen 3: Relationship statistics and empowering messages
- [x] Science-backed confidence building
- [x] "Small habits make big harmony" messaging

### 4.3 Review/Testimonial System ✅
- [x] Trigger after 3 successful matches
- [x] 4.8 star rating display with laurels
- [x] 200K+ app ratings social proof
- [x] Real profile photos (3 overlapping circles)
- [x] 5M+ users statistic
- [x] 2 authentic testimonials with photos
- [x] Jake Sullivan & Benny Marcs testimonials
- [x] Mobile-optimized layout (no scrolling needed)
- [x] Buyer's remorse reduction through social proof

---

## Phase 5: Gamification 🚀 NEXT PRIORITY

This is a major feature that drives engagement and retention. The gamification system includes levels, hints, and streaks that reward users for consistent app usage and create a compelling progression loop.

### 5.1 Level System 🔄 IN PROGRESS
**Foundation (Completed):**
- [x] XP bar UI with level display
- [x] Award XP for swipes (10 XP per swipe)
- [x] Award XP for matches
- [x] XP stored in Firestore

**Phase 1: Level Progression (2-3 hours)**
- [ ] Create level calculation function with 20+ levels
- [ ] Define XP requirements per level (100, 250, 500, 1000, etc.)
- [ ] Add level titles ("Foodie Newbie", "Taste Explorer", "Flavor Hunter", etc.)
- [ ] Implement level-up detection logic
- [ ] Build level-up celebration screen with confetti
- [ ] Award 1 hint per level-up
- [ ] Update XP bar to show "Level X → Level Y" progress
- [ ] Display level title in profile/settings

**Level Structure:**
```
Level 1: 0 XP - "Foodie Newbie"
Level 2: 100 XP - "Taste Explorer"
Level 3: 250 XP - "Flavor Hunter"
Level 4: 500 XP - "Culinary Adventurer"
Level 5: 1000 XP - "Master Chef"
... up to Level 20+
```

### 5.2 Hint System 🔄 IN PROGRESS
**Foundation (Completed):**
- [x] Hint counter display in UI
- [x] Initial hint awarded on onboarding completion
- [x] Hints stored in Firestore

**Phase 2: Hint Usage (3-4 hours)**
- [ ] Create hint usage modal/screen
- [ ] Build "Reveal Partner's Top Cuisine" feature (1 hint)
- [ ] Build "Show Partner's Recent Likes" feature (2 hints)
- [ ] Add confirmation dialog before spending hints
- [ ] Implement hint deduction in Firestore
- [ ] Create partner preference reveal UI
- [ ] Add visual feedback when hint is used
- [ ] Premium users get unlimited hints (no cost display)

**Hint Earning Methods:**
- [x] Complete onboarding → 1 hint
- [ ] Level up → 1 hint per level
- [ ] Daily streak (7 days) → 2 hints
- [ ] First match → 1 hint
- [ ] Premium subscription → Unlimited hints
- [ ] In-app purchase → Buy hint packs (future)

**Hint Usage Options:**
1. **Reveal Partner's Top Cuisine** (1 hint) - Shows their #1 favorite
2. **Show Partner's Recent Likes** (2 hints) - Shows last 5 liked items
3. **Unlock "Surprise Me"** (Free for premium, 1 hint for free users)
4. **Skip Partner Prompt** (1 hint) - Continue solo play

### 5.3 Streak System 🔄 IN PROGRESS
**Phase 3: Streak Tracking (2-3 hours)**
- [ ] Add streak fields to Firestore user schema
- [ ] Track last active date
- [ ] Calculate streak on app open
- [ ] Create streak counter UI component
- [ ] Award hints for milestones (3, 7, 14, 30 days)
- [ ] Build streak recovery option (spend 2 hints to restore)
- [ ] Add streak celebration for milestones
- [ ] Display longest streak in profile

**Firestore Schema:**
```typescript
users/{userId} {
  currentStreak: number,
  longestStreak: number,
  lastActiveDate: string,
  streakRewards: {
    "3day": boolean,
    "7day": boolean,
    "14day": boolean,
    "30day": boolean
  }
}
```

**Streak Rewards:**
- 3 days → 1 hint
- 7 days → 2 hints
- 14 days → 3 hints
- 30 days → 5 hints

### 5.4 Premium Integration 🔄 IN PROGRESS
**Phase 4: Premium Gamification (1-2 hours)**
- [ ] Unlimited hints for premium users
- [ ] Hide hint costs in UI for premium
- [ ] Premium badge display
- [ ] Exclusive level titles for premium (Level 10+)
- [ ] 2x XP multiplier for premium users (optional)

---

## Phase 6: The Cookbook (Core Premium Feature) 🚀

This phase represents a strategic pivot to build the app's killer premium feature: a personal cookbook with a powerful web importer. This system allows users to save recipes from anywhere on the web and add them to the "Dinner Without Debate" game, creating a strong retention loop and fulfilling the promise of choosing home-cooked meals.

### 6.1 Cookbook Foundation ✅ COMPLETED
- [x] Basic Cookbook screen structure with premium gating.
- [x] Dynamic Recipe Detail Page with modern design.
- [x] Recipe schema defined in Firestore (title, imageUrl, ingredients, instructions, sourceUrl, tags, etc.).
- [x] Recipe service created for CRUD operations on recipes.
- [x] RecipeCard component for displaying saved recipes.

### 6.2 The Web Importer (The "Magic" Feature) ✅ COMPLETED
- [x] Recipe parser service built that accepts a URL and extracts structured recipe data.
- [x] Import screen created at `/cookbook/import` with URL input.
- [x] Supported recipe sites displayed (AllRecipes, Food Network, Bon Appetit, etc.).
- [x] Recipe data parsing and saving to Firestore.
- [ ] **TODO**: Implement native "Share to jOY" functionality on iOS and Android (future enhancement).

### 6.3 The Cookbook Experience (The "Habit" Feature) ✅ COMPLETED
- [x] Cookbook screen displays user's saved recipes in a grid layout.
- [x] RecipeCard component shows recipe image, title, and tags.
- [x] Navigation to recipe detail page on card press.
- [x] Import button navigates to import screen.
- [ ] **TODO**: Implement "Smart Search" to allow users to search their cookbook by title, ingredients, or tags.
- [ ] **TODO**: Allow users to manually add and edit their own personal recipes (future enhancement).

### 6.4 Game Integration (The Value Prop) ✅ COMPLETED
- [x] Created `mealService.ts` to merge default foods with user's cookbook recipes.
- [x] Updated play-swipe screen to use `getUserMeals()` function.
- [x] User-added recipes now appear as swipeable cards in the game deck.
- [x] Recipes are shuffled together with default 97 food items.
- [x] Infinite loop maintained with recipe integration.

---

## Phase 7: Premium Features (Monetization) 🔄 IN PROGRESS

### 6.1 Trial System ✅
- [x] Trial period setup (7 days)
- [x] Premium status hook
- [x] Shared premium between partners
- [ ] **TODO**: Trial expiration handling
- [ ] **TODO**: Trial countdown UI

### 6.2 Paywall ✅
- [x] Paywall component with modern design
- [x] Yearly and monthly subscription tiers
- [x] Feature list display
- [x] Navigation after selection
- [ ] **TODO**: Integrate payment provider (RevenueCat/Stripe)
- [ ] **TODO**: Actual purchase flow
- [ ] **TODO**: Restore purchases

### 6.3 Premium-Gated Features ✅
- [x] Cookbook access gating
- [ ] **TODO**: Unlimited hints for premium
- [ ] **TODO**: Advanced filters
- [ ] **TODO**: Custom food items

---

## Phase 8: Polish & Testing 🔄 IN PROGRESS

### 7.1 UI/UX Polish ✅
- [x] Consistent spacing and typography across all screens
- [x] Loading states for all async operations
- [x] Error states and messages
- [x] Empty states where needed
- [x] Smooth animations and transitions throughout
- [x] Mobile-optimized layouts
- [x] Dark mode support

### 7.2 Testing 🔄
- [x] Test all user flows end-to-end
- [x] Test onboarding flow completely
- [x] Test play flow with all features
- [x] Test partner connection flow
- [x] Test match and review flows
- [ ] **TODO**: Test on iOS simulator
- [ ] **TODO**: Test on Android emulator
- [ ] **TODO**: Test on physical devices
- [ ] **TODO**: Test edge cases thoroughly

### 7.3 Performance
- [ ] **TODO**: Optimize re-renders
- [ ] **TODO**: Image optimization
- [ ] **TODO**: Lazy loading
- [ ] **TODO**: Bundle size optimization

---

## Phase 9: Production Preparation

### 8.1 Firebase Setup 🔄
- [x] Firebase project created (joy-windsurf-4979a)
- [x] Anonymous authentication enabled
- [x] Firestore database configured
- [x] Security rules updated for users, votes, matches, couples
- [ ] **TODO**: Set up production Firebase project (separate from dev)
- [ ] **TODO**: Set up indexes for queries
- [ ] **TODO**: Enable analytics

### 8.2 App Store Preparation
- [ ] **TODO**: App icons (all sizes)
- [ ] **TODO**: Splash screens
- [ ] **TODO**: Screenshots for both stores
- [ ] **TODO**: App description and marketing copy
- [ ] **TODO**: Privacy policy
- [ ] **TODO**: Terms of service

### 8.3 Deployment
- [ ] **TODO**: iOS App Store submission
- [ ] **TODO**: Google Play Store submission
- [ ] **TODO**: Set up app monitoring (Sentry/Firebase)
- [ ] **TODO**: Set up crash reporting

---

## Current Status & Progress

###  Completed Features
1. **Complete onboarding flow** with all screens and animations
2. **Full play experience** with vibe selection, swiping, and matching
3. **Partner connection system** with database sync and shared premium
4. **Match celebration** with confetti, deep linking, and actions
5. **Review/testimonial system** with social proof after 3 matches
6. **Connection success flow** with empowering messages
7. **Surprise Me feature** with preference-based suggestions
8. **XP and hints system** with Firestore integration
9. **Theme system** with light/dark mode
10. **Firebase integration** with proper security rules
11. **Recipe Detail Page** with modern image header design
12. **The Cookbook with Web Importer** - Full recipe import and management system
13. **97 Verified Food Images** - High-quality, curated food photography
14. **Game Integration with User Recipes** - Custom recipes appear in swipe deck
15. **Flawless Onboarding** - Image preloading for instant first impression
16. **Infinite Randomized Swiping** - Endless, shuffled food cards

###  In Progress
1. **Payment integration** for premium subscriptions (RevenueCat/Stripe)
2. **Testing on multiple platforms** (iOS simulator, Android emulator, physical devices)

###  Next Priorities
1. **Integrate a payment provider** (e.g., RevenueCat) to monetize the Cookbook feature.
2. **Finalize Gamification** (Level progression, Hint usage) as a secondary priority.
3. **Conduct thorough testing** on physical devices.
4. **Prepare all assets for app store submission** (icons, screenshots, descriptions).
5. **Add Smart Search** to cookbook for finding recipes by title/ingredients/tags.

---

## Known Issues & Solutions

### Resolved Issues 
1. ~~Navigation infinite loop~~ - Fixed with proper auth routing
2. ~~Styled-components compatibility~~ - Migrated to StyleSheet
3. ~~Paywall spinning forever~~ - Fixed with proper navigation
4. ~~Cuisine buttons not working~~ - Fixed card targeting
5. ~~Vibe screen layout~~ - Fixed to 2x3 grid
6. ~~Firebase permissions error~~ - Fixed security rules
7. ~~Review screen not triggering~~ - Fixed match count tracking

### Current Issues
1. Web accessibility warnings (aria-hidden) - Non-critical, React Native default behavior
2. Need comprehensive testing on physical devices

---

## Next Steps (Immediate)

1. **Integrate Payment Provider**: Set up RevenueCat or Stripe for premium subscriptions.
2. **Test on Physical Devices**: Comprehensive testing on iOS and Android devices.
3. **Add Smart Search**: Implement cookbook search by title, ingredients, or tags.
4. **Prepare App Store Assets**: Create icons, screenshots, and marketing materials.
5. **Finalize Gamification**: Complete level progression and hint usage UI.

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

### Key Files & Structure

**Core Configuration:**
- Firebase config: `src/lib/firebase.ts`
- Root navigation: `app/_layout.tsx`
- Theme provider: `src/theme/ThemeProvider.tsx`

**Hooks:**
- `src/hooks/useAuth.tsx` - Authentication state
- `src/hooks/useUser.tsx` - User data from Firestore
- `src/hooks/useOnboarding.tsx` - Onboarding state management

**Components:**
- `src/components/onboarding/SwipeableCard.tsx` - Swipeable card with gestures
- `src/components/play/SwipeDeck.tsx` - Food swiping deck
- `src/components/play/XPBar.tsx` - Experience bar

**Screens:**
- `app/welcome.tsx` - Welcome screen
- `app/onboarding/` - All onboarding screens
- `app/(tabs)/` - Main app tabs (play, cookbook, connect, settings)
- `app/play-vibe.tsx` - Vibe selection screen
- `app/(tabs)/play-swipe.tsx` - Swipe screen
- `app/play-surprise.tsx` - Surprise me screen
- `app/match.tsx` - Match celebration screen
- `app/partner-prompt.tsx` - Partner connection prompt
- `app/connection-success.tsx` - Connection success flow
- `app/review-prompt.tsx` - Review/testimonial screen
- `app/recipe/[id].tsx` - Recipe detail screen

**Data:**
- `src/data/` - Food items data (300+ items split across files)
- `src/services/surpriseMeService.ts` - Surprise me logic

### Dependencies
- Expo SDK: ~54.0.23
- React: 19.1.0
- React Native: 0.82.1
- Firebase: 12.6.0
- Expo Router: ~6.0.14
- React Native Reanimated: ~4.0.0
- React Native Gesture Handler: ~2.22.1
- React Native Confetti Cannon: ^1.5.2

### Test Buttons (Remove Before Production)
- **TEST MATCH** - On play-swipe screen (top-right)
- **TEST REVIEW** - On match screen (top-right)
- **TEST CONNECTION** - On connect screen (top-right)
