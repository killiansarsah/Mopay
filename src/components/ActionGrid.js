import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { spacing } from '../theme/tokens';


const actions = [
  {
    key: 'cashin',
    label: 'Cash In',
    icon: 'account-balance-wallet',
    colors: ['#34d399', '#059669'],
  },
  {
    key: 'cashout',
    label: 'Cash Out',
    icon: 'payments',
    colors: ['#f87171', '#b91c1c'],
  },
  {
    key: 'airtime',
    label: 'Airtime Transfer',
    icon: 'phone-iphone',
    colors: ['#60a5fa', '#2563eb'],
  },
  {
    key: 'ussd',
    label: 'Custom USSD',
    icon: 'dialpad',
    colors: ['#a78bfa', '#7c3aed'],
  },
  {
    key: 'merchant',
    label: 'Pay to Merchant',
    icon: 'storefront',
    colors: ['#fb923c', '#ea580c'],
  },
  {
    key: 'commission',
    label: 'Commission',
    icon: 'receipt-long',
    colors: ['#2dd4bf', '#0d9488'],
  },
];

const checkBalance = {
  key: 'balance',
  label: 'Check Balance',
  icon: 'account-balance',
  colors: ['#6366f1', '#3730a3'],
};

export default function ActionGrid({ onPress = () => {} }) {
  return (
    <>
      <View style={styles.grid}>
        {actions.map((a) => (
          <TouchableOpacity key={a.key} style={styles.card} onPress={() => onPress(a)}>
            <LinearGradient colors={a.colors} style={styles.inner}>
              <MaterialIcons name={a.icon} size={32} color="#fff" />
              <Text style={styles.label}>{a.label}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.balanceCard} onPress={() => onPress(checkBalance)}>
        <LinearGradient colors={checkBalance.colors} style={styles.balanceInner}>
          <MaterialIcons name={checkBalance.icon} size={32} color="#fff" />
          <Text style={styles.balanceLabel}>{checkBalance.label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: spacing.md,
  },
  card: {
    width: '48%',
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  inner: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  label: {
    color: '#fff',
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  balanceCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: spacing.md,
  },
  balanceInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
  },
  balanceLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 12,
    letterSpacing: 0.1,
  },
});
