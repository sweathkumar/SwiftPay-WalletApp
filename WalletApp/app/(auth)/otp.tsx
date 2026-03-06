import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '../../components';
import { Colors, Radius, Spacing, Typography } from '../../constants';
import { useApp } from '../../constants/AppContext';

export default function OTPScreen() {
  const router = useRouter();
  const { phone, mode } = useLocalSearchParams<{ phone: string; mode: string }>();
  const { login } = useApp();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const refs = useRef<TextInput[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);
    if (text && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the 6-digit code'); return; }
    // Mock verify: any 6-digit code works
    login(phone || '+1-555-0000');
    router.replace('/(auth)/create-wallet');
  };

  const handleResend = () => {
    setCountdown(30);
    setOtp(['', '', '', '', '', '']);
    refs.current[0]?.focus();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            {phone === 'google' ? 'Check your Google account email' : `We sent a code to ${phone}`}
          </Text>
        </View>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={r => { if (r) refs.current[i] = r; }}
              style={[styles.otpBox, digit && styles.otpBoxFilled, error ? styles.otpBoxError : null]}
              value={digit}
              onChangeText={t => handleChange(t, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              autoFocus={i === 0}
            />
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.hint}>Demo: enter any 6 digits</Text>

        <Button title="Verify & Continue" onPress={handleVerify} size="lg" style={styles.btn} />

        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive code? </Text>
          {countdown > 0 ? (
            <Text style={styles.countdown}>Resend in {countdown}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.xl },
  back: { marginBottom: Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing.xxxl },
  iconWrap: {
    width: 72,
    height: 72,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  otpRow: { flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center', marginBottom: Spacing.base },
  otpBox: {
    width: 50,
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  otpBoxError: { borderColor: Colors.danger },
  error: { color: Colors.danger, textAlign: 'center', marginBottom: Spacing.sm, fontWeight: '500' },
  hint: { color: Colors.textMuted, textAlign: 'center', fontSize: Typography.fontSize.sm, marginBottom: Spacing.xl },
  btn: { marginBottom: Spacing.lg },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resendLabel: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  countdown: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  resendLink: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '700' },
});
