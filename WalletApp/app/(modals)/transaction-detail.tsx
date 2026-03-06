import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card } from '../../components';
import { Colors, Radius, Spacing, Typography } from '../../constants';
import { useApp } from '../../constants/AppContext';

const methodConfig = {
  receive: { icon: 'arrow-down-circle' as const, label: 'Received', color: Colors.success },
  send: { icon: 'arrow-up-circle' as const, label: 'Sent', color: Colors.danger },
  add: { icon: 'add-circle' as const, label: 'Added Money', color: Colors.primary },
  pay: { icon: 'scan-circle' as const, label: 'Scan & Pay', color: Colors.warning },
};

export default function TransactionDetailModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions } = useApp();

  const tx = transactions.find(t => t.id === id);
  if (!tx) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text>Transaction not found</Text>
      </SafeAreaView>
    );
  }

  const config = methodConfig[tx.method];
  const isCredit = tx.type === 'credit';

  const formatDate = (d: Date) =>
    new Date(d).toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const details = [
    { label: 'Reference', value: tx.reference },
    { label: 'Date & Time', value: formatDate(tx.createdAt) },
    { label: 'Type', value: config.label },
    { label: 'Status', value: tx.status },
    ...(tx.counterparty ? [{ label: tx.method === 'receive' ? 'From' : 'To', value: tx.counterparty }] : []),
    ...(tx.counterpartyId ? [{ label: 'ID / Phone', value: tx.counterpartyId }] : []),
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction Details</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.amountSection}>
          <View style={[styles.iconWrap, { backgroundColor: config.color + '18' }]}>
            <Ionicons name={config.icon} size={40} color={config.color} />
          </View>
          <Text style={[styles.amount, { color: isCredit ? Colors.success : Colors.text }]}>
            {isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
          </Text>
          <Text style={styles.description}>{tx.description}</Text>
          <View style={[styles.statusBadge, {
            backgroundColor: tx.status === 'success' ? Colors.success + '18' :
              tx.status === 'pending' ? Colors.warning + '18' : Colors.danger + '18'
          }]}>
            <Ionicons
              name={tx.status === 'success' ? 'checkmark-circle' : tx.status === 'pending' ? 'time' : 'close-circle'}
              size={14}
              color={tx.status === 'success' ? Colors.success : tx.status === 'pending' ? Colors.warning : Colors.danger}
            />
            <Text style={[styles.statusText, {
              color: tx.status === 'success' ? Colors.success : tx.status === 'pending' ? Colors.warning : Colors.danger
            }]}>
              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
            </Text>
          </View>
        </View>

        <Card padding={0} style={styles.detailsCard}>
          {details.map((d, i) => (
            <View key={i} style={[styles.detailRow, i < details.length - 1 && styles.detailBorder]}>
              <Text style={styles.detailLabel}>{d.label}</Text>
              <Text style={styles.detailValue}>{d.value}</Text>
            </View>
          ))}
        </Card>

        <TouchableOpacity style={styles.reportBtn}>
          <Ionicons name="flag-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.reportText}>Report an Issue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.text },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  amountSection: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  amount: { fontSize: Typography.fontSize.xxxl, fontWeight: '800', letterSpacing: -1 },
  description: { fontSize: Typography.fontSize.base, color: Colors.textSecondary, textAlign: 'center' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  statusText: { fontSize: Typography.fontSize.sm, fontWeight: '700' },
  detailsCard: { marginBottom: Spacing.xl, overflow: 'hidden' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: Spacing.base, gap: Spacing.base },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailLabel: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, fontWeight: '500', flex: 1 },
  detailValue: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.text, flex: 2, textAlign: 'right' },
  reportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  reportText: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, fontWeight: '500' },
});
