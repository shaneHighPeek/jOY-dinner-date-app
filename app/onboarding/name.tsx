import { Text, View, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/hooks/useOnboarding';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: '#17202A',
    textAlign: 'center',
    marginBottom: 40,
  },
  avatarSelector: {
    marginBottom: 40,
  },
  avatarText: {
    fontSize: 60,
  },
  emojiList: {
    marginBottom: 20,
  },
  emojiButton: {
    marginHorizontal: 10,
  },
  emoji: {
    fontSize: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    color: '#17202A',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7E9',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#E74C3C',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

const emojis = ['😊', '😎', '🍔', '🧑‍🍳', '🍕', '🎉'];

export default function NameScreen() {
  const router = useRouter();
  const { name, setName, avatar, setAvatar } = useOnboarding();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What should we call you?</Text>
      <View style={styles.avatarSelector}>
        <Text style={styles.avatarText}>{avatar}</Text>
      </View>
      <FlatList
        data={emojis}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setAvatar(item)} style={styles.emojiButton}>
            <Text style={styles.emoji}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        style={styles.emojiList}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor="gray"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={() => router.push('/onboarding/vibe')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
