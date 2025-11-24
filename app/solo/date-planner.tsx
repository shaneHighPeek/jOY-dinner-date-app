import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Share, Alert, ScrollView } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useUser } from '@/hooks/useUser';
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

const PRE_MADE_TEXTS = [
  {
    emoji: '🔥',
    title: 'The "I\'ve evolved"',
    text: "I've had a breakthrough. Tonight, I choose peace, love, and dinner without a single debate. Let's use jOY before my brain reboots.",
  },
  {
    emoji: '😂',
    title: 'The "I\'m self-aware now"',
    text: "I've decided we're having a debate-free dinner tonight. I'm even letting you choose… which is spiritual growth on my part.",
  },
  {
    emoji: '😇',
    title: 'The "I\'m pre-apologising"',
    text: "I vote for a debate-free dinner tonight — zero arguments, zero negotiations, and minimal suspicious eyebrow raises. Let's use jOY!",
  },
  {
    emoji: '🍽️',
    title: 'The "I\'m trying to be responsible"',
    text: "Fancy a Dinner Without Debate tonight? I promise not to pretend I'm 'fine with anything' and then veto your suggestions. Let's swipe together!",
  },
  {
    emoji: '🤣',
    title: 'The "I know how I get"',
    text: "Let's do a Dinner Without Debate tonight so we can avoid the annual three-hour 'what do you want?' Olympic event. I'm downloading jOY now.",
  },
  {
    emoji: '🧘',
    title: 'The "inner peace"',
    text: "Calling a peace treaty for tonight's dinner. I'm showing up zen, hydrated, and debate-free. Let's let jOY decide!",
  },
  {
    emoji: '💘',
    title: 'The "I\'m trying to impress you"',
    text: "Dinner tonight? Zero drama, zero debate. I'll even accept your decision without my usual commentary. Let's use jOY together!",
  },
  {
    emoji: '🎯',
    title: 'The "too honest"',
    text: "Let's do Dinner Without Debate tonight. Because if I'm forced to choose between 20 restaurants again, I might spontaneously combust. jOY will save us.",
  },
  {
    emoji: '😏',
    title: 'The "romantic but playful"',
    text: "I've got a brilliant idea: dinner together, no debates, no stress. I just want you, food, and peace. Let's try jOY!",
  },
  {
    emoji: '🔥',
    title: 'The "most accurate couple dynamic ever"',
    text: "Dinner Without Debate tonight? You pick, I agree, and we both pretend this is how we always operate. Let's use jOY to make it official.",
  },
];

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 20,
    color: colors.text,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollContent: {
    padding: 24,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 24,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  textOptionsContainer: {
    marginBottom: 24,
  },
  textOption: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textOptionSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primary + '10',
  },
  textOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  textOptionEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  textOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  textOptionText: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default function DatePlannerScreen() {
  const theme = useTheme();
  const { userData } = useUser();
  const router = useRouter();
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [date, setDate] = useState('');

  if (!theme || !userData) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleTextSelect = (index: number) => {
    setSelectedTextIndex(index);
    setCustomMessage(''); // Clear custom message when selecting a pre-made text
  };

  const handleShare = async () => {
    const messageToShare = selectedTextIndex !== null 
      ? PRE_MADE_TEXTS[selectedTextIndex].text 
      : customMessage;

    if (!messageToShare.trim()) {
      Alert.alert('Hold on!', 'Please select a message or write your own.');
      return;
    }

    const inviteCode = userData.uid.substring(0, 8).toUpperCase();
    const fullMessage = `${messageToShare}\n\n🗓️ When: ${date || 'Anytime works!'}\n\nUse my invite code to join jOY: ${inviteCode}\n\n[App Link Here]`;

    try {
      await Share.share({
        message: fullMessage,
        title: 'Date Night Invitation! 💖',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share your invitation.');
    }
  };

  const hasSelectedMessage = selectedTextIndex !== null || customMessage.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Date Night Planner</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Pick a fun message to invite your partner for a debate-free dinner! 🍽️✨
        </Text>

        {/* Pre-made Text Options */}
        <Text style={styles.sectionTitle}>Choose Your Vibe</Text>
        <View style={styles.textOptionsContainer}>
          {PRE_MADE_TEXTS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.textOption,
                selectedTextIndex === index && styles.textOptionSelected,
              ]}
              onPress={() => handleTextSelect(index)}
            >
              <View style={styles.textOptionHeader}>
                <Text style={styles.textOptionEmoji}>{option.emoji}</Text>
                <Text style={styles.textOptionTitle}>{option.title}</Text>
              </View>
              <Text style={styles.textOptionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Message Option */}
        <Text style={styles.sectionTitle}>Or Write Your Own</Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Write your own invitation message..."
            placeholderTextColor={colors.muted}
            value={customMessage}
            onChangeText={(text) => {
              setCustomMessage(text);
              setSelectedTextIndex(null); // Clear selection when typing custom message
            }}
            multiline
          />
        </View>

        {/* Date/Time Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>When?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Friday night, this weekend..."
            placeholderTextColor={colors.muted}
            value={date}
            onChangeText={setDate}
          />
        </View>

        {/* Share Button */}
        <TouchableOpacity
          style={[styles.shareButton, !hasSelectedMessage && styles.shareButtonDisabled]}
          onPress={handleShare}
          disabled={!hasSelectedMessage}
        >
          <Text style={styles.shareButtonText}>
            {hasSelectedMessage ? '💌 Share Invitation' : 'Select a message first'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
