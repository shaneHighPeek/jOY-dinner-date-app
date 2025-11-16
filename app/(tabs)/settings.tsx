import { Text, View, TouchableOpacity, Switch } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/theme/ThemeProvider';

const Container = styled(View)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  padding-top: 60px;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.xl}px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  margin-bottom: 20px;
`;

const SettingRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const SettingText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.m}px;
  color: ${({ theme }) => theme.colors.text};
`;

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Container>
      <Title>Settings</Title>
      <SettingRow>
        <SettingText>Dark Mode</SettingText>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </SettingRow>
    </Container>
  );
}
