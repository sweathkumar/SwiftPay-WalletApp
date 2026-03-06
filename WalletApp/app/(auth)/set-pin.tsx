import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { PinInput } from '../../components';
import { Colors, Spacing, Typography } from '../../constants';
import { useApp } from '../../constants/AppContext';

export default function SetPinScreen() {
  const router = useRouter();
  const { createWallet } = useApp();
  const [step, setStep] = useState<'set' | 'confirm'>('set');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState(false);

  const handlePin = (pin: string) => {
    if (step === 'set') {
      setFirstPin(pin);
      setStep('confirm');
    } else {
      if (pin === firstPin) {
        createWallet(pin);
        router.replace('/(tabs)');
      } else {
        setError(true);
        setTimeout(() => { setError(false); setStep('set'); setFirstPin(''); }, 800);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.progress}>
          <View style={[styles.dot, step === 'set' && styles.dotActive]} />
          <View style={styles.line} />
          <View style={[styles.dot, step === 'confirm' && styles.dotActive]} />
        </View>

        <PinInput
          length={4}
          onComplete={handlePin}
          title={step === 'set' ? 'Set Wallet PIN' : 'Confirm PIN'}
          subtitle={step === 'set' ? 'Choose a 4-digit PIN to secure your wallet' : 'Enter the PIN again to confirm'}
          error={error}
        />

        {error && (
          <Text style={styles.errorText}>PINs don't match. Please try again.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.xl },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  dotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  line: { width: 40, height: 2, backgroundColor: Colors.border },
  errorText: {
    color: Colors.danger,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: Typography.fontSize.base,
  },
});
