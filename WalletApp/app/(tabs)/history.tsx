import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { TransactionItem } from '../../components';
import { Colors, Radius, Spacing, Typography } from '../../constants';
import { useApp } from '../../constants/AppContext';
import { TransactionMethod } from '../../models';

const filters: { label: string; value: TransactionMethod | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Sent', value: 'send' },
  { label: 'Received', value: 'receive' },
  { label: 'Added', value: 'add' },
  { label: 'Paid', value: 'pay' },
];

export default function HistoryScreen() {
  const router = useRouter();
  const { transactions } = useApp();
  const [filter, setFilter] = useState<TransactionMethod | 'all'>('all');

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.method === filter);

  const totalIn = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Transaction History</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: Colors.success + '40', backgroundColor: Colors.success + '0D' }]}>
            <Text style={styles.summaryLabel}>Total In</Text>
            <Text style={[styles.summaryAmount, { color: Colors.success }]}>+${totalIn.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: Colors.danger + '40', backgroundColor: Colors.danger + '0D' }]}>
            <Text style={styles.summaryLabel}>Total Out</Text>
            <Text style={[styles.summaryAmount, { color: Colors.danger }]}>-${totalOut.toFixed(2)}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filters}>
            {filters.map(f => (
              <TouchableOpacity
                key={f.value}
                style={[styles.filterBtn, filter === f.value && styles.filterBtnActive]}
                onPress={() => setFilter(f.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.list}>
          {filtered.length === 0 ? (
            <Text style={styles.empty}>No transactions found</Text>
          ) : (
            filtered.map(tx => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onPress={() => router.push({ pathname: '/(modals)/transaction-detail', params: { id: tx.id } })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.base },
  summaryRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.base },
  summaryCard: {
    flex: 1,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  summaryLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, fontWeight: '600', marginBottom: 4 },
  summaryAmount: { fontSize: Typography.fontSize.lg, fontWeight: '800' },
  filterScroll: { marginBottom: Spacing.base },
  filters: { flexDirection: 'row', gap: Spacing.sm, paddingRight: Spacing.base },
  filterBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  list: {},
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: Spacing.xl, fontSize: Typography.fontSize.base },
});
