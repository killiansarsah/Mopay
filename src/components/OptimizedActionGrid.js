import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const actions = [
  { key: 'cashin', label: 'Cash In', icon: 'account-balance-wallet', colors: ['#22c55e', '#16a34a'] },
  { key: 'cashout', label: 'Cash Out', icon: 'payments', colors: ['#ef4444', '#dc2626'] },
  { key: 'airtime', label: 'Airtime', icon: 'phone', colors: ['#3b82f6', '#2563eb'] },
  { key: 'ussd', label: 'Custom USSD', icon: 'dialpad', colors: ['#8b5cf6', '#7c3aed'] },
  { key: 'merchant', label: 'Pay Merchant', icon: 'storefront', colors: ['#f59e0b', '#d97706'] },
  { key: 'commission', label: 'Commission', icon: 'receipt-long', colors: ['#06b6d4', '#0891b2'] },
  { key: 'balance', label: 'Check Balance', icon: 'account-balance-wallet', colors: ['#068cf9', '#0369a1'] },
];

export default function OptimizedActionGrid({ onPress = () => {} }) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {actions.map((action, index) => (
          <TouchableOpacity 
            key={action.key} 
            style={[styles.actionButton, index === 6 && styles.fullWidthButton]}
            onPress={() => onPress(action)}
            activeOpacity={0.8}
          >
            <LinearGradient colors={action.colors} style={styles.gradient}>
              <MaterialIcons name={action.icon} size={20} color="#ffffff" />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    width: (width - 40) / 2 - 4, // 2 columns with gaps
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidthButton: {
    width: '100%',
    height: 56,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  actionLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
  },
});