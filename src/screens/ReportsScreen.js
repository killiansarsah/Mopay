import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppContext } from '../state/AppContext';
import { spacing } from '../theme/tokens';

export default function ReportsScreen() {
  const { transactions } = useContext(AppContext);
  const total = transactions.reduce((s, t) => s + Number(t.amount || 0), 0).toFixed(2);

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc', padding: spacing.md }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Reports & Analytics</Text>
      <View style={styles.card}>
        <Text style={{ color: '#6b7280' }}>Total Earnings</Text>
        <Text style={{ fontSize: 28, fontWeight: '800' }}>GHS {total}</Text>
      </View>
      <View style={styles.card}>
        <Text style={{ color: '#6b7280' }}>Transactions</Text>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>{transactions.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: spacing.md, borderRadius: 12, marginBottom: spacing.md },
});
