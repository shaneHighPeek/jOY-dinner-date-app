import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#17202A',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#E74C3C',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default function PaywallScreen() {
  const { name, avatar, vibe, cuisinePreferences } = useOnboarding();
  const { user, setOnboardingComplete } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartTrial = async () => {
    if (!user) {
      setError('No user found. Please try signing in again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Creating user profile for:', user.uid);
      console.log('User data:', { name, avatar, vibe, cuisinePreferences });

      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 3);

      await setDoc(doc(db, 'users', user.uid), {
        name,
        avatar,
        vibe,
        cuisinePreferences,
        createdAt: new Date(),
        trialEndDate,
        isPremium: true, // During trial
        xp: 0,
        level: 1,
        hints: 1,
      });

      console.log('User profile created successfully!');
      setOnboardingComplete(true);
    } catch (error: any) {
      console.error('Failed to create user profile:', error);
      setError(error.message || 'Failed to create profile. Please try again.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Everything</Text>
      <Text style={styles.subtitle}>Start your free 3-day trial to get unlimited access to all features.</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleStartTrial}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Start Free Trial</Text>
        )}
      </TouchableOpacity>
      {error && (
        <Text style={{ color: 'red', marginTop: 20, textAlign: 'center' }}>{error}</Text>
      )}
    </View>
  );
}
