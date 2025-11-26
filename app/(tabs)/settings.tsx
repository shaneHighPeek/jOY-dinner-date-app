import { Text, View, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { XPBar } from '@/components/play/XPBar';
import { doc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

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
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingText: {
    fontSize: 18,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 32,
    marginBottom: 12,
  },
  partnerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  partnerAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  partnerStatus: {
    fontSize: 14,
    color: colors.muted,
  },
  removeButton: {
    backgroundColor: colors.error + '20',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },
  removeButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  notConnectedText: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default function SettingsScreen() {
  const theme = useTheme();
  const { userData } = useUser();
  const { user } = useAuth();
  const [removing, setRemoving] = useState(false);
  
  if (!theme || !userData) return null;
  const { colors, isDarkMode, toggleTheme } = theme;
  const styles = createStyles(colors);

  const handleRemovePartner = () => {
    if (!user || !userData.partnerId) return;

    Alert.alert(
      'Remove Partner',
      `Are you sure you want to disconnect from ${userData.partnerName || 'your partner'}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setRemoving(true);
            try {
              // Clear connection data from current user
              const userRef = doc(db, 'users', user.uid);
              await updateDoc(userRef, {
                coupleId: deleteField(),
                partnerId: deleteField(),
                partnerName: deleteField(),
                connectedAt: deleteField(),
              });

              // Clear connection data from partner
              const partnerRef = doc(db, 'users', userData.partnerId);
              await updateDoc(partnerRef, {
                coupleId: deleteField(),
                partnerId: deleteField(),
                partnerName: deleteField(),
                connectedAt: deleteField(),
              });

              Alert.alert('Disconnected', 'You have been disconnected from your partner.');
            } catch (error) {
              console.error('Failed to remove partner:', error);
              Alert.alert('Error', 'Failed to remove partner. Please try again.');
            } finally {
              setRemoving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <Text style={styles.title}>Settings</Text>
      <XPBar xp={userData.xp || 0} isPremium={userData.isPremium === true} />
      
      {/* Appearance Section */}
      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.muted, true: colors.primary }}
          thumbColor={isDarkMode ? colors.accent : colors.card}
          ios_backgroundColor={colors.border}
        />
      </View>

      {/* Partner Section */}
      <Text style={styles.sectionTitle}>Partner</Text>
      <View style={styles.partnerCard}>
        {userData.coupleId ? (
          <>
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerAvatar}>💑</Text>
              <View>
                <Text style={styles.partnerName}>{userData.partnerName || 'Partner'}</Text>
                <Text style={styles.partnerStatus}>Connected</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemovePartner}
              disabled={removing}
            >
              <Text style={styles.removeButtonText}>
                {removing ? 'Removing...' : 'Remove Partner'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.notConnectedText}>
            Not connected to a partner yet.{'\n'}Go to the Connect tab to link up!
          </Text>
        )}
      </View>
    </Animated.View>
  );
}
