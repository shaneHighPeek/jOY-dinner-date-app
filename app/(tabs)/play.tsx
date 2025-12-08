import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

// Local icon images
const icons = {
  connect: require('../../assets/images/Connect.png'),
  planner: require('../../assets/images/Planner.png'),
  companion: require('../../assets/images/Companion.png'),
  swipe: require('../../assets/images/Swip.png'),
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

const createStyles = (colors: Colors, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDarkMode ? colors.accent : colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  hubContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  hubButton: {
    backgroundColor: colors.card,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.15 : 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  hubButtonIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 40,
  },
  hubButtonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  hubButtonSubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default function PlayScreen() {
  const { userData, loading } = useUser();
  const router = useRouter();
  const theme = useTheme();

  if (!theme) throw new Error('PlayScreen must be used within a ThemeProvider');
  const { colors, isDarkMode } = theme;
  const styles = createStyles(colors, isDarkMode);

  if (loading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const hasPartner = !!userData.coupleId;

  return (
    <Animated.View style={styles.hubContainer} entering={FadeIn.duration(300)}>
      <Text style={styles.title}>{hasPartner ? 'Ready to Play?' : 'Solo Mode'}</Text>
      <Text style={styles.subtitle}>
        {hasPartner ? "Let's find your next great meal together." : 'Connect with your partner or explore solo features.'}
      </Text>

      {/* Start Swiping - only show if partnered */}
      {hasPartner && (
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <TouchableOpacity style={styles.hubButton} onPress={() => router.push('/play-vibe' as any)}>
            <Image source={icons.swipe} style={styles.hubButtonIcon} resizeMode="contain" />
            <Text style={styles.hubButtonTitle}>Start Swiping</Text>
            <Text style={styles.hubButtonSubtitle}>Begin a new session with your partner</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Connect with Partner - only show if solo */}
      {!hasPartner && (
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <TouchableOpacity style={styles.hubButton} onPress={() => router.push('/(tabs)/connect' as any)}>
            <Image source={icons.connect} style={styles.hubButtonIcon} resizeMode="contain" />
            <Text style={styles.hubButtonTitle}>Connect with Partner</Text>
            <Text style={styles.hubButtonSubtitle}>Link up and start swiping together</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Date Night Planner - always show */}
      <Animated.View entering={FadeInDown.duration(400).delay(hasPartner ? 200 : 200)}>
        <TouchableOpacity style={styles.hubButton} onPress={() => router.push('/solo/date-planner' as any)}>
          <Image source={icons.planner} style={styles.hubButtonIcon} resizeMode="contain" />
          <Text style={styles.hubButtonTitle}>Date Night Planner</Text>
          <Text style={styles.hubButtonSubtitle}>Plan a perfect date night experience</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Dinner Companion - always show */}
      <Animated.View entering={FadeInDown.duration(400).delay(hasPartner ? 300 : 300)}>
        <TouchableOpacity style={styles.hubButton} onPress={() => router.push('/solo/dinner-companion' as any)}>
          <Image source={icons.companion} style={styles.hubButtonIcon} resizeMode="contain" />
          <Text style={styles.hubButtonTitle}>Dinner Companion</Text>
          <Text style={styles.hubButtonSubtitle}>A guided mindfulness session, just for you</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
