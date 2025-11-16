import { Text, View, StyleSheet } from 'react-native';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { Paywall } from '@/components/premium/Paywall';
import { useTheme } from '@/theme/ThemeProvider';
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
  },
  title: {
    fontSize: 32,
    color: colors.text,
    fontWeight: 'bold',
    padding: 20,
    paddingTop: 60,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.muted,
  },
});

export default function CookbookScreen() {
  const { isPremium } = usePremiumStatus();
  const theme = useTheme();
  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  if (!isPremium) {
    return <Paywall />;
  }

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <Text style={styles.title}>My Cookbook</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.placeholderText}>Saved recipes will appear here.</Text>
      </View>
    </Animated.View>
  );
}
