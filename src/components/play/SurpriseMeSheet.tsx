import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';

type Colors = {
  background: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  error: string;
  border: string;
  overlay: string;
};

const createStyles = (colors: Colors) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  sheetContainer: {
    backgroundColor: colors.card,
    padding: 24,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  suggestionText: {
    fontFamily: 'Georgia',
    fontSize: 32,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
  },
  closeButtonText: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 8,
  },
});

interface SurpriseMeSheetProps {
  visible: boolean;
  suggestion: { id: string; name: string } | null;
  onClose: () => void;
  onAccept: () => void;
  onSpinAgain: () => void;
}

export const SurpriseMeSheet = ({ visible, suggestion, onClose, onAccept, onSpinAgain }: SurpriseMeSheetProps) => {
  const theme = useTheme();
  if (!theme) return null; // Or a loading/error state
  const { colors } = theme;
  const styles = createStyles(colors);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Animated.View 
        style={styles.modalContainer}
        entering={FadeIn.duration(300)}
      >
        <Animated.View 
          style={styles.sheetContainer}
          entering={SlideInDown.duration(300)}
          exiting={SlideOutDown.duration(300)}
        >
          <Text style={styles.title}>How about...</Text>
          <Text style={styles.suggestionText}>{suggestion?.name || '...'}</Text>
          <TouchableOpacity style={styles.button} onPress={onAccept}>
            <Text style={styles.buttonText}>Lock it in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onSpinAgain}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Spin Again</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
