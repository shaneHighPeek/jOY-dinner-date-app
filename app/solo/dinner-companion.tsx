import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
};

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 32,
  },
  promptCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  promptText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  finishButton: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

const prompts = [
  {
    title: 'Gratitude Check-in',
    text: 'What is one small thing that brought you joy today? It could be a warm cup of coffee, a song you heard, or a moment of peace. Acknowledge it and let that feeling sink in.',
  },
  {
    title: 'Mindful Moment',
    text: 'Take a deep breath. Inhale for four counts, hold for four, and exhale for six. Notice the sensation of the air. Be present in this exact moment, without judgment.',
  },
  {
    title: 'Reflection Point',
    text: 'Think about a recent decision you made about food. Was it a conscious choice, or a reaction to hunger or stress? What can you learn from it?',
  },
  {
    title: 'Presence Score',
    text: 'On a scale of 1 to 10, how present do you feel right now? 1 being completely distracted, 10 being fully engaged. There\'s no right answer, just honest awareness.',
  },
];

export default function DinnerCompanionScreen() {
  const theme = useTheme();
  const router = useRouter();

  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.Text style={styles.title} entering={FadeInUp.duration(500).delay(100)}>The Dinner Companion</Animated.Text>
        <Animated.Text style={styles.subtitle} entering={FadeInUp.duration(500).delay(200)}>A moment of mindfulness, just for you.</Animated.Text>

        {prompts.map((prompt, index) => (
          <Animated.View key={prompt.title} style={styles.promptCard} entering={FadeInUp.duration(500).delay(300 + index * 150)}>
            <Text style={styles.promptTitle}>{prompt.title}</Text>
            <Text style={styles.promptText}>{prompt.text}</Text>
          </Animated.View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.finishButton} onPress={() => router.back()}>
        <Text style={styles.finishButtonText}>Finish Session</Text>
      </TouchableOpacity>
    </View>
  );
}
