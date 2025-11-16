import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useState } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: '#17202A',
    textAlign: 'center',
    marginBottom: 40,
  },
  vibeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  vibeTile: {
    padding: 16,
    borderRadius: 8,
    margin: 8,
    borderWidth: 1,
    borderColor: '#E5E7E9',
    width: 150,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vibeTileSelected: {
    backgroundColor: '#E74C3C',
  },
  vibeTileUnselected: {
    backgroundColor: '#FFFFFF',
  },
  vibeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vibeTextSelected: {
    color: 'white',
  },
  vibeTextUnselected: {
    color: '#17202A',
  },
  button: {
    backgroundColor: '#E74C3C',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

const vibes = ['Chill', 'Adventurous', 'Romantic', 'Foodie', 'Spontaneous', 'Homebody'];

export default function VibeScreen() {
  const router = useRouter();
  const { setVibe } = useOnboarding();
  const [selectedVibe, setSelectedVibe] = useState('');

  const handleContinue = () => {
    setVibe(selectedVibe);
    router.push('/onboarding/cuisine');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's your vibe?</Text>
      <View style={styles.vibeGrid}>
        {vibes.map(vibe => (
          <TouchableOpacity
            key={vibe}
            style={[
              styles.vibeTile,
              selectedVibe === vibe ? styles.vibeTileSelected : styles.vibeTileUnselected
            ]}
            onPress={() => setSelectedVibe(vibe)}>
            <Text style={[
              styles.vibeText,
              selectedVibe === vibe ? styles.vibeTextSelected : styles.vibeTextUnselected
            ]}>
              {vibe}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity 
        style={[styles.button, !selectedVibe && styles.buttonDisabled]} 
        onPress={handleContinue} 
        disabled={!selectedVibe}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
