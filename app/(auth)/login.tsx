import { Text, View, Pressable, StyleSheet, ActivityIndicator, useWindowDimensions, Image, ImageBackground } from 'react-native';
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
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -70 }], // Center vertically, then move up 20px (button is ~50px, so -50/2 - 20 = -45, but we want 20px above center so -70)
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
    backgroundColor: '#FFD10E',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
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
      <ImageBackground 
        source={require('../../assets/images/splash.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Animated.View 
          style={styles.content}
          entering={FadeIn.duration(1000)}
        >
          <Animated.View
            entering={FadeInDown.duration(1000).delay(900)}
            style={{ width: '100%' }}
          >
            <Pressable 
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {({ pressed }) => loading ? (
                <ActivityIndicator color="red" size="small" />
              ) : (
                <Text style={[styles.buttonText, pressed && { color: '#E53935' }]}>Let's Cure Hungry-ness!!</Text>
              )}
            </Pressable>
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
      </ImageBackground>
    </View>
  );
}
