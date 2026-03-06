import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, Card } from '../../components';
import { Colors, Radius, Spacing, Typography } from '../../constants';
import { useApp } from '../../constants/AppContext';

const quickAmounts = [100, 250, 500, 1000];

export default function AddMoneyModal() {
  const router = useRouter();
  const { paymentMethods, addMoney, wallet } = useApp();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]?.id || '');
  const [success, setSuccess] = useState(false);

  const handleAdd = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0 || !selectedMethod) return;
    addMoney(num, selectedMethod);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); router.back(); }, 2000);
  };

  if (success) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={72} color={Colors.success} />
          <Text style={styles.successTitle}>Money Added!</Text>
          <Text style={styles.successSub}>${parseFloat(amount).toFixed(2)} added to your wallet</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Money</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.balanceNote}>Current Balance: ${wallet?.balance.toFixed(2)}</Text>

        <Text style={styles.label}>Enter Amount</Text>
        <View style={styles.amountRow}>
          <Text style={styles.dollar}>$</Text>
          <Text style={styles.amountText}>{amount || '0'}</Text>
        </View>

        <View style={styles.numpad}>
          {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map((key, i) => (
            <TouchableOpacity
              key={i}
              style={styles.numKey}
              onPress={() => {
                if (key === '⌫') setAmount(a => a.slice(0,-1));
                else if (key === '.' && amount.includes('.')) return;
                else if (amount.length < 8) setAmount(a => a + key);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.numKeyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickAmounts}>
          {quickAmounts.map(q => (
            <TouchableOpacity
              key={q}
              style={[styles.quickBtn, amount === String(q) && styles.quickBtnActive]}
              onPress={() => setAmount(String(q))}
              activeOpacity={0.7}
            >
              <Text style={[styles.quickText, amount === String(q) && styles.quickTextActive]}>
                ${q}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Payment Method</Text>
        {paymentMethods.map(m => (
          <TouchableOpacity
            key={m.id}
            onPress={() => setSelectedMethod(m.id)}
            style={[styles.methodCard, selectedMethod === m.id && styles.methodSelected]}
            activeOpacity={0.8}
          >
            <Ionicons
              name={m.type === 'card' ? 'card-outline' : 'business-outline'}
              size={22}
              color={selectedMethod === m.id ? Colors.primary : Colors.textSecondary}
            />
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>{m.name}</Text>
              {m.last4 && <Text style={styles.methodSub}>•••• {m.last4}</Text>}
            </View>
            <View style={[styles.radio, selectedMethod === m.id && styles.radioSelected]}>
              {selectedMethod === m.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        <Button
          title={`Add $${amount || '0'} to Wallet`}
          onPress={handleAdd}
          disabled={!amount || parseFloat(amount) <= 0}
          size="lg"
          style={{ marginTop: Spacing.xl }}
        />
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
  balanceNote: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.base },
  label: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.base },
  dollar: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: Colors.textSecondary, marginTop: 8 },
  amountText: { fontSize: 52, fontWeight: '800', color: Colors.text, letterSpacing: -2 },
  numpad: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.base },
  numKey: {
    width: '30%',
    paddingVertical: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  numKeyText: { fontSize: Typography.fontSize.xl, fontWeight: '500', color: Colors.text },
  quickAmounts: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl, flexWrap: 'wrap' },
  quickBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    minWidth: 70,
  },
  quickBtnActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  quickText: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.textSecondary },
  quickTextActive: { color: Colors.primary },
  sectionLabel: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.textMuted, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  methodSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  methodInfo: { flex: 1 },
  methodName: { fontSize: Typography.fontSize.base, fontWeight: '600', color: Colors.text },
  methodSub: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.base },
  successTitle: { fontSize: Typography.fontSize.xxxl, fontWeight: '800', color: Colors.text },
  successSub: { fontSize: Typography.fontSize.base, color: Colors.textSecondary },
});
