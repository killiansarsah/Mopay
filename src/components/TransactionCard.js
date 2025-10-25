import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { spacing, colors } from '../theme/tokens';
import { useTheme } from '../context/ThemeContext';

// Status color scheme
const statusColors = {
  Success: '#22c55e',    // Green
  Pending: '#f59e0b',    // Orange/Yellow
  Failed: '#ef4444'      // Red
};

// Status icons
const statusIcons = {
  Success: 'check-circle',
  Pending: 'schedule',
  Failed: 'error'
};

export default function TransactionCard({ tx }) {
  const { theme } = useTheme();
  const statusColor = statusColors[tx.status] || colors.muted;
  const statusIcon = statusIcons[tx.status] || 'help';
  const isCashIn = tx.type === 'Cash In' || tx.type === 'cash_in';
  const amountPrefix = isCashIn ? '+' : '-';
  const amountColor = isCashIn ? '#22c55e' : '#ef4444';
  
  // Format transaction type for display
  const displayType = tx.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <View style={styles.typeRow}>
            <View style={[styles.typeIcon, { backgroundColor: `${isCashIn ? '#22c55e' : '#ef4444'}15` }]}>
              <MaterialIcons 
                name={isCashIn ? 'add' : 'remove'} 
                size={16} 
                color={isCashIn ? '#22c55e' : '#ef4444'} 
              />
            </View>
            <Text style={[styles.type, { color: theme.text }]}>{displayType}</Text>
          </View>
          <Text style={[styles.phone, { color: theme.textSecondary }]}>{tx.phone}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {amountPrefix}GHS {tx.amount}
          </Text>
          <View style={styles.statusRow}>
            <MaterialIcons 
              name={statusIcon} 
              size={14} 
              color={statusColor} 
            />
            <Text style={[styles.status, { color: statusColor }]}>{tx.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#fff', 
    padding: spacing.md, 
    borderRadius: 12, 
    marginBottom: spacing.sm, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  leftSection: {
    flex: 1
  },
  rightSection: {
    alignItems: 'flex-end'
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  type: { 
    fontWeight: '600',
    fontSize: 15,
    color: '#111827'
  },
  amount: { 
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4
  },
  phone: { 
    color: colors.muted,
    fontSize: 13
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  status: { 
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4
  }
});
