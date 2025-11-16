import { Text, View, TouchableOpacity, TextInput, Share, StyleSheet } from 'react-native';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { doc, writeBatch, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  error: string;
  border: string;
};

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
  },
  tilesContainer: {
    gap: 16,
  },
  testButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tile: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tileIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  tileSubtitle: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 12,
  },
  inviteCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    letterSpacing: 3,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    backgroundColor: colors.background,
    color: colors.text,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    textAlign: 'center',
  },
  connectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectedText: {
    fontSize: 18,
    color: colors.muted,
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});

const NotConnectedView = () => {
  const theme = useTheme();
  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);
  const { user } = useAuth();
  const { userData } = useUser();
  const router = useRouter();
  const [partnerCode, setPartnerCode] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleShare = async () => {
    if (!user) return;
    try {
      await Share.share({
        message: `Join me on jOY! My invite code is: ${user.uid.substring(0, 8).toUpperCase()}`,
      });
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  const handleConnect = async () => {
    if (!user || !partnerCode || connecting) return;

    setConnecting(true);
    setError('');

    try {
      // Verify partner exists
      const partnerRef = doc(db, 'users', partnerCode);
      const partnerSnap = await getDoc(partnerRef);

      if (!partnerSnap.exists()) {
        setError('Partner code not found. Please check and try again.');
        setConnecting(false);
        return;
      }

      const partnerData = partnerSnap.data();

      // Check if partner is already connected to someone else
      if (partnerData.coupleId && partnerData.coupleId !== '') {
        setError('This partner is already connected to someone else.');
        setConnecting(false);
        return;
      }

      // Create couple ID (sorted to ensure consistency)
      const coupleId = [user.uid, partnerCode].sort().join('_');
      const batch = writeBatch(db);

      // Update current user
      const userRef = doc(db, 'users', user.uid);
      batch.update(userRef, {
        coupleId,
        partnerId: partnerCode,
        partnerName: partnerData.name || 'Partner',
        connectedAt: serverTimestamp(),
      });

      // Update partner
      batch.update(partnerRef, {
        coupleId,
        partnerId: user.uid,
        partnerName: userData?.name || 'Partner',
        connectedAt: serverTimestamp(),
        // Share premium membership if current user has it
        isPremium: userData?.isPremium || partnerData.isPremium || false,
        trialEndDate: userData?.trialEndDate || partnerData.trialEndDate || null,
      });

      // Also update current user with shared premium status
      batch.update(userRef, {
        isPremium: userData?.isPremium || partnerData.isPremium || false,
        trialEndDate: userData?.trialEndDate || partnerData.trialEndDate || null,
      });

      await batch.commit();

      // Navigate to connection success flow
      router.push('/connection-success' as any);
    } catch (error: any) {
      console.error('Failed to connect with partner:', error);
      setError('Connection failed. Please try again.');
      setConnecting(false);
    }
  };

  // Test mode - simulate partner connection without real partner
  const handleTestConnection = async () => {
    if (!user || connecting) return;

    setConnecting(true);
    setError('');

    try {
      const userRef = doc(db, 'users', user.uid);
      const batch = writeBatch(db);
      
      // Create a fake couple ID for testing
      const testCoupleId = `${user.uid}_TEST_PARTNER`;
      
      batch.update(userRef, {
        coupleId: testCoupleId,
        partnerId: 'TEST_PARTNER',
        partnerName: 'Test Partner',
        connectedAt: serverTimestamp(),
      });

      await batch.commit();

      // Navigate to connection success flow
      router.push('/connection-success' as any);
    } catch (error: any) {
      console.error('Failed to test connection:', error);
      setError('Test connection failed.');
      setConnecting(false);
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1 }}>
      {/* Test Connection Button - Remove in production */}
      <TouchableOpacity 
        style={styles.testButton} 
        onPress={handleTestConnection}
        disabled={connecting}
      >
        <Text style={styles.testButtonText}>TEST CONNECTION</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Animated.Text 
          style={styles.title}
          entering={FadeInDown.duration(800).delay(200)}
        >
          Make it Official
        </Animated.Text>
        <Animated.Text 
          style={styles.subtitle}
          entering={FadeInDown.duration(800).delay(300)}
        >
          Connect with your partner to start matching
        </Animated.Text>
      </View>

      <Animated.View 
        style={styles.tilesContainer}
        entering={FadeInDown.duration(800).delay(700)}
      >
        {/* Invite Tile - First */}
        <View style={styles.tile}>
          <Text style={styles.tileIcon}>💌</Text>
          <Text style={styles.tileTitle}>Invite Your Partner</Text>
          <Text style={styles.tileSubtitle}>Share your unique code</Text>
          <Text style={styles.inviteCode}>{user?.uid.substring(0, 8).toUpperCase()}</Text>
          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>Share Invite Code</Text>
          </TouchableOpacity>
        </View>

        {/* Connect Tile - Second */}
        <View style={styles.tile}>
          <Text style={styles.tileIcon}>🔗</Text>
          <Text style={styles.tileTitle}>Connect with Code</Text>
          <Text style={styles.tileSubtitle}>Enter your partner's code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter code"
            placeholderTextColor={colors.muted}
            value={partnerCode}
            onChangeText={(text) => {
              setPartnerCode(text.toUpperCase());
              setError('');
            }}
            autoCapitalize="characters"
            maxLength={8}
            editable={!connecting}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity 
            style={[styles.button, (!partnerCode || connecting) && { opacity: 0.5 }]} 
            onPress={handleConnect}
            disabled={!partnerCode || connecting}
          >
            <Text style={styles.buttonText}>
              {connecting ? 'Connecting...' : 'Connect Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const ConnectedView = ({ partnerName }: { partnerName: string }) => {
  const theme = useTheme();
  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <Animated.View 
      style={styles.connectedContainer}
      entering={FadeIn.duration(300)}
    >
      <Text style={styles.title}>You're Connected!</Text>
      <Text style={styles.connectedText}>You are connected with {partnerName}.</Text>
    </Animated.View>
  );
};

export default function ConnectScreen() {
  const { userData } = useUser();
  const theme = useTheme();
  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {userData?.coupleId ? (
        <ConnectedView partnerName={userData.partnerName || 'your partner'} />
      ) : (
        <NotConnectedView />
      )}
    </View>
  );
}
