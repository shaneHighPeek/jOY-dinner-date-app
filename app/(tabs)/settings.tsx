import { Text, View, Switch, StyleSheet } from 'react-native';
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
});

export default function SettingsScreen() {
  const theme = useTheme();
  if (!theme) return null;
  const { colors, isDarkMode, toggleTheme } = theme;
  const styles = createStyles(colors);

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <Text style={styles.title}>Settings</Text>
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
    </Animated.View>
  );
}
