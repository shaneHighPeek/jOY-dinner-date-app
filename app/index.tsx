import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  // This screen should never be visible - the root layout handles all routing
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
