# jOY App Development Roadmap

## Project Overview
Building "Dinner Date Without Debate" - a mobile app that helps couples decide what to eat using swipeable cards, shared preferences, and gamification.

**Last Updated**: November 26, 2025

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

### 4.4 Push Notification System ✅
- [x] Expo Notifications integration
- [x] Permission request in connection success flow
- [x] Push token registration to Firestore
- [x] Firebase Cloud Function for post-match follow-ups
- [x] 24-hour delayed notification: "Did you go?"
- [x] Deployed to Firebase (us-central1)
- [x] Container cleanup policy configured (7-day retention)

---

## Phase 5: Gamification ✅ COMPLETED

This is a major feature that drives engagement and retention. The gamification system includes levels, hints, and streaks that reward users for consistent app usage and create a compelling progression loop.

### 5.1 Level System ✅
**Foundation (Completed):**
- [x] XP bar UI with level display
- [x] Award XP for swipes (10 XP per swipe)
- [x] Award XP for matches
- [x] XP stored in Firestore

**Phase 1: Level Progression (Completed)**
- [x] Create level calculation function with 20+ levels
- [x] Define XP requirements per level
- [x] Add level titles ("Foodie Newbie", "Taste Explorer", "Flavor Hunter", etc.)
- [x] Implement level-up detection logic
- [x] Build level-up celebration screen with confetti
- [x] Award 1 hint per level-up
- [x] Update XP bar to show "Level X → Level Y" progress
- [x] Display level title in profile/settings

### 5.2 Hint System ✅
**Foundation (Completed):**
- [x] Hint counter display in UI
- [x] Initial hint awarded on onboarding completion
- [x] Hints stored in Firestore

**Phase 2: Hint Usage (Completed)**
- [x] Create hint usage modal/screen
- [x] Build "Reveal Partner's Top Cuisine" feature (1 hint)
- [x] Build "Show Partner's Recent Likes" feature (2 hints)
- [x] Add confirmation dialog before spending hints
- [x] Implement hint deduction in Firestore
- [x] Create partner preference reveal UI with empty states
- [x] Add visual feedback when hint is used
- [x] Premium users get unlimited hints (no cost display)

**Hint Earning Methods:**
- [x] Complete onboarding → 1 hint
- [x] Level up → 1 hint per level
- [x] Daily streak milestones → 1-5 hints
- [x] Premium subscription → Unlimited hints

### 5.3 Streak System ✅
**Phase 3: Streak Tracking (Completed)**
- [x] Add streak fields to Firestore user schema
- [x] Track last active date
- [x] Calculate streak on app open
- [x] Create streak counter UI component
- [x] Award hints for milestones (3, 7, 14, 30 days)
- [x] Add streak celebration for milestones
- [x] Display longest streak in profile

**Streak Rewards:**
- 3 days → 1 hint
- 7 days → 2 hints
- 14 days → 3 hints
- 30 days → 5 hints

### 5.4 Premium Integration ✅
**Phase 4: Premium Gamification (Completed)**
- [x] Unlimited hints for premium users
- [x] Hide hint costs in UI for premium
- [x] Premium badge display (👑)
- [x] Exclusive level titles for premium (Level 10+)
- [x] 2x XP multiplier for premium users

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

## Phase 10: Solo Mode Features ✅ COMPLETED

This phase addresses the pre-connection experience, providing value to users before they have a partner.

### 10.1 Solo Hub ✅
- [x] Modified Play tab to detect partner status
- [x] Conditional rendering: Solo Hub vs. Partner Play
- [x] Two-tile layout for solo options
- [x] Clean, modern UI with gradients

### 10.2 Date Night Planner ✅
- [x] Activity input field
- [x] Date/time picker
- [x] Notes section
- [x] Share functionality with invite link
- [x] "Plan Your Date" screen at `/solo/date-planner`

### 10.3 The Dinner Companion ✅
- [x] Guided mindfulness experience
- [x] Gratitude prompts
- [x] Mindful moment timer (60 seconds)
- [x] Reflection points
- [x] Solo version of dinner experience
- [x] Screen at `/solo/dinner-companion`

### 10.4 UI Simplification ✅
- [x] Moved Level display from swipe screen to Settings
- [x] Moved Streak badge from swipe screen to Vibe screen
- [x] Cleaner, less cluttered swipe interface

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

## Phase 11: Future Enhancements & Technical Debt

This section tracks important tasks that are not part of the core feature roadmap but are crucial for long-term stability, quality, and data-driven improvements.

### 11.1 Success Metric Tracking
- [ ] **Implement "Did you go?" response tracking**: When a user taps the 24-hour follow-up notification, present a simple UI to confirm if the date happened. Store responses in Firestore to track real-world success rates. This provides valuable data on how many matches lead to actual dates.

### 11.2 Code Quality & Testing
- [ ] **Write Unit Tests**: Set up Jest for React Native. Write tests for core utility functions (e.g., `levelService`, `streakService`, `surpriseMeService`). Ensures core logic is reliable and prevents regressions.
- [ ] **Write Integration Tests**: Set up a testing framework like Detox for end-to-end (E2E) testing. Create tests for critical user flows like onboarding, authentication, and partner connection. Guarantees that major features work together as expected.

### 11.3 Performance Optimization
- [ ] **Profile and Optimize Swipe Screen**: Use React DevTools Profiler or Flipper to identify performance bottlenecks on the `play-swipe` screen. Analyze re-renders, component complexity, and memory usage. Implement optimizations like memoization (`React.memo`), `useCallback`, and virtualized lists if needed.

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
17. **Push Notification System** - Post-match follow-up notifications to reduce silent churn
18. **Solo Mode** - Date Night Planner and Dinner Companion for users without partners
19. **Complete Gamification System** - Levels, hints, streaks with premium integration

###  In Progress
1. ~~**Unit Tests**~~ ✅ - Jest configured, 26 tests passing for level system (Step 1 of 3)
2. ~~**Payment integration**~~ ✅ - RevenueCat SDK integrated with paywall UI (Step 2 of 3)
3. **Success Tracking** - "Did you go?" response system (Step 3 of 3)

###  Current Development Plan (Pre-Design Handoff)
**Goal:** Complete all critical coding tasks before designer returns with final UI assets.

**Step 1: Unit Tests (Foundation)** 🧪 ✅ COMPLETE
- ✅ Set up Jest for React Native with ts-jest
- ✅ Write tests for `levelSystem.ts` (26 tests passing)
- ✅ Ensure core gamification logic is bulletproof
- **Status:** COMPLETE

**Step 2: RevenueCat Integration (Monetization)** 💰 ✅ COMPLETE
- ✅ Install and configure RevenueCat SDK
- ✅ Create RevenueCat service with all purchase methods
- ✅ Build PremiumContext for app-wide premium state
- ✅ Create paywall screen with subscription offerings
- ✅ Add environment variables for API keys
- ✅ Create comprehensive setup guide (REVENUECAT_SETUP.md)
- **Status:** COMPLETE (requires App Store/Play Store configuration)

**Step 3: Success Tracking (Data)** 📈
- Update Cloud Function to include matchId in notifications
- Build "Did you go?" prompt UI
- Save responses to Firestore
- Track real-world date success rates
- **Status:** PENDING

###  Next Priorities (After Design Handoff)
1. **UI Polish** - Integrate new icons, splash screens, and screenshots from designer
2. **Conduct thorough testing** on physical devices
3. **Prepare all assets for app store submission** (descriptions, privacy policy, terms)
4. **Add Smart Search** to cookbook for finding recipes by title/ingredients/tags

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

## 🔴 CRITICAL BUGS & FIXES (TestFlight Build 22+)

These issues were discovered during real-world testing on November 26, 2025 and need to be addressed before App Store release.

### BUG-001: Partner Connection Not Working ✅ FIXED (Build 22)
**Problem:** Partner codes weren't connecting users. The code used UID substring as invite code but looked up by document ID.
**Root Cause:** 
1. Firestore rules only allowed users to write their own document
2. Invite code generation had race condition causing new codes on each mount
**Fix Applied:**
- Updated Firestore rules to allow partner connection updates
- Added `inviteCode` field stored in Firestore
- Query by `inviteCode` field instead of document ID
- Added loading state check before generating codes

### BUG-002: Remove Partner Feature Missing 🔴 TODO
**Problem:** No way for users to disconnect from a partner (breakups happen).
**Location:** Settings screen
**Requirements:**
- [ ] Add "Remove Partner" button in Settings (only visible when connected)
- [ ] Confirmation dialog: "Are you sure? This will disconnect you from [Partner Name]"
- [ ] Clear `coupleId`, `partnerId`, `partnerName`, `connectedAt` from BOTH users
- [ ] Reset UI to show "Not Connected" state
- [ ] Consider: Should match history be preserved or cleared?

### BUG-003: Partners See Different Food Lists 🔴 TODO  
**Problem:** Two connected partners see completely different randomized food lists, making matches unlikely (50+ swipes before a match).
**Root Cause:** Each user gets an independently shuffled deck.
**Proposed Solutions:**
1. **Shared Seed Approach**: Use `coupleId` as random seed so both partners get same shuffle order
2. **Daily Deck Approach**: Generate a "deck of the day" for each couple, stored in Firestore
3. **Priority Queue**: Show foods that partner has already liked first (increases match probability)
4. **Hybrid**: Combine approaches - shared base order + prioritize partner's likes
**Requirements:**
- [ ] Design and implement shared deck system
- [ ] Ensure both partners see foods in similar order
- [ ] Prioritize showing foods partner has already liked (if any)
- [ ] Test match rate improvement

### BUG-004: Uber Eats Button Not Working 🔴 TODO
**Problem:** "Order In" / Uber Eats button on match screen doesn't work.
**Location:** `app/match.tsx`
**Requirements:**
- [ ] Debug deep link URL for Uber Eats
- [ ] Test on physical iOS device (deep links don't work in simulator)
- [ ] Add fallback to open Uber Eats in App Store if not installed
- [ ] Consider adding DoorDash as alternative option

### BUG-005: Match Notification Only Sent to One Partner 🔴 TODO
**Problem:** When a match occurs, only the user who made the matching swipe gets notified. Partner doesn't know about the match.
**Root Cause:** Match detection happens client-side, notification only sent locally.
**Proposed Solution:**
1. **Cloud Function Trigger**: When a match document is created in Firestore, trigger a Cloud Function
2. **Notify Both Partners**: Cloud Function sends push notification to BOTH users in the couple
3. **Handle App States**: Notification should work whether app is open, backgrounded, or closed
**Requirements:**
- [ ] Create Firestore trigger on `matches` collection
- [ ] Look up both partner's push tokens from `users` collection
- [ ] Send push notification to both partners
- [ ] Include match details (food name) in notification
- [ ] Handle case where one partner has app open (don't double-notify)

### BUG-006: Invite Code Regenerating on Each Visit 🔴 TODO (Partial Fix)
**Problem:** Invite code changes every time user visits Connect screen.
**Status:** Partial fix in Build 22 (added loading check), but may need further testing.
**Requirements:**
- [ ] Verify fix works in Build 23+
- [ ] Ensure code persists across app restarts
- [ ] Add visual indicator when code is loading vs. ready

---

## Next Steps (Immediate Priority)

### 🔴 Critical (Must Fix Before App Store)
1. **BUG-003: Shared Food Deck** - Partners must see same foods to match reasonably
2. **BUG-005: Match Notifications for Both Partners** - Both users need to know about matches
3. **BUG-002: Remove Partner Feature** - Essential for real-world usage
4. **BUG-004: Fix Uber Eats Deep Link** - Core feature not working

### 🟡 Important (Should Fix)
5. **BUG-006: Verify Invite Code Fix** - Confirm codes persist properly
6. **Restore RevenueCat** - Re-enable payment system (see RESTORATION_GUIDE.md)

### 🟢 Nice to Have
7. **Add Smart Search** - Cookbook search by title, ingredients, or tags
8. **Prepare App Store Assets** - Icons, screenshots, marketing materials

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
- **TEST MATCH** - On play-swipe screen
- **TEST REVIEW** - On match screen
- **TEST CONNECTION** - On connect screen
- **+100 XP** - On play-swipe screen (tests level-ups)
- **ADD PARTNER** - On play-swipe screen (tests hint system)
- **+1 DAY STREAK** - On play-swipe screen (tests streak milestones)
- **ENABLE PREMIUM** - On play-swipe screen (tests premium features)
