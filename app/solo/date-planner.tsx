import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Share, Alert } from 'react-native';
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

const createStyles = (colors: Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 60,
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: colors.muted,
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
    marginTop: 16,
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
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!theme || !userData) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleShare = async () => {
    if (!activity) {
      Alert.alert('Hold on!', 'Please enter an activity for your date night.');
      return;
    }

    const inviteCode = userData.uid.substring(0, 8).toUpperCase();
    const message = `Date Night Plan! 💖\n\n✨ What: ${activity}\n🗓️ When: ${date || 'Anytime'}\n📝 Notes: ${notes || 'Just good vibes!'}\n\nLet's decide together! Join me on jOY so we never have to ask "What do you want to eat?" again.\n\nUse my invite code: ${inviteCode}\n\n[App Link Here]`; // Replace with actual app link

    try {
      await Share.share({
        message,
        title: 'You\'ve been invited to a date night!',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share your plan.');
    }
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <Animated.Text style={styles.title} entering={FadeInUp.duration(500).delay(100)}>Date Night Planner</Animated.Text>
      <Animated.Text style={styles.subtitle} entering={FadeInUp.duration(500).delay(200)}>Create a plan and invite your partner.</Animated.Text>

      <Animated.View style={styles.inputGroup} entering={FadeInUp.duration(500).delay(300)}>
        <Text style={styles.label}>What's the plan?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Tacos at sunset, movie night..."
          placeholderTextColor={colors.muted}
          value={activity}
          onChangeText={setActivity}
        />
      </Animated.View>

      <Animated.View style={styles.inputGroup} entering={FadeInUp.duration(500).delay(400)}>
        <Text style={styles.label}>When?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Friday night, this weekend..."
          placeholderTextColor={colors.muted}
          value={date}
          onChangeText={setDate}
        />
      </Animated.View>

      <Animated.View style={styles.inputGroup} entering={FadeInUp.duration(500).delay(500)}>
        <Text style={styles.label}>Any extra notes?</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="e.g., Don't forget the dessert!"
          placeholderTextColor={colors.muted}
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </Animated.View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share Date Plan</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
