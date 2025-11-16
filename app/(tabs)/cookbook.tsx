import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { Paywall } from '@/components/premium/Paywall';

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.xl}px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  padding: 20px;
  padding-top: 60px;
`;

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default function CookbookScreen() {
  const { isPremium } = usePremiumStatus();

  if (!isPremium) {
    return <Paywall />;
  }

  return (
    <Container>
      <Title>My Cookbook</Title>
      <ContentContainer>
        <Text>Saved recipes will appear here.</Text>
      </ContentContainer>
    </Container>
  );
}
