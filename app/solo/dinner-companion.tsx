import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, Dimensions } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useUser } from '@/hooks/useUser';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_GAP = 12;
const TILE_WIDTH = (SCREEN_WIDTH - 32 - TILE_GAP) / 2; // 32 = padding (16 * 2)

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  border: string;
};

// Reflection themes - like Insight Timer
const THEMES = [
  {
    id: 'gratitude',
    icon: 'diamond-outline' as const,
    title: 'Gratitude',
    subtitle: 'What makes you pause and appreciate',
    color: '#B45309',
    welcome: "This space is here to help you notice the good — even the small, quiet things. Gratitude doesn't have to be loud. Sometimes it's just a warm meal, a moment of peace, or the fact that you're here.",
    prompt: "What's something you're grateful for right now?",
  },
  {
    id: 'presence',
    icon: 'infinite-outline' as const,
    title: 'Presence',
    subtitle: 'Being here, right now',
    color: '#8B5CF6',
    welcome: "Eating is one of the few times we can truly slow down. This space invites you to notice — the flavors, the textures, the moment. No rush. Just you and your meal.",
    prompt: "How present do you feel right now, on a scale of 1-10? What's on your mind?",
  },
  {
    id: 'reflection',
    icon: 'chatbubble-ellipses-outline' as const,
    title: 'Reflection',
    subtitle: 'Thoughts worth exploring',
    color: '#3B82F6',
    welcome: "Sometimes the best conversations are the ones we have with ourselves. Use this space to think through something — a decision, a feeling, or just how your day went.",
    prompt: "What's been on your mind lately?",
  },
  {
    id: 'intentions',
    icon: 'compass-outline' as const,
    title: 'Intentions',
    subtitle: 'What you want to bring forward',
    color: '#10B981',
    welcome: "Setting intentions isn't about pressure — it's about direction. What energy do you want to carry with you? What matters to you right now?",
    prompt: "What's one intention you'd like to set for yourself?",
  },
  {
    id: 'letting-go',
    icon: 'leaf-outline' as const,
    title: 'Letting Go',
    subtitle: 'What you\'re ready to release',
    color: '#EC4899',
    welcome: "Sometimes we hold onto things longer than we need to — stress, expectations, old stories. This is a space to acknowledge what you're ready to let go of.",
    prompt: "What's something you'd like to release or let go of?",
  },
  {
    id: 'joy',
    icon: 'sunny-outline' as const,
    title: 'Joy',
    subtitle: 'What lights you up',
    color: '#F97316',
    welcome: "Joy doesn't always come from big moments. Often it's hidden in the everyday — a taste, a memory, a thought. Let's find some of that today.",
    prompt: "What's something that brought you joy recently?",
  },
];

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
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
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: colors.text,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: TILE_WIDTH,
    height: TILE_WIDTH * 1.1,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: TILE_GAP,
    justifyContent: 'space-between',
  },
  tileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  tileContent: {
    alignItems: 'center',
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  tileSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 16,
  },
  tileProgress: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
  },
  tileProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 26,
    marginBottom: 32,
  },
  promptLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  promptText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    lineHeight: 28,
    marginBottom: 24,
  },
  journalInput: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: 'white',
    minHeight: 150,
    textAlignVertical: 'top',
  },
  journalPlaceholder: {
    color: 'rgba(255,255,255,0.5)',
  },
  tipContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default function DinnerCompanionScreen() {
  const theme = useTheme();
  const { userData } = useUser();
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<typeof THEMES[0] | null>(null);
  const [journalText, setJournalText] = useState('');

  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  const userName = userData?.displayName?.split(' ')[0] || 'Friend';

  const handleOpenTheme = (themeItem: typeof THEMES[0]) => {
    setSelectedTheme(themeItem);
    setJournalText('');
  };

  const handleClose = () => {
    setSelectedTheme(null);
    setJournalText('');
  };

  const handleSave = () => {
    // For now, just close. V2 could save to Firestore
    if (journalText.trim()) {
      // Could save journal entry here in future
    }
    handleClose();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Animated.Text style={styles.title} entering={FadeInUp.duration(400)}>
          Dinner Companion
        </Animated.Text>
        <Animated.Text style={styles.subtitle} entering={FadeInUp.duration(400).delay(100)}>
          A mindful moment while you eat. Choose a theme to reflect on.
        </Animated.Text>
      </View>

      {/* Tiles Grid */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.tilesContainer}>
          {THEMES.map((themeItem, index) => (
            <Animated.View key={themeItem.id} entering={FadeInUp.duration(400).delay(100 + index * 50)}>
              <TouchableOpacity
                style={styles.tile}
                onPress={() => handleOpenTheme(themeItem)}
                activeOpacity={0.7}
              >
                <View style={[styles.tileIconContainer, { backgroundColor: `${themeItem.color}20` }]}>
                  <Ionicons name={themeItem.icon} size={26} color={themeItem.color} />
                </View>
                <View style={styles.tileContent}>
                  <Text style={styles.tileTitle}>{themeItem.title}</Text>
                  <Text style={styles.tileSubtitle}>{themeItem.subtitle}</Text>
                </View>
                <View style={styles.tileProgress}>
                  <View style={[styles.tileProgressFill, { width: '0%', backgroundColor: themeItem.color }]} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Theme Modal */}
      <Modal visible={!!selectedTheme} animationType="slide" transparent={false}>
        {selectedTheme && (
          <LinearGradient
            colors={[selectedTheme.color, `${selectedTheme.color}CC`, `${selectedTheme.color}99`]}
            style={styles.modalGradient}
          >
            <KeyboardAvoidingView 
              style={{ flex: 1 }} 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Done</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent} keyboardShouldPersistTaps="handled">
                {/* Welcome */}
                <Animated.Text style={styles.welcomeText} entering={FadeIn.duration(500).delay(200)}>
                  Welcome, {userName}.{'\n\n'}
                  {selectedTheme.welcome}
                </Animated.Text>

                {/* Prompt */}
                <Animated.View entering={FadeIn.duration(500).delay(400)}>
                  <Text style={styles.promptLabel}>Let's begin here</Text>
                  <Text style={styles.promptText}>{selectedTheme.prompt}</Text>
                </Animated.View>

                {/* Journal Input */}
                <Animated.View entering={FadeInDown.duration(500).delay(600)}>
                  <TextInput
                    style={styles.journalInput}
                    placeholder="Write your thoughts..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={journalText}
                    onChangeText={setJournalText}
                    multiline
                    textAlignVertical="top"
                  />
                </Animated.View>

                {/* Tip */}
                <Animated.View style={styles.tipContainer} entering={FadeIn.duration(500).delay(800)}>
                  <Text style={styles.tipText}>
                    💡 This is your private space. No one else will see what you write.
                  </Text>
                </Animated.View>
              </ScrollView>
            </KeyboardAvoidingView>
          </LinearGradient>
        )}
      </Modal>
    </View>
  );
}
