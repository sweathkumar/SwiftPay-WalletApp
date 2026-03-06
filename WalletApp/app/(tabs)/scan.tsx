import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../../constants';
import { Button, Card } from '../../components';

export default function ScanScreen() {
  const [scanned, setScanned] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleScan = () => {
    setTimeout(() => {
      setScanned(true);
    }, 1000);
  };

  const handlePay = () => {
    setPaid(true);
    setTimeout(() => {
      setScanned(false);
      setPaid(false);
    }, 2500);
  };

  if (paid) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={72} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Payment Successful</Text>
          <Text style={styles.successSub}>$24.99 paid to Blue Bottle Coffee</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Scan & Pay</Text>
        <Text style={styles.subtitle}>Point your camera at a QR code to pay</Text>

        <View style={styles.scannerFrame}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            {!scanned && (
              <View style={styles.scannerInner}>
                <Ionicons name="scan" size={48} color={Colors.primary + '80'} />
                <Text style={styles.scannerHint}>Align QR code here</Text>
              </View>
            )}
            {scanned && (
              <View style={styles.detectedWrap}>
                <Ionicons name="checkmark-circle" size={36} color={Colors.success} />
                <Text style={styles.detectedText}>QR Detected</Text>
              </View>
            )}
          </View>
        </View>

        {scanned ? (
          <Card style={styles.payCard} padding={Spacing.base}>
            <Text style={styles.payMerchant}>Blue Bottle Coffee</Text>
            <Text style={styles.payAmount}>$24.99</Text>
            <Button title="Pay Now" onPress={handlePay} size="lg" style={{ marginTop: Spacing.base }} />
            <Button
              title="Cancel"
              onPress={() => setScanned(false)}
              variant="ghost"
              size="md"
              style={{ marginTop: Spacing.sm }}
            />
          </Card>
        ) : (
          <View style={styles.actions}>
            <Button title="Simulate Scan" onPress={handleScan} size="lg" />
            <TouchableOpacity style={styles.flashBtn}>
              <Ionicons name="flash-outline" size={22} color={Colors.primary} />
              <Text style={styles.flashText}>Toggle Flash</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.xl, alignItems: 'center' },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  subtitle: { fontSize: Typography.fontSize.base, color: Colors.textSecondary, marginBottom: Spacing.xl },
  scannerFrame: {
    width: 280,
    height: 280,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  scanArea: { width: 220, height: 220, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: Colors.primary, borderWidth: 3 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 4 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 4 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 4 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 4 },
  scannerInner: { alignItems: 'center', gap: Spacing.sm },
  scannerHint: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, fontWeight: '500' },
  detectedWrap: { alignItems: 'center', gap: Spacing.sm },
  detectedText: { fontSize: Typography.fontSize.base, color: Colors.success, fontWeight: '700' },
  payCard: { width: '100%' },
  payMerchant: { fontSize: Typography.fontSize.base, color: Colors.textSecondary, fontWeight: '500', textAlign: 'center' },
  payAmount: { fontSize: Typography.fontSize.xxxl, fontWeight: '800', color: Colors.text, textAlign: 'center', marginTop: Spacing.xs },
  actions: { width: '100%', gap: Spacing.base },
  flashBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  flashText: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.base },
  successIcon: {},
  successTitle: { fontSize: Typography.fontSize.xxl, fontWeight: '800', color: Colors.text },
  successSub: { fontSize: Typography.fontSize.base, color: Colors.textSecondary },
});
