import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, Input } from '../../components';
import { Colors, Radius, Spacing, Typography } from '../../constants';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleContinue = () => {
    if (phone.length >= 7) {
      router.push({ pathname: '/(auth)/otp', params: { phone, mode } });
    }
  };

  const handleGoogle = () => {
    router.push({ pathname: '/(auth)/otp', params: { phone: 'google', mode } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Ionicons name="wallet" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.brand}>SwiftPay</Text>
          <Text style={styles.tagline}>Your money, simplified</Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, mode === 'login' && styles.tabActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'signup' && styles.tabActive]}
            onPress={() => setMode('signup')}
          >
            <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon="call-outline"
          />

          <Button
            title="Continue with Phone"
            onPress={handleContinue}
            disabled={phone.length < 7}
            size="lg"
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity onPress={handleGoogle} style={styles.googleBtn} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={20} color={Colors.primary} />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: Spacing.xl, paddingTop: Spacing.xxxl + Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing.xxxl },
  logoWrap: {
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
  brand: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: Typography.fontSize.base, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  form: { gap: Spacing.md },
  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, fontWeight: '500' },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  googleText: { fontSize: Typography.fontSize.base, fontWeight: '600', color: Colors.primary },
  terms: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
    lineHeight: 20,
  },
  link: { color: Colors.primary, fontWeight: '600' },
});
