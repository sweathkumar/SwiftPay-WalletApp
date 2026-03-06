import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from '../constants/AppContext';
import { Colors } from '../constants';

function AuthGuard() {
  const { isAuthenticated, hasWallet } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuth = segments[0] === '(auth)';
    const inTabs = segments[0] === '(tabs)';
    const inModals = segments[0] === '(modals)';

    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !hasWallet && !inAuth) {
      router.replace('/(auth)/create-wallet');
    } else if (isAuthenticated && hasWallet && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, hasWallet, segments]);

  return null;
}

function RootLayout() {
  return (
    <AppProvider>
      <AuthGuard />
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
      </Stack>
    </AppProvider>
  );
}

export default RootLayout;
