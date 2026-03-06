import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, Card } from '../../components';
import { Colors, Radius, Spacing, Typography } from '../../constants';
import { useApp } from '../../constants/AppContext';

// Simple QR code visual representation
function QRCode({ value }: { value: string }) {
  return (
    <View style={qrStyles.container}>
      <View style={qrStyles.grid}>
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 7 }).map((_, col) => {
            const isFinderPattern =
              (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
            const hash = (row * 7 + col + value.length) % 3;
            return (
              <View
                key={`${row}-${col}`}
                style={[
                  qrStyles.cell,
                  (isFinderPattern || hash === 0) && qrStyles.darkCell,
                ]}
              />
            );
          })
        )}
      </View>
      <View style={[qrStyles.corner, qrStyles.tl]} />
      <View style={[qrStyles.corner, qrStyles.tr]} />
      <View style={[qrStyles.corner, qrStyles.bl]} />
    </View>
  );
}

const qrStyles = StyleSheet.create({
  container: { width: 200, height: 200, backgroundColor: Colors.white, padding: 16, borderRadius: Radius.lg, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: 168, height: 168 },
  cell: { width: 24, height: 24, backgroundColor: 'transparent' },
  darkCell: { backgroundColor: Colors.text },
  corner: { position: 'absolute', width: 48, height: 48, borderColor: Colors.primary, borderWidth: 4, borderRadius: 6 },
  tl: { top: 8, left: 8, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 8, right: 8, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 8, left: 8, borderRightWidth: 0, borderTopWidth: 0 },
});

export default function ReceiveModal() {
  const router = useRouter();
  const { user, wallet } = useApp();

  const walletId = wallet?.id?.toUpperCase() || 'W1';
  const phone = user?.phone || '';

  const handleShare = async () => {
    await Share.share({
      message: `Pay me via SwiftPay!\nWallet ID: ${walletId}\nPhone: ${phone}`,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Receive Money</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.subtitle}>Share your QR code or Wallet ID to receive money</Text>

        <Card style={styles.qrCard} padding={Spacing.xl}>
          <View style={styles.qrWrap}>
            <QRCode value={walletId} />
          </View>
          <View style={styles.userBadge}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.walletId}>ID: {walletId}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or share via</Text>
          <View style={styles.orLine} />
        </View>

        <View style={styles.shareRow}>
          <Card style={styles.idCard} padding={Spacing.base}>
            <Text style={styles.idLabel}>Wallet ID</Text>
            <Text style={styles.idValue}>{walletId}</Text>
          </Card>
          <Card style={styles.idCard} padding={Spacing.base}>
            <Text style={styles.idLabel}>Phone</Text>
            <Text style={styles.idValue}>{phone}</Text>
          </Card>
        </View>

        <Button
          title="Share Payment Details"
          onPress={handleShare}
          size="lg"
          style={{ marginTop: Spacing.xl }}
        />
      </View>
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
  container: { flex: 1, padding: Spacing.xl, alignItems: 'center' },
  subtitle: { fontSize: Typography.fontSize.base, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  qrCard: { alignItems: 'center', width: '100%', marginBottom: Spacing.base },
  qrWrap: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.base,
  },
  userBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.white },
  userName: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.text },
  walletId: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  orRow: { flexDirection: 'row', alignItems: 'center', width: '100%', gap: Spacing.base, marginVertical: Spacing.base },
  orLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, fontWeight: '500' },
  shareRow: { flexDirection: 'row', gap: Spacing.sm, width: '100%' },
  idCard: { flex: 1 },
  idLabel: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, fontWeight: '600', marginBottom: 4 },
  idValue: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.text },
});
