import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMultiNetwork } from '../state/MultiNetworkContext';
import { MultiNetworkAPIManager } from '../services/MobileMoneyAPI';
import { useTheme } from '../context/ThemeContext';

export default function UnifiedDashboard() {
  const { theme } = useTheme();
  const {
    accounts,
    transactions,
    networks,
    getTotalBalance,
    getTransactionsByNetwork,
    addTransaction
  } = useMultiNetwork();

  const [refreshing, setRefreshing] = useState(false);
  const [balances, setBalances] = useState({});
  const [apiManager] = useState(() => new MultiNetworkAPIManager());

  useEffect(() => {
    loadBalances();
  }, [accounts]);

  const loadBalances = async () => {
    const accountIds = {};
    Object.keys(networks).forEach(networkId => {
      const networkAccounts = accounts[networkId.toLowerCase()] || [];
      if (networkAccounts.length > 0) {
        accountIds[networkId.toLowerCase()] = networkAccounts[0].id;
      }
    });

    const balanceResults = await apiManager.getAllBalances(accountIds);
    setBalances(balanceResults);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBalances();
    setRefreshing(false);
  };

  const getNetworkBalance = (networkId) => {
    const result = balances[networkId.toLowerCase()];
    return result?.success ? result.balance : getTotalBalance(networkId.toLowerCase());
  };

  const totalBalance = Object.keys(networks).reduce((total, networkId) => {
    return total + (getNetworkBalance(networkId.toLowerCase()) || 0);
  }, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.totalBalanceCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.totalBalanceLabel, { color: theme.textSecondary }]}>Total Balance</Text>
        <Text style={[styles.totalBalanceAmount, { color: theme.text }]}>GHS {totalBalance.toFixed(2)}</Text>
      </View>

      <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.statsTitle, { color: theme.text }]}>Today's Activity</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {transactions.filter(t => {
                const today = new Date().toDateString();
                return new Date(t.timestamp || t.date).toDateString() === today;
              }).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Transactions</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  totalBalanceCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalBalanceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
});