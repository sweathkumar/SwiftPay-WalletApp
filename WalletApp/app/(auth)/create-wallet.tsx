import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, Card } from '../../components';
import { Colors, Radius, Spacing, Typography } from '../../constants';

const features = [
  { icon: 'shield-checkmark-outline' as const, title: 'Bank-grade Security', desc: 'Your funds are protected' },
  { icon: 'flash-outline' as const, title: 'Instant Transfers', desc: 'Send money in seconds' },
  { icon: 'analytics-outline' as const, title: 'Smart Insights', desc: 'Track your spending' },
];

export default function CreateWalletScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Ionicons name="wallet-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Create Your Wallet</Text>
          <Text style={styles.subtitle}>Set up your digital wallet to start sending and receiving money</Text>
        </View>

        <View style={styles.features}>
          {features.map((f, i) => (
            <Card key={i} style={styles.featureCard} padding={Spacing.base}>
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={f.icon} size={22} color={Colors.primary} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            title="Create Wallet"
            onPress={() => router.push('/(auth)/set-pin')}
            size="lg"
          />
          <Text style={styles.footerNote}>No fees to create or maintain your wallet</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.xl, justifyContent: 'space-between' },
  header: { alignItems: 'center', paddingTop: Spacing.xl },
  iconWrap: {
    width: 88,
    height: 88,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: { gap: Spacing.sm },
  featureCard: {},
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureIcon: {
    width: 44,
    height: 44,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: Typography.fontSize.base, fontWeight: '600', color: Colors.text },
  featureDesc: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  footer: { gap: Spacing.md },
  footerNote: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, textAlign: 'center' },
});
