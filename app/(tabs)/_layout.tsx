import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabLayout() {
  const theme = useTheme();
  if (!theme) return null;
  const { colors } = theme;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 90,
          paddingBottom: 30,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="play"
        options={{
          title: 'Play',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="gamepad" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cookbook"
        options={{
          title: 'Cookbook',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          title: 'Connect',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="play-swipe"
        options={{
          href: null, // Hide from tab bar
          title: 'Swipe',
        }}
      />
    </Tabs>
  );
}

