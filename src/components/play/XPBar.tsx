import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

const XPContainer = styled(View)`
  width: 100%;
  padding: 10px 20px;
  align-items: center;
`;

const LevelText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.m}px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  margin-bottom: 5px;
`;

const BarBackground = styled(View)`
  width: 100%;
  height: 10px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  overflow: hidden;
`;

const BarProgress = styled(View)<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.accent};
`;

interface XPBarProps {
  level: number;
  xp: number;
  xpForNextLevel: number;
}

export const XPBar = ({ level, xp, xpForNextLevel }: XPBarProps) => {
  const progress = (xp / xpForNextLevel) * 100;

  return (
    <XPContainer>
      <LevelText>Level {level}</LevelText>
      <BarBackground>
        <BarProgress progress={progress} />
      </BarBackground>
    </XPContainer>
  );
};
