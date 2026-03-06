import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, TransactionItem } from '../../components';
import { Colors, Radius, Spacing, Typography } from '../../constants';
import { useApp } from '../../constants/AppContext';

const quickActions = [
  { icon: 'add-circle-outline' as const, label: 'Add Money', route: '/(modals)/add-money' },
  { icon: 'paper-plane-outline' as const, label: 'Send', route: '/(tabs)/send' },
  { icon: 'qr-code-outline' as const, label: 'Receive', route: '/(modals)/receive' },
  { icon: 'scan-outline' as const, label: 'Scan & Pay', route: '/(tabs)/scan' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, wallet, transactions } = useApp();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const recentTx = transactions.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <Card style={styles.balanceCard} padding={Spacing.xl}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
              <Ionicons
                name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {balanceVisible ? `$${wallet?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
          </Text>
          <View style={styles.walletIdRow}>
            <Ionicons name="card-outline" size={14} color={Colors.white + 'CC'} />
            <Text style={styles.walletId}>ID: {wallet?.id?.toUpperCase() || 'W1'}</Text>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionItem}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon} size={24} color={Colors.primary} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {recentTx.map(tx => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onPress={() => router.push({ pathname: '/(modals)/transaction-detail', params: { id: tx.id } })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  greeting: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  name: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.text },
  notifBtn: { position: 'relative', padding: Spacing.sm },
  notifDot: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
    marginBottom: Spacing.xl,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  balanceLabel: { fontSize: Typography.fontSize.sm, color: Colors.white + 'CC', fontWeight: '600' },
  balanceAmount: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -1,
    marginBottom: Spacing.base,
  },
  walletIdRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  walletId: { fontSize: Typography.fontSize.sm, color: Colors.white + 'CC', fontWeight: '500' },
  section: { marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  seeAll: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', gap: Spacing.sm },
  actionItem: { flex: 1, alignItems: 'center', gap: Spacing.sm },
  actionIcon: {
    width: 64,
    height: 64,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  actionLabel: { fontSize: Typography.fontSize.xs, fontWeight: '600', color: Colors.text, textAlign: 'center' },
});
