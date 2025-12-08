import { Text, View, TouchableOpacity, TextInput, Share, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { doc, writeBatch, serverTimestamp, collection, query, where, getDocs, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface MatchItem {
  id: string;
  itemName: string;
  timestamp: Date;
}

// Generate a unique 6-character invite code
const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like 0, O, 1, I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

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
  },
  connectedHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  partnerEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  partnerText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  premiumBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  premiumBadgeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  matchHistoryList: {
    flex: 1,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  matchEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 13,
    color: colors.muted,
  },
  matchBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  matchBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  lockedOverlay: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    marginTop: 20,
  },
  lockEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  lockedText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  const { userData, loading: userLoading } = useUser();
  const router = useRouter();
  const [partnerCode, setPartnerCode] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [myInviteCode, setMyInviteCode] = useState<string>('');
  const [codeChecked, setCodeChecked] = useState(false);

  // Ensure user has an invite code - only run after userData has loaded
  useEffect(() => {
    const ensureInviteCode = async () => {
      // Wait for user data to load before checking/generating code
      if (!user || userLoading) return;
      
      // If user already has an invite code in their data, use it
      if (userData?.inviteCode) {
        setMyInviteCode(userData.inviteCode);
        setCodeChecked(true);
        return;
      }

      // Only generate a new code if we've confirmed userData loaded and has no code
      if (codeChecked) return; // Prevent multiple generations
      setCodeChecked(true);

      // Generate and save a new invite code
      try {
        const newCode = generateInviteCode();
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { inviteCode: newCode });
        setMyInviteCode(newCode);
        console.log('Generated new invite code:', newCode);
      } catch (error) {
        console.error('Failed to generate invite code:', error);
        // Fallback to UID-based code if we can't save
        setMyInviteCode(user.uid.substring(0, 6).toUpperCase());
      }
    };

    ensureInviteCode();
  }, [user, userData?.inviteCode, userLoading, codeChecked]);

  const handleShare = async () => {
    if (!myInviteCode) return;
    try {
      await Share.share({
        message: `Join me on Dinner Without Debate! My invite code is: ${myInviteCode}`,
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
      // Query for user with this invite code
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('inviteCode', '==', partnerCode.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Partner code not found. Please check and try again.');
        setConnecting(false);
        return;
      }

      // Get the partner's document
      const partnerDoc = querySnapshot.docs[0];
      const partnerId = partnerDoc.id;
      const partnerData = partnerDoc.data();

      // Can't connect to yourself
      if (partnerId === user.uid) {
        setError("You can't connect with yourself!");
        setConnecting(false);
        return;
      }

      // Check if partner is already connected to someone else
      if (partnerData.coupleId && partnerData.coupleId !== '') {
        setError('This partner is already connected to someone else.');
        setConnecting(false);
        return;
      }

      // Create couple ID (sorted to ensure consistency)
      const coupleId = [user.uid, partnerId].sort().join('_');
      const batch = writeBatch(db);

      // Update current user
      const userRef = doc(db, 'users', user.uid);
      batch.update(userRef, {
        coupleId,
        partnerId: partnerId,
        partnerName: partnerData.name || 'Partner',
        connectedAt: serverTimestamp(),
      });

      // Update partner
      const partnerRef = doc(db, 'users', partnerId);
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


  return (
    <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1 }}>
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
          <Text style={styles.inviteCode}>{myInviteCode || '...'}</Text>
          <TouchableOpacity style={styles.button} onPress={handleShare} disabled={!myInviteCode}>
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
            maxLength={6}
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

const ConnectedView = ({ partnerName, coupleId }: { partnerName: string; coupleId: string }) => {
  const { hasFullAccess, isOnTrial, trialDaysLeft, isPremium } = usePremiumStatus();
  const theme = useTheme();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  // Fetch recent matches for this couple
  useEffect(() => {
    const fetchMatches = async () => {
      if (!coupleId) return;
      
      try {
        const matchesRef = collection(db, 'matches');
        const q = query(
          matchesRef,
          where('coupleId', '==', coupleId),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const matchList: MatchItem[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          matchList.push({
            id: doc.id,
            itemName: data.itemName,
            timestamp: data.timestamp?.toDate() || new Date(),
          });
        });
        
        setMatches(matchList);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [coupleId]);

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleUpgrade = () => {
    router.push('/paywall' as any);
  };

  return (
    <Animated.View 
      style={styles.connectedContainer}
      entering={FadeIn.duration(300)}
    >
      {/* Header with partner info */}
      <View style={styles.connectedHeader}>
        <View style={styles.partnerBadge}>
          <Text style={styles.partnerEmoji}>💑</Text>
          <Text style={styles.partnerText}>Connected with {partnerName}</Text>
        </View>
        <Text style={styles.sectionTitle}>Match History</Text>
        <Text style={styles.sectionSubtitle}>Your last 10 dinner decisions</Text>
        {isOnTrial && (
          <View style={[styles.premiumBadge, { backgroundColor: '#4F46E5' }]}>
            <Text style={styles.premiumBadgeText}>⏳ {trialDaysLeft} days left in trial</Text>
          </View>
        )}
        {isPremium && !isOnTrial && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>👑 Premium</Text>
          </View>
        )}
      </View>

      {/* Premium Gate or Match List */}
      {!hasFullAccess ? (
        <View style={styles.lockedOverlay}>
          <Text style={styles.lockEmoji}>🔒</Text>
          <Text style={styles.lockedTitle}>Unlock Match History</Text>
          <Text style={styles.lockedText}>
            See your last 10 dinner matches and never forget what you both loved!
            {'\n\n'}
            Upgrade to Premium to access this feature.
          </Text>
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Loading matches...</Text>
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyTitle}>No matches yet!</Text>
          <Text style={styles.emptyText}>
            Start swiping together to find{'\n'}your perfect dinner matches.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.matchHistoryList} showsVerticalScrollIndicator={false}>
          {matches.map((match, index) => (
            <Animated.View 
              key={match.id}
              style={styles.matchItem}
              entering={FadeInDown.duration(400).delay(index * 100)}
            >
              <Text style={styles.matchEmoji}>✨</Text>
              <View style={styles.matchInfo}>
                <Text style={styles.matchName}>{match.itemName}</Text>
                <Text style={styles.matchDate}>{formatDate(match.timestamp)}</Text>
              </View>
              <View style={styles.matchBadge}>
                <Text style={styles.matchBadgeText}>Matched!</Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
};

export default function ConnectScreen() {
  const { userData } = useUser();
  const theme = useTheme();
  
  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  // Partner connection detection is now handled at the root layout level
  // (PartnerConnectionDetector in _layout.tsx) so it works from ANY screen

  return (
    <View style={styles.container}>
      {userData?.coupleId ? (
        <ConnectedView 
          partnerName={userData.partnerName || 'your partner'} 
          coupleId={userData.coupleId}
        />
      ) : (
        <NotConnectedView />
      )}
    </View>
  );
}
