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
 * Waits 24 hours and then sends a follow-up push notification.
 */
export const sendMatchFollowUp = onDocumentCreated('matches/{matchId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.log('No data associated with the event');
    return;
  }

  const matchData = snapshot.data();
  const { coupleId, itemName } = matchData;

  // In a real-world scenario, you would use Cloud Tasks to schedule this.
  logger.log(`Match created for ${itemName}. In a real app, a follow-up would be scheduled for 24 hours from now.`);

  try {
    const coupleRef = db.collection('couples').doc(coupleId);
    const coupleSnap = await coupleRef.get();

    if (!coupleSnap.exists) {
      logger.log('Couple not found:', coupleId);
      return;
    }

    const coupleData = coupleSnap.data();
    if (!coupleData) {
      logger.log('Couple data is empty.');
      return;
    }

    const userIds = coupleData.userIds;
    if (!userIds || userIds.length === 0) {
      logger.log('No user IDs found for this couple.');
      return;
    }

    for (const userId of userIds) {
      const userRef = db.collection('users').doc(userId);
      const userSnap = await userRef.get();

      if (userSnap.exists) {
        const userData = userSnap.data();
        if (!userData) continue;

        const pushTokens = userData.pushTokens;
        if (pushTokens && Array.isArray(pushTokens)) {
          for (const token of pushTokens) {
            await sendPushNotification(
              token,
              'How was your date night? 🍽️',
              `Did you end up getting ${itemName} yesterday?`
            );
          }
        }
      }
    }
  } catch (error) {
    logger.error('Error fetching user data or sending notifications:', error);
  }
});
