import { Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Container = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.l}px;
`;

const Emoji = styled(Text)`
  font-size: 80px;
  margin-bottom: ${({ theme }) => theme.spacing.m}px;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.xl}px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.m}px;
`;

const Subtitle = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.m}px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.m}px;
  border-radius: 8px;
  width: 100%;
  align-items: center;
`;

const ButtonText = styled(Text)`
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.m}px;
`;

export default function MatchScreen() {
  const router = useRouter();
  const { itemName } = useLocalSearchParams();

  return (
    <Container>
      <Emoji>🎉</Emoji>
      <Title>It's a Match!</Title>
      <Subtitle>You and your partner both want {itemName || 'something delicious'}!</Subtitle>
      <Button onPress={() => router.back()}>
        <ButtonText>Keep Swiping</ButtonText>
      </Button>
    </Container>
  );
}
