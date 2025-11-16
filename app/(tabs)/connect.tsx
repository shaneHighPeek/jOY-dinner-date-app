import { Text, View, TouchableOpacity, TextInput, Share } from 'react-native';
import styled from 'styled-components/native';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState } from 'react';

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

const Input = styled(TextInput)`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.m}px;
  border-radius: 8px;
  font-size: ${({ theme }) => theme.fontSizes.m}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.l}px;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.m}px;
  border-radius: 8px;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
`;

const ButtonText = styled(Text)`
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.m}px;
`;

const InviteContainer = styled(View)`
  margin-top: 40px;
  align-items: center;
`;

const InviteCode = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 10px;
`;

const NotConnectedView = () => {
  const { user } = useAuth();
  const [partnerCode, setPartnerCode] = useState('');

  const handleShare = async () => {
    if (!user) return;
    try {
      await Share.share({
        message: `Join me on jOY! My invite code is: ${user.uid}`,
      });
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  const handleConnect = async () => {
    if (!user || !partnerCode) return;

    try {
      const coupleId = [user.uid, partnerCode].sort().join('_');
      const batch = writeBatch(db);

      const userRef = doc(db, 'users', user.uid);
      batch.update(userRef, { coupleId, partnerId: partnerCode });

      const partnerRef = doc(db, 'users', partnerCode);
      batch.update(partnerRef, { coupleId, partnerId: user.uid });

      await batch.commit();
    } catch (error) {
      console.error('Failed to connect with partner:', error);
    }
  };

  return (
    <>
      <Title>Connect with your Partner</Title>
      <Input
        placeholder="Enter your partner's code"
        placeholderTextColor="gray"
        value={partnerCode}
        onChangeText={setPartnerCode}
      />
      <Button onPress={handleConnect}>
        <ButtonText>Connect</ButtonText>
      </Button>

      <InviteContainer>
        <Title>Or Invite Them</Title>
        <InviteCode>{user?.uid}</InviteCode>
        <Button onPress={handleShare}>
          <ButtonText>Share Your Code</ButtonText>
        </Button>
      </InviteContainer>
    </>
  );
};

const ConnectedView = ({ partnerName }: { partnerName: string }) => (
  <>
    <Title>You're Connected!</Title>
    <Text>You are connected with {partnerName}.</Text>
  </>
);

export default function ConnectScreen() {
  const { userData } = useUser();

  return (
    <Container>
      {userData?.coupleId ? (
        <ConnectedView partnerName={userData.partnerName || 'your partner'} />
      ) : (
        <NotConnectedView />
      )}
    </Container>
  );
}
