import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, colors } from '../theme/tokens';

export default function TransactionCard({ tx }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.type}>{tx.type}</Text>
        <Text style={[styles.amount, tx.status !== 'Success' && { color: colors.muted }]}>GHS {tx.amount}</Text>
      </View>
      <View style={styles.rowSmall}>
        <Text style={styles.phone}>{tx.phone}</Text>
        <Text style={styles.status}>{tx.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: spacing.md, borderRadius: 10, marginBottom: spacing.sm, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowSmall: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  type: { fontWeight: '700' },
  amount: { fontWeight: '700' },
  phone: { color: colors.muted },
  status: { color: colors.muted },
});
