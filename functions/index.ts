import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';

admin.initializeApp();

const db = admin.firestore();

/**
 * Sends a push notification to a user.
 */
async function sendPushNotification(pushToken: string, title: string, body: string) {
  const message = {
    to: pushToken,
    sound: 'default' as const,
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
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

/**
 * Cloud Function that triggers when a new match is created.
 * Sends IMMEDIATE notification to both partners, then schedules 24-hour follow-up.
 */
export const sendMatchFollowUp = onDocumentCreated('matches/{matchId}', async (event) => {
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
      if (userId === 'TEST_PARTNER') continue;
      
      const userRef = db.collection('users').doc(userId);
      const userSnap = await userRef.get();

      if (userSnap.exists) {
        const userData = userSnap.data();
        if (!userData) continue;

        const pushTokens = userData.pushTokens;
        if (pushTokens && Array.isArray(pushTokens)) {
          for (const token of pushTokens) {
            // Send immediate match notification
            await sendPushNotification(
              token,
              "It's a Match! 🎉",
              `You both want ${itemName}! Time to eat! 🍽️`
            );
            logger.log(`Sent match notification to user ${userId}`);
          }
        } else {
          logger.log(`No push tokens for user ${userId}`);
        }
      } else {
        logger.log(`User not found: ${userId}`);
      }
    }

    // TODO: In production, schedule a 24-hour follow-up using Cloud Tasks
    // For now, just log that we would schedule it
    logger.log(`Would schedule 24-hour follow-up for ${itemName}`);

  } catch (error) {
    logger.error('Error sending match notifications:', error);
  }
});
