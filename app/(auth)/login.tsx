import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, useWindowDimensions, Image } from 'react-native';
import { useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';


type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  error: string;
};

const createStyles = (colors: Colors, window: { width: number; height: number }) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: colors.text,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
});

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  if (!theme) throw new Error('LoginScreen must be used within a ThemeProvider');
  const { colors } = theme;
  const window = useWindowDimensions();
  const styles = createStyles(colors, window);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting anonymous sign-in...');
      const result = await signInAnonymously(auth);
      console.log('Sign-in successful:', result.user.uid);
    } catch (error: any) {
      console.error('Anonymous sign-in failed:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={styles.content}
        entering={FadeIn.duration(1000)}
      >
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Animated.View
          entering={FadeInDown.duration(1000).delay(900)}
          style={{ width: '100%' }}
        >
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign In Anonymously</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
        {error && (
          <Animated.Text 
            style={styles.errorText}
            entering={FadeIn.duration(300)}
          >
            {error}
          </Animated.Text>
        )}
      </Animated.View>
    </View>
  );
}
