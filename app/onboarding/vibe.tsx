import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useOnboarding } from '@/hooks/useOnboarding';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    backgroundColor: colors.background,
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
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: colors.muted,
  },
  vibeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  vibeTile: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vibeTileSelected: {
    borderColor: colors.primary,
  },
  vibeEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  vibeImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  vibeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.card,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

const vibes: { name: string; image: ImageSourcePropType }[] = [
  { name: 'Chill', image: require('../../assets/images/chill.png') },
  { name: 'Adventurous', image: require('../../assets/images/adven.png') },
  { name: 'Fancy', image: require('../../assets/images/fancy.png') },
  { name: 'Romantic', image: require('../../assets/images/romantic.png') },
  { name: 'Cozy', image: require('../../assets/images/cozy.png') },
  { name: 'Spontaneous', image: require('../../assets/images/spont.png') },
];

export default function VibeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { setVibe } = useOnboarding();
  const [selectedVibe, setSelectedVibe] = useState('');

  if (!theme) return null;
  const { colors } = theme;
  const styles = createStyles(colors);

  const handleContinue = () => {
    setVibe(selectedVibe);
    router.push('/onboarding/cuisine');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={styles.progressContainer} entering={FadeIn.duration(500)}>
        <View style={[styles.progressBar, { backgroundColor: colors.primary, width: '66%' }]} />
      </Animated.View>

      <Animated.Text entering={FadeInUp.duration(500).delay(200)} style={styles.title}>
        What's your vibe?
      </Animated.Text>
      <Animated.Text entering={FadeInUp.duration(500).delay(400)} style={styles.subtitle}>
        Pick one to help us set the mood.
      </Animated.Text>

      <View style={styles.vibeGrid}>
        {vibes.map((vibe, index) => (
          <TouchableOpacity
            key={vibe.name}
            style={[
              styles.vibeTile,
              selectedVibe === vibe.name && styles.vibeTileSelected,
            ]}
            onPress={() => setSelectedVibe(vibe.name)}
          >
            <Image source={vibe.image} style={styles.vibeImage} resizeMode="contain" />
            <Text style={styles.vibeText}>{vibe.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View entering={FadeInDown.duration(500).delay(1400)} style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, !selectedVibe && styles.buttonDisabled]} 
          onPress={handleContinue} 
          disabled={!selectedVibe}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
