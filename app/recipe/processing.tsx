import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ProcessingScreen() {
  const { imageUri } = useLocalSearchParams();
  const { colors } = useTheme()!;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          presentation: 'fullScreenModal',
        }} 
      />
      
      <Animated.View 
        entering={FadeIn.duration(1000)}
        style={styles.content}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { color: colors.text }]}>
          Processing your recipe...
        </Text>
        <Text style={[styles.subtext, { color: colors.muted }]}>
          Using AI to extract ingredients and instructions
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});
