import { StyleSheet, Platform } from 'react-native';
import { tokens } from './tokens';

export const createThemedStyles = (isDark: boolean) => {
  const colors = isDark ? tokens.colors.dark : tokens.colors.light;
  const shadows = isDark ? tokens.shadows.dark : tokens.shadows.light;

  return {
    // Layout containers
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: tokens.spacing.l,
    },
    
    // Cards
    card: {
      backgroundColor: colors.card,
      borderRadius: tokens.radius.m,
      padding: tokens.spacing.l,
      ...StyleSheet.flatten(Platform.select({
        ios: {
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      })),
    },
    
    // Typography
    displayText: {
      fontFamily: tokens.typography.families.display,
      fontSize: tokens.typography.sizes.display,
      color: colors.text,
      lineHeight: tokens.typography.sizes.display * tokens.typography.lineHeights.tight,
    },
    titleLarge: {
      fontFamily: tokens.typography.families.sans,
      fontSize: tokens.typography.sizes.xxl,
      fontWeight: tokens.typography.weights.bold,
      color: colors.text,
    },
    titleMedium: {
      fontFamily: tokens.typography.families.sans,
      fontSize: tokens.typography.sizes.xl,
      fontWeight: tokens.typography.weights.semibold,
      color: colors.text,
    },
    bodyLarge: {
      fontFamily: tokens.typography.families.sans,
      fontSize: tokens.typography.sizes.l,
      color: colors.text,
    },
    bodyMedium: {
      fontFamily: tokens.typography.families.sans,
      fontSize: tokens.typography.sizes.m,
      color: colors.text,
    },
    bodySmall: {
      fontFamily: tokens.typography.families.sans,
      fontSize: tokens.typography.sizes.s,
      color: colors.muted,
    },
    
    // Buttons
    buttonPrimary: {
      backgroundColor: colors.primary,
      paddingVertical: tokens.spacing.m,
      paddingHorizontal: tokens.spacing.xl,
      borderRadius: tokens.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      paddingVertical: tokens.spacing.m,
      paddingHorizontal: tokens.spacing.xl,
      borderRadius: tokens.radius.pill,
      borderWidth: 1,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontFamily: tokens.typography.families.sans,
      fontSize: tokens.typography.sizes.m,
      fontWeight: tokens.typography.weights.semibold,
      color: colors.text,
    },
    
    // Inputs
    input: {
      backgroundColor: colors.card,
      borderRadius: tokens.radius.m,
      padding: tokens.spacing.m,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      fontSize: tokens.typography.sizes.m,
    },
    
    // Modal
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: tokens.radius.l,
      borderTopRightRadius: tokens.radius.l,
      padding: tokens.spacing.l,
      minHeight: 200,
    },
  };
};
