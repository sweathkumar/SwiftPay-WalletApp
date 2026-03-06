import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../models';
import { Colors, Radius, Spacing, Typography } from '../constants';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

const methodConfig = {
  receive: { icon: 'arrow-down-circle' as const, label: 'Received', color: Colors.success },
  send: { icon: 'arrow-up-circle' as const, label: 'Sent', color: Colors.danger },
  add: { icon: 'add-circle' as const, label: 'Added', color: Colors.primary },
  pay: { icon: 'scan-circle' as const, label: 'Paid', color: Colors.warning },
};

const statusColors = {
  success: Colors.success,
  pending: Colors.warning,
  failed: Colors.danger,
};

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const config = methodConfig[transaction.method];
  const isCredit = transaction.type === 'credit';

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      <View style={[styles.iconWrap, { backgroundColor: config.color + '18' }]}>
        <Ionicons name={config.icon} size={24} color={config.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>{transaction.description}</Text>
        <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isCredit ? Colors.success : Colors.text }]}>
          {isCredit ? '+' : '-'}${transaction.amount.toFixed(2)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[transaction.status] + '18' }]}>
          <Text style={[styles.statusText, { color: statusColors[transaction.status] }]}>
            {transaction.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: { flex: 1 },
  description: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  date: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  right: { alignItems: 'flex-end' },
  amount: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
