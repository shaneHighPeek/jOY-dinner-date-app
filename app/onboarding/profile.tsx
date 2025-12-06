import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useOnboarding } from '@/hooks/useOnboarding';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const avatars = ['😊', '🍕', '🎉', '💖', '🚀', '🌟'];

const OnboardingProfileScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const { setName, setAvatar } = useOnboarding();
  const [currentName, setCurrentName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  if (!theme) return null;
  const { colors } = theme;

  const handleContinue = () => {
    setName(currentName);
    setAvatar(selectedAvatar);
    router.push('/onboarding/vibe');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={styles.progressContainer} entering={FadeIn.duration(500)}>
        <View style={[styles.progressBar, { backgroundColor: colors.primary, width: '33%' }]} />
      </Animated.View>

      <Animated.Text entering={FadeInUp.duration(500).delay(200)} style={[styles.title, { color: colors.text }]}>
        What should we call you?
      </Animated.Text>
      <Animated.Text entering={FadeInUp.duration(500).delay(400)} style={[styles.subtitle, { color: colors.muted }]}>
        This helps us personalize your experience.
      </Animated.Text>

      <Animated.View entering={FadeInUp.duration(500).delay(600)} style={styles.avatarContainer}>
        <Text style={[styles.avatar, { borderColor: colors.primary }]}>{selectedAvatar}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(800)} style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
          placeholder="Enter your name"
          placeholderTextColor={colors.muted}
          value={currentName}
          onChangeText={setCurrentName}
        />
      </Animated.View>

      <Animated.Text entering={FadeInUp.duration(500).delay(1000)} style={[styles.avatarLabel, { color: colors.text }]}>
        Choose your emoji avatar
      </Animated.Text>
      <Animated.View entering={FadeInUp.duration(500).delay(1200)} style={styles.avatarSelectionContainer}>
        {avatars.map((avatar) => (
          <TouchableOpacity key={avatar} onPress={() => setSelectedAvatar(avatar)}>
            <Text style={[styles.avatarOption, selectedAvatar === avatar && styles.selectedAvatarOption]}>
              {avatar}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(1400)} style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 40,
  },
  progressBar: {
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    fontSize: 80,
    borderWidth: 4,
    borderRadius: 50,
    padding: 10,
    overflow: 'hidden',
  },
  inputContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    width: '80%',
    textAlign: 'center',
  },
  avatarLabel: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  avatarSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  avatarOption: {
    fontSize: 40,
    opacity: 0.5,
  },
  selectedAvatarOption: {
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingProfileScreen;
