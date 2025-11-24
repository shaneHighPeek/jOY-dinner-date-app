import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  /**
   * Requests permissions and gets the push token.
   * Saves the token to the user's Firestore document.
   */
  async registerForPushNotificationsAsync(userId: string): Promise<void> {
    if (!Device.isDevice) {
      console.log('Push notifications are not available on simulators.');
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      // Get the token that uniquely identifies this device
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'YOUR_PROJECT_ID', // TODO: Replace with your EAS project ID
      })).data;

      // Save the token to the user's document
      if (token) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          pushTokens: arrayUnion(token),
        });
        console.log('Push token saved successfully:', token);
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  },
};
