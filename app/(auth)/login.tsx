import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState } from 'react';

const Container = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.xl}px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.m}px;
  border-radius: 8px;
`;

const ButtonText = styled(Text)`
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.m}px;
`;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <Container>
      <Title>Welcome to jOY</Title>
      <Button onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ButtonText>Sign In Anonymously</ButtonText>
        )}
      </Button>
      {error && (
        <Text style={{ color: 'red', marginTop: 20 }}>{error}</Text>
      )}
    </Container>
  );
}
