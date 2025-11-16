import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styled from 'styled-components/native';

const ModalContainer = styled(View)`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const SheetContainer = styled(View)`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.l}px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  margin-bottom: 10px;
`;

const SuggestionText = styled(Text)`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  margin-bottom: 20px;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.m}px;
  border-radius: 8px;
  width: 100%;
  align-items: center;
  margin-bottom: 10px;
`;

const ButtonText = styled(Text)`
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.m}px;
`;

interface SurpriseMeSheetProps {
  visible: boolean;
  suggestion: { id: string; name: string } | null;
  onClose: () => void;
  onAccept: () => void;
  onSpinAgain: () => void;
}

export const SurpriseMeSheet = ({ visible, suggestion, onClose, onAccept, onSpinAgain }: SurpriseMeSheetProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <ModalContainer>
        <SheetContainer>
          <Title>How about...</Title>
          <SuggestionText>{suggestion?.name}</SuggestionText>
          <Button onPress={onAccept}>
            <ButtonText>Lock it in</ButtonText>
          </Button>
          <Button onPress={onSpinAgain} style={{ backgroundColor: '#7f8c8d' }}>
            <ButtonText>Spin Again</ButtonText>
          </Button>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ color: 'gray' }}>Close</Text>
          </TouchableOpacity>
        </SheetContainer>
      </ModalContainer>
    </Modal>
  );
};
