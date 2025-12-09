# Premium Sharing - Complete Coverage Matrix

**Last Updated:** December 9, 2025  
**Implementation:** Firebase Cloud Function (`sharePremiumWithPartner`)  
**Location:** `/functions/index.ts`

---

## Overview

Premium sharing is handled **entirely server-side** via a Firebase Cloud Function that triggers on any update to a user document in Firestore. This ensures reliability regardless of client-side state or network issues.

---

## How It Works

When any field in a user's Firestore document changes, the Cloud Function:
1. Compares before/after states
2. Detects relevant changes (premium status, partner connection)
3. Automatically shares, receives, or revokes premium as needed
4. Sends push notifications to affected users

---

## Coverage Matrix

### Premium Sharing (TO partner)

| # | Scenario | Action | Status |
|---|----------|--------|--------|
| 1 | User becomes premium, already has partner | Share premium to partner | ✅ Covered |
| 2 | Premium user connects to new partner | Share premium to new partner | ✅ Covered |
| 3 | Premium user switches from partner A to B | Revoke from A, share to B | ✅ Covered |

### Premium Receiving (FROM partner)

| # | Scenario | Action | Status |
|---|----------|--------|--------|
| 4 | Non-premium user connects to premium partner | Receive premium from partner | ✅ Covered |
| 5 | User switches from partner A to premium partner B | Revoke from A, receive from B | ✅ Covered |

### Premium Revoking

| # | Scenario | Action | Status |
|---|----------|--------|--------|
| 6 | User loses premium (subscription ends/cancelled) | Revoke from partner if they had shared | ✅ Covered |
| 7 | Users disconnect from each other | Revoke shared premium in BOTH directions | ✅ Covered |
| 8 | User switches to different partner | Revoke from old partner | ✅ Covered |

### Edge Cases

| # | Scenario | Action | Status |
|---|----------|--------|--------|
| 9 | Both users connect simultaneously | Both triggers run safely, no conflict | ✅ Covered |
| 10 | User buys own premium while having shared premium | Clear `premiumSharedBy`, keep premium | ✅ Covered |
| 11 | Partner already has their own premium | Don't overwrite their premium | ✅ Covered |
| 12 | Restore purchase when already premium | No duplicate action needed | ✅ Covered |
| 13 | Undefined/null/false field values | All normalized consistently | ✅ Covered |

---

## Firestore Fields Used

| Field | Type | Description |
|-------|------|-------------|
| `isPremium` | boolean | Whether user has premium access |
| `isLifetime` | boolean | Whether premium is lifetime (vs subscription) |
| `partnerId` | string \| null | UID of connected partner |
| `premiumSharedBy` | string \| null | UID of user who shared premium (null = own premium) |
| `premiumSharedAt` | string \| null | ISO timestamp of when premium was shared |

---

## Push Notifications

| Event | Title | Message |
|-------|-------|---------|
| Premium shared to user | 🎉 Premium Activated! | Your partner shared their premium membership with you! |
| Premium revoked from user | Premium Ended | Your shared premium access has ended. |

---

## Testing Scenarios

To test any scenario, edit user documents directly in Firebase Console:

### Test: Share premium to partner
1. Ensure User A has `partnerId` pointing to User B
2. Change User A's `isPremium` from `false` to `true`
3. Verify User B's `isPremium` becomes `true` and `premiumSharedBy` = User A's UID

### Test: Receive premium from partner
1. Ensure User B has `isPremium: true`
2. Update User A's `partnerId` to User B's UID (simulating connection)
3. Verify User A's `isPremium` becomes `true` and `premiumSharedBy` = User B's UID

### Test: Revoke on disconnect
1. Ensure User A shared premium to User B (`premiumSharedBy` = User A)
2. Remove User A's `partnerId` (set to null)
3. Verify User B's `isPremium` becomes `false` and `premiumSharedBy` cleared

---

## Logs

View Cloud Function logs in Firebase Console:
- Go to: Firebase Console → Functions → Logs
- Filter by: `sharePremiumWithPartner`
- All actions are logged with `[userId]` prefix for easy debugging

---

## Client-Side Code

The client-side premium sharing code in `PremiumContext.tsx` is kept as a backup but is **not required**. The Cloud Function handles everything. The client code may be removed in a future cleanup.
