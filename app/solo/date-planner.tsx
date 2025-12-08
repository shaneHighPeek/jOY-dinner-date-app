import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Share, Alert, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
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
    title: 'I\'ve evolved',
    text: "I've had a breakthrough. Tonight, I choose peace, love, and dinner without a single debate. Let's use the app before my brain reboots.",
  },
  {
    emoji: '😂',
    title: 'Self-aware',
    text: "I've decided we're having a debate-free dinner tonight. I'm even letting you choose… which is spiritual growth on my part.",
  },
  {
    emoji: '😇',
    title: 'Pre-apologising',
    text: "I vote for a debate-free dinner tonight — zero arguments, zero negotiations, and minimal suspicious eyebrow raises. Let's swipe!",
  },
  {
    emoji: '🍽️',
    title: 'Responsible',
    text: "Fancy a Dinner Without Debate tonight? I promise not to pretend I'm 'fine with anything' and then veto your suggestions. Let's swipe together!",
  },
  {
    emoji: '🤣',
    title: 'I know how I get',
    text: "Let's do a Dinner Without Debate tonight so we can avoid the annual three-hour 'what do you want?' Olympic event. Download the app!",
  },
  {
    emoji: '🧘',
    title: 'Inner peace',
    text: "Calling a peace treaty for tonight's dinner. I'm showing up zen, hydrated, and debate-free. Let's swipe together!",
  },
  {
    emoji: '💘',
    title: 'Impress you',
    text: "Dinner tonight? Zero drama, zero debate. I'll even accept your decision without my usual commentary. Let's swipe together!",
  },
  {
    emoji: '🎯',
    title: 'Too honest',
    text: "Let's do Dinner Without Debate tonight. Because if I'm forced to choose between 20 restaurants again, I might spontaneously combust.",
  },
  {
    emoji: '😏',
    title: 'Romantic',
    text: "I've got a brilliant idea: dinner together, no debates, no stress. I just want you, food, and peace. Let's swipe!",
  },
  {
    emoji: '🔥',
    title: 'Couple dynamic',
    text: "Dinner Without Debate tonight? You pick, I agree, and we both pretend this is how we always operate. Let's make it official.",
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 16,
    lineHeight: 21,
  },
  // Message input at top - always visible
  messageContainer: {
    marginBottom: 20,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageInput: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.primary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'right',
    marginTop: 6,
  },
  // Quick fill chips
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  chipEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  // Bottom action area
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  shareButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
  shareButtonEmoji: {
    fontSize: 20,
  },
});

export default function DatePlannerScreen() {
  const theme = useTheme();
  const { userData } = useUser();
  const router = useRouter();
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const inputRef = useRef<TextInput>(null);

  if (!theme || !userData) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleChipSelect = (index: number) => {
    setSelectedTextIndex(index);
    setMessage(PRE_MADE_TEXTS[index].text);
    Keyboard.dismiss();
  };

  const handleMessageChange = (text: string) => {
    setMessage(text);
    // If user edits the message, clear the chip selection
    const matchingIndex = PRE_MADE_TEXTS.findIndex(t => t.text === text);
    setSelectedTextIndex(matchingIndex >= 0 ? matchingIndex : null);
  };

  const handleShare = async () => {
    if (!message.trim()) {
      Alert.alert('Hold on!', 'Please write or select a message first.');
      return;
    }

    const inviteCode = userData.inviteCode || userData.uid?.substring(0, 6).toUpperCase() || 'DINNER';
    const fullMessage = `${message}\n\n💌 Join me on Dinner Without Debate!\nMy invite code: ${inviteCode}`;

    try {
      await Share.share({
        message: fullMessage,
        title: 'Date Night Invitation! 💖',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share your invitation.');
    }
  };

  const hasMessage = message.trim().length > 0;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Date Night Planner</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Invite your partner for a debate-free dinner! 🍽️
        </Text>

        {/* Message Input - Primary focus */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Your Message</Text>
          <TextInput
            ref={inputRef}
            style={styles.messageInput}
            placeholder="Tap a vibe below or write your own..."
            placeholderTextColor={colors.muted}
            value={message}
            onChangeText={handleMessageChange}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{message.length} characters</Text>
        </View>

        {/* Quick Fill Chips */}
        <Text style={styles.sectionTitle}>Quick Fill</Text>
        <View style={styles.chipsContainer}>
          {PRE_MADE_TEXTS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                selectedTextIndex === index && styles.chipSelected,
              ]}
              onPress={() => handleChipSelect(index)}
            >
              <Text style={styles.chipEmoji}>{option.emoji}</Text>
              <Text style={styles.chipText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.shareButton, !hasMessage && styles.shareButtonDisabled]}
          onPress={handleShare}
          disabled={!hasMessage}
        >
          <Text style={styles.shareButtonEmoji}>💌</Text>
          <Text style={styles.shareButtonText}>
            {hasMessage ? 'Share Invitation' : 'Write a message first'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
