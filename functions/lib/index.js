"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharePremiumWithPartner = exports.sendMatchFollowUp = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = __importStar(require("firebase-admin"));
const logger = __importStar(require("firebase-functions/logger"));
admin.initializeApp();
const db = admin.firestore();
/**
 * Sends a push notification to a user.
 */
async function sendPushNotification(pushToken, title, body) {
    const message = {
        to: pushToken,
        sound: 'default',
        title: title,
        body: body,
        data: { someData: 'goes here' }, // Optional data payload
    };
    try {
        // Expo's push notification service requires a POST request to their endpoint.
        // This uses fetch, which is available in modern Node.js environments.
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        const data = await response.json();
        console.log('Push notification sent:', data);
    }
    catch (error) {
        console.error('Error sending push notification:', error);
    }
}
/**
 * Cloud Function that triggers when a new match is created.
 * Sends IMMEDIATE notification to both partners, then schedules 24-hour follow-up.
 */
exports.sendMatchFollowUp = (0, firestore_1.onDocumentCreated)('matches/{matchId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        logger.log('No data associated with the event');
        return;
    }
    const matchData = snapshot.data();
    const { coupleId, itemName } = matchData;
    logger.log(`Match created for ${itemName} by couple ${coupleId}`);
    try {
        // The coupleId is formatted as "userId1_userId2" (sorted alphabetically)
        // Extract both user IDs from the coupleId
        const userIds = coupleId.split('_');
        if (!userIds || userIds.length < 2) {
            logger.log('Invalid coupleId format:', coupleId);
            return;
        }
        // Send immediate notification to BOTH partners
        for (const userId of userIds) {
            // Skip if this looks like a test partner
            if (userId === 'TEST_PARTNER')
                continue;
            const userRef = db.collection('users').doc(userId);
            const userSnap = await userRef.get();
            if (userSnap.exists) {
                const userData = userSnap.data();
                if (!userData)
                    continue;
                const pushTokens = userData.pushTokens;
                if (pushTokens && Array.isArray(pushTokens)) {
                    for (const token of pushTokens) {
                        // Send immediate match notification
                        await sendPushNotification(token, "It's a Match! 🎉", `You both want ${itemName}! Time to eat! 🍽️`);
                        logger.log(`Sent match notification to user ${userId}`);
                    }
                }
                else {
                    logger.log(`No push tokens for user ${userId}`);
                }
            }
            else {
                logger.log(`User not found: ${userId}`);
            }
        }
        // TODO: In production, schedule a 24-hour follow-up using Cloud Tasks
        // For now, just log that we would schedule it
        logger.log(`Would schedule 24-hour follow-up for ${itemName}`);
    }
    catch (error) {
        logger.error('Error sending match notifications:', error);
    }
});
/**
 * PREMIUM SHARING TRIGGER - BULLETPROOF VERSION
 *
 * Handles ALL premium sharing scenarios on the SERVER side.
 * This function triggers on ANY update to a user document.
 *
 * SCENARIOS COVERED:
 *
 * SHARING PREMIUM TO PARTNER:
 * 1. User becomes premium (false→true) and has partner → share to partner
 * 2. Premium user connects to new partner → share to new partner
 * 3. Premium user changes partner (A→B) → revoke from A, share to B
 *
 * RECEIVING PREMIUM FROM PARTNER:
 * 4. Non-premium user connects to premium partner → receive from partner
 * 5. User changes partner to premium partner → receive from new partner
 *
 * REVOKING SHARED PREMIUM:
 * 6. User loses premium (true→false) → revoke from partner if they had shared
 * 7. Users disconnect → revoke shared premium from BOTH directions
 * 8. User changes partner → revoke from old partner
 *
 * EDGE CASES:
 * 9. Both users connect simultaneously → handled (both triggers run, no conflict)
 * 10. User buys own premium while having shared → clear premiumSharedBy
 * 11. Partner already has own premium → don't overwrite
 * 12. Restore purchase when already premium → no change needed
 */
exports.sharePremiumWithPartner = (0, firestore_1.onDocumentUpdated)('users/{userId}', async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();
    const userId = event.params.userId;
    if (!beforeData || !afterData) {
        logger.log('sharePremiumWithPartner: No data in event');
        return;
    }
    // Normalize all values to handle undefined/null/false consistently
    const wasPremium = beforeData.isPremium === true;
    const isNowPremium = afterData.isPremium === true;
    const isNowLifetime = afterData.isLifetime === true;
    const hadPartner = beforeData.partnerId || null;
    const hasPartner = afterData.partnerId || null;
    const hadSharedFrom = beforeData.premiumSharedBy || null;
    const hasSharedFrom = afterData.premiumSharedBy || null;
    const premiumChanged = wasPremium !== isNowPremium;
    const partnerChanged = hadPartner !== hasPartner;
    const gainedPartner = !hadPartner && hasPartner;
    const lostPartner = hadPartner && !hasPartner;
    const switchedPartner = hadPartner && hasPartner && hadPartner !== hasPartner;
    logger.log(`[${userId}] Update detected:`, {
        wasPremium, isNowPremium, premiumChanged,
        hadPartner, hasPartner, partnerChanged,
        hadSharedFrom, hasSharedFrom,
        gainedPartner, lostPartner, switchedPartner
    });
    // ============================================
    // EDGE CASE: User bought own premium while having shared premium
    // Clear the premiumSharedBy since they now have their own
    // ============================================
    if (isNowPremium && !wasPremium && hadSharedFrom) {
        logger.log(`[${userId}] User bought own premium, clearing premiumSharedBy`);
        try {
            const userRef = db.collection('users').doc(userId);
            await userRef.update({
                premiumSharedBy: null,
                premiumSharedAt: null,
            });
        }
        catch (error) {
            logger.error(`[${userId}] Failed to clear premiumSharedBy:`, error);
        }
        // Continue to share with partner if they have one
    }
    // ============================================
    // SCENARIO: User LOSES premium (true → false)
    // Revoke from partner if they had shared premium from this user
    // ============================================
    if (wasPremium && !isNowPremium) {
        logger.log(`[${userId}] Lost premium`);
        if (hasPartner) {
            try {
                const partnerRef = db.collection('users').doc(hasPartner);
                const partnerSnap = await partnerRef.get();
                const partnerData = partnerSnap.data();
                if (partnerData?.premiumSharedBy === userId) {
                    await partnerRef.update({
                        isPremium: false,
                        isLifetime: false,
                        premiumSharedBy: null,
                        premiumSharedAt: null,
                    });
                    logger.log(`[${userId}] Revoked shared premium from partner ${hasPartner}`);
                    // Notify partner
                    await notifyUser(partnerData, 'Premium Ended', 'Your shared premium access has ended.');
                }
            }
            catch (error) {
                logger.error(`[${userId}] Failed to revoke from partner:`, error);
            }
        }
        return; // Don't process further
    }
    // ============================================
    // SCENARIO: Users DISCONNECT (had partner → no partner)
    // Revoke shared premium in BOTH directions
    // ============================================
    if (lostPartner) {
        logger.log(`[${userId}] Disconnected from partner ${hadPartner}`);
        try {
            const exPartnerRef = db.collection('users').doc(hadPartner);
            const exPartnerSnap = await exPartnerRef.get();
            const exPartnerData = exPartnerSnap.data();
            // If I shared premium TO ex-partner, revoke it
            if (exPartnerData?.premiumSharedBy === userId) {
                await exPartnerRef.update({
                    isPremium: false,
                    isLifetime: false,
                    premiumSharedBy: null,
                    premiumSharedAt: null,
                });
                logger.log(`[${userId}] Revoked premium I shared to ex-partner ${hadPartner}`);
                await notifyUser(exPartnerData, 'Premium Ended', 'Your shared premium access has ended.');
            }
            // If I received premium FROM ex-partner, revoke mine
            if (hadSharedFrom === hadPartner) {
                const userRef = db.collection('users').doc(userId);
                await userRef.update({
                    isPremium: false,
                    isLifetime: false,
                    premiumSharedBy: null,
                    premiumSharedAt: null,
                });
                logger.log(`[${userId}] Revoked premium I received from ex-partner ${hadPartner}`);
            }
        }
        catch (error) {
            logger.error(`[${userId}] Failed to handle disconnect:`, error);
        }
        return; // Don't process further
    }
    // ============================================
    // SCENARIO: User SWITCHED partners (A → B)
    // Revoke from old partner, then share to new partner
    // ============================================
    if (switchedPartner) {
        logger.log(`[${userId}] Switched partner from ${hadPartner} to ${hasPartner}`);
        try {
            // Revoke from old partner if I shared to them
            const exPartnerRef = db.collection('users').doc(hadPartner);
            const exPartnerSnap = await exPartnerRef.get();
            const exPartnerData = exPartnerSnap.data();
            if (exPartnerData?.premiumSharedBy === userId) {
                await exPartnerRef.update({
                    isPremium: false,
                    isLifetime: false,
                    premiumSharedBy: null,
                    premiumSharedAt: null,
                });
                logger.log(`[${userId}] Revoked from old partner ${hadPartner}`);
                await notifyUser(exPartnerData, 'Premium Ended', 'Your shared premium access has ended.');
            }
            // Revoke my premium if I received from old partner
            if (hadSharedFrom === hadPartner) {
                const userRef = db.collection('users').doc(userId);
                await userRef.update({
                    isPremium: false,
                    isLifetime: false,
                    premiumSharedBy: null,
                    premiumSharedAt: null,
                });
                logger.log(`[${userId}] Revoked premium I received from old partner`);
                // Note: Will check if new partner is premium below
            }
        }
        catch (error) {
            logger.error(`[${userId}] Failed to revoke from old partner:`, error);
        }
        // Fall through to share/receive with new partner
    }
    // ============================================
    // SCENARIO: SHARE premium TO new/current partner
    // Triggers when: user is premium AND (gained partner OR switched partner OR just became premium)
    // ============================================
    if (isNowPremium && hasPartner && (gainedPartner || switchedPartner || (!wasPremium && isNowPremium))) {
        logger.log(`[${userId}] Attempting to share premium to partner ${hasPartner}`);
        try {
            const partnerRef = db.collection('users').doc(hasPartner);
            const partnerSnap = await partnerRef.get();
            if (!partnerSnap.exists) {
                logger.log(`[${userId}] Partner ${hasPartner} not found`);
                return;
            }
            const partnerData = partnerSnap.data();
            // Don't overwrite if partner has their OWN premium (premiumSharedBy is null/undefined)
            if (partnerData?.isPremium === true && !partnerData?.premiumSharedBy) {
                logger.log(`[${userId}] Partner ${hasPartner} already has their own premium, not overwriting`);
                return;
            }
            // Share premium to partner
            await partnerRef.update({
                isPremium: true,
                isLifetime: isNowLifetime,
                premiumSharedBy: userId,
                premiumSharedAt: new Date().toISOString(),
            });
            logger.log(`[${userId}] SUCCESS: Shared premium to partner ${hasPartner}`);
            await notifyUser(partnerData, '🎉 Premium Activated!', 'Your partner shared their premium membership with you!');
        }
        catch (error) {
            logger.error(`[${userId}] Failed to share premium to partner:`, error);
        }
        return;
    }
    // ============================================
    // SCENARIO: RECEIVE premium FROM new partner
    // Triggers when: user is NOT premium AND gained/switched partner
    // ============================================
    if (!isNowPremium && hasPartner && (gainedPartner || switchedPartner)) {
        logger.log(`[${userId}] Checking if new partner ${hasPartner} has premium to share`);
        try {
            const partnerRef = db.collection('users').doc(hasPartner);
            const partnerSnap = await partnerRef.get();
            const partnerData = partnerSnap.data();
            if (partnerData?.isPremium === true) {
                // Partner is premium - receive it
                const userRef = db.collection('users').doc(userId);
                await userRef.update({
                    isPremium: true,
                    isLifetime: partnerData.isLifetime === true,
                    premiumSharedBy: hasPartner,
                    premiumSharedAt: new Date().toISOString(),
                });
                logger.log(`[${userId}] SUCCESS: Received premium from partner ${hasPartner}`);
                await notifyUser(afterData, '🎉 Premium Activated!', 'Your partner shared their premium membership with you!');
            }
            else {
                logger.log(`[${userId}] Partner ${hasPartner} is not premium, nothing to receive`);
            }
        }
        catch (error) {
            logger.error(`[${userId}] Failed to receive premium from partner:`, error);
        }
    }
});
/**
 * Helper function to send push notification to a user
 */
async function notifyUser(userData, title, body) {
    if (!userData)
        return;
    const pushTokens = userData.pushTokens;
    if (pushTokens && Array.isArray(pushTokens)) {
        for (const token of pushTokens) {
            await sendPushNotification(token, title, body);
        }
    }
}
//# sourceMappingURL=index.js.map