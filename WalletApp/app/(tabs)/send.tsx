import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, Input, Card } from '../../components';
import { PinInput } from '../../components';
import { Colors, Radius, Spacing, Typography } from '../../constants';
import { useApp } from '../../constants/AppContext';

const contacts = [
  { name: 'Alex Johnson', id: '+1-555-0101', initial: 'A' },
  { name: 'Maria Garcia', id: '+1-555-0102', initial: 'M' },
  { name: 'James Wilson', id: '+1-555-0103', initial: 'J' },
  { name: 'Sarah Lee', id: '+1-555-0104', initial: 'S' },
];

type Step = 'recipient' | 'amount' | 'pin' | 'success';

export default function SendScreen() {
  const router = useRouter();
  const { sendMoney, wallet } = useApp();
  const [step, setStep] = useState<Step>('recipient');
  const [recipient, setRecipient] = useState('');
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleSelectContact = (c: typeof contacts[0]) => {
    setSelectedContact(c);
    setRecipient(c.id);
  };

  const handlePin = (pin: string) => {
    const success = sendMoney(selectedContact?.id || recipient, parseFloat(amount), pin);
    if (success) {
      setStep('success');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 800);
    }
  };

  const reset = () => {
    setStep('recipient');
    setRecipient('');
    setSelectedContact(null);
    setAmount('');
  };

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Money Sent!</Text>
          <Text style={styles.successSub}>
            ${parseFloat(amount).toFixed(2)} sent to {selectedContact?.name || recipient}
          </Text>
          <Card style={styles.receiptCard} padding={Spacing.base}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Amount</Text>
              <Text style={styles.receiptValue}>${parseFloat(amount).toFixed(2)}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>To</Text>
              <Text style={styles.receiptValue}>{selectedContact?.name || recipient}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Status</Text>
              <Text style={[styles.receiptValue, { color: Colors.success }]}>Success</Text>
            </View>
          </Card>
          <Button title="Done" onPress={reset} size="lg" style={{ marginTop: Spacing.xl }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {step === 'pin' ? (
        <View style={styles.pinContainer}>
          <TouchableOpacity onPress={() => setStep('amount')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <PinInput
            length={4}
            onComplete={handlePin}
            title="Enter Wallet PIN"
            subtitle={`Sending $${parseFloat(amount).toFixed(2)} to ${selectedContact?.name || recipient}`}
            error={pinError}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Send Money</Text>

          {step === 'recipient' && (
            <>
              <Input
                label="Recipient Phone / Wallet ID"
                placeholder="+1 (555) 000-0000"
                value={recipient}
                onChangeText={setRecipient}
                keyboardType="phone-pad"
                leftIcon="person-outline"
              />

              <Text style={styles.sectionLabel}>Recent Contacts</Text>
              <View style={styles.contacts}>
                {contacts.map((c, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.contact, selectedContact?.id === c.id && styles.contactSelected]}
                    onPress={() => handleSelectContact(c)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.contactAvatar, selectedContact?.id === c.id && styles.avatarSelected]}>
                      <Text style={[styles.avatarText, selectedContact?.id === c.id && styles.avatarTextSelected]}>
                        {c.initial}
                      </Text>
                    </View>
                    <Text style={styles.contactName} numberOfLines={1}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                title="Next"
                onPress={() => setStep('amount')}
                disabled={!recipient}
                size="lg"
                style={{ marginTop: Spacing.xl }}
              />
            </>
          )}

          {step === 'amount' && (
            <>
              <View style={styles.recipientBadge}>
                <Ionicons name="person-circle" size={20} color={Colors.primary} />
                <Text style={styles.recipientName}>{selectedContact?.name || recipient}</Text>
              </View>

              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>$</Text>
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

              <Text style={styles.balance}>Available: ${wallet?.balance.toFixed(2)}</Text>

              <Button
                title="Continue"
                onPress={() => { if (parseFloat(amount) > 0) setStep('pin'); }}
                disabled={!amount || parseFloat(amount) <= 0}
                size="lg"
              />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.lg },
  pinContainer: { flex: 1, padding: Spacing.xl },
  backBtn: { marginBottom: Spacing.lg },
  sectionLabel: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  contacts: { flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap' },
  contact: { alignItems: 'center', gap: Spacing.sm, width: 72 },
  contactSelected: {},
  contactAvatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  avatarText: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.textSecondary },
  avatarTextSelected: { color: Colors.primary },
  contactName: { fontSize: Typography.fontSize.xs, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  recipientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recipientName: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.primary },
  amountContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  currencySymbol: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: Colors.textSecondary, marginTop: 8 },
  amountText: { fontSize: 56, fontWeight: '800', color: Colors.text, letterSpacing: -2 },
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
  balance: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.base },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  successIcon: { marginBottom: Spacing.base },
  successTitle: { fontSize: Typography.fontSize.xxxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  successSub: { fontSize: Typography.fontSize.base, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  receiptCard: { width: '100%' },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  receiptLabel: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  receiptValue: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.text },
});
