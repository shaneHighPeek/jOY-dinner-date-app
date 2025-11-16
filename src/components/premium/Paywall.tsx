import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.xl}px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const Subtitle = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.m}px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 40px;
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

export const Paywall = () => {
  return (
    <Container>
      <Title>Your Trial has Ended</Title>
      <Subtitle>Upgrade to Premium to continue using this feature and unlock more.</Subtitle>
      <Button onPress={() => alert('Upgrade functionality to be implemented.')}>
        <ButtonText>Upgrade to Premium</ButtonText>
      </Button>
    </Container>
  );
};
