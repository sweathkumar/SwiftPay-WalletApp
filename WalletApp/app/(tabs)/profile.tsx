import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card } from '../../components';
import { Colors, Radius, Spacing, Typography } from '../../constants';
import { useApp } from '../../constants/AppContext';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, wallet, logout } = useApp();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Personal Info', onPress: () => {} },
        { icon: 'card-outline', label: 'Payment Methods', onPress: () => router.push('/(modals)/add-money') },
        { icon: 'shield-outline', label: 'Security', onPress: () => {} },
        { icon: 'notifications-outline', label: 'Notifications', onPress: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help Center', onPress: () => {} },
        { icon: 'chatbubble-outline', label: 'Contact Us', onPress: () => {} },
        { icon: 'document-text-outline', label: 'Terms & Privacy', onPress: () => {} },
      ],
    },
    {
      title: '',
      items: [
        { icon: 'log-out-outline', label: 'Logout', onPress: handleLogout, danger: true },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* User Card */}
        <Card style={styles.userCard} padding={Spacing.lg}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userPhone}>{user?.phone}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={12} color={Colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Wallet Info */}
        <Card style={styles.walletCard} padding={Spacing.base}>
          <View style={styles.walletRow}>
            <View style={styles.walletItem}>
              <Text style={styles.walletLabel}>Wallet ID</Text>
              <Text style={styles.walletValue}>{wallet?.id?.toUpperCase()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.walletItem}>
              <Text style={styles.walletLabel}>Currency</Text>
              <Text style={styles.walletValue}>{wallet?.currency || 'USD'}</Text>
            </View>
          </View>
        </Card>

        {/* Menu Sections */}
        {menuSections.map((section, si) => (
          <View key={si} style={styles.section}>
            {section.title ? <Text style={styles.sectionTitle}>{section.title}</Text> : null}
            <Card padding={0} style={styles.menuCard}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  onPress={item.onPress}
                  style={[
                    styles.menuItem,
                    ii < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIcon, item.danger && styles.menuIconDanger]}>
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={item.danger ? Colors.danger : Colors.primary}
                    />
                  </View>
                  <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                    {item.label}
                  </Text>
                  {!item.danger && (
                    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        <Text style={styles.version}>SwiftPay v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.base },
  userCard: { marginBottom: Spacing.sm },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: Typography.fontSize.xxl, fontWeight: '800', color: Colors.white },
  userInfo: { flex: 1 },
  userName: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.text },
  userPhone: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
    backgroundColor: Colors.success + '18',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  verifiedText: { fontSize: Typography.fontSize.xs, color: Colors.success, fontWeight: '700' },
  walletCard: { marginBottom: Spacing.base },
  walletRow: { flexDirection: 'row', alignItems: 'center' },
  walletItem: { flex: 1, alignItems: 'center' },
  walletLabel: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, fontWeight: '600', marginBottom: 4 },
  walletValue: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.text },
  divider: { width: 1, height: 40, backgroundColor: Colors.border },
  section: { marginBottom: Spacing.base },
  sectionTitle: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.textMuted, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.8 },
  menuCard: { overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: { backgroundColor: Colors.danger + '18' },
  menuLabel: { flex: 1, fontSize: Typography.fontSize.base, fontWeight: '500', color: Colors.text },
  menuLabelDanger: { color: Colors.danger },
  version: { textAlign: 'center', fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: Spacing.base },
});
