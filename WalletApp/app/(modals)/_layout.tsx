import { Stack } from 'expo-router';
import { Colors } from '../../constants';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      presentation: 'modal',
      contentStyle: { backgroundColor: Colors.background },
    }}>
      <Stack.Screen name="add-money" />
      <Stack.Screen name="receive" />
      <Stack.Screen name="transaction-detail" />
    </Stack>
  );
}
