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
        accountIds[networkId.toLowerCase()] = networkAccounts[0].id; // Use first account
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

  const renderNetworkCard = (networkKey) => {
    const network = networks[networkKey];
    const networkAccounts = accounts[network.id] || [];
    const networkTransactions = getTransactionsByNetwork(network.id);
    const balance = getNetworkBalance(network.id);

    return (
      <View key={network.id} style={[styles.networkCard, { backgroundColor: theme.card }]}>
        <View style={styles.networkHeader}>
          <View style={[styles.networkIcon, { backgroundColor: network.color }]}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#fff" />
          </View>
          <View style={styles.networkInfo}>
            <Text style={[styles.networkName, { color: theme.text }]}>{network.name}</Text>
            <Text style={[styles.accountCount, { color: theme.textSecondary }]}>
              {networkAccounts.length} account{networkAccounts.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MaterialIcons name="more-vert" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceSection}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Total Balance</Text>
          <Text style={[styles.balanceAmount, { color: theme.text }]}>GHS {balance?.toFixed(2) || '0.00'}</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="send" size={20} color="#007bff" />
            <Text style={[styles.actionText, { color: theme.textSecondary }]}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="call-received" size={20} color="#28a745" />
            <Text style={[styles.actionText, { color: theme.textSecondary }]}>Cash In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="call-made" size={20} color="#dc3545" />
            <Text style={[styles.actionText, { color: theme.textSecondary }]}>Cash Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="phone-android" size={20} color="#ffc107" />
            <Text style={[styles.actionText, { color: theme.textSecondary }]}>Airtime</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentTransactions}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
          {networkTransactions.slice(0, 3).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <MaterialIcons
                  name={
                    transaction.type === 'cash_in' ? 'call-received' :
                    transaction.type === 'cash_out' ? 'call-made' :
                    transaction.type === 'send_money' ? 'send' :
                    'receipt'
                  }
                  size={20}
                  color={
                    transaction.type === 'cash_in' ? '#28a745' :
                    transaction.type === 'cash_out' ? '#dc3545' :
                    '#007bff'
                  }
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionType, { color: theme.text }]}>
                  {transaction.type === 'cash_in' ? 'Cash In' :
                   transaction.type === 'cash_out' ? 'Cash Out' :
                   transaction.type === 'send_money' ? 'Send Money' :
                   'Transaction'}
                </Text>
                <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                {
                  color: transaction.type === 'cash_in' ? '#28a745' :
                         transaction.type === 'cash_out' ? '#dc3545' :
                         '#007bff'
                }
              ]}>
                {transaction.type === 'cash_in' ? '+' : '-'}GHS {transaction.amount?.toFixed(2)}
              </Text>
            </View>
          ))}
          {networkTransactions.length === 0 && (
            <Text style={[styles.noTransactions, { color: theme.textSecondary }]}>No recent transactions</Text>
          )}
        </View>
      </View>
    );
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
      {/* Total Balance Overview */}
      <View style={[styles.totalBalanceCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.totalBalanceLabel, { color: theme.textSecondary }]}>Total Balance Across All Networks</Text>
        <Text style={[styles.totalBalanceAmount, { color: theme.text }]}>GHS {totalBalance.toFixed(2)}</Text>
        <View style={styles.networkBreakdown}>
          {Object.keys(networks).map((networkId) => {
            const balance = getNetworkBalance(networkId.toLowerCase()) || 0;
            const percentage = totalBalance > 0 ? (balance / totalBalance) * 100 : 0;

            return (
              <View key={networkId} style={styles.networkBalance}>
                <View style={[styles.networkIndicator, { backgroundColor: networks[networkId].color }]} />
                <Text style={[styles.networkBalanceText, { color: theme.textSecondary }]}>
                  {networks[networkId].name}: GHS {balance.toFixed(2)} ({percentage.toFixed(1)}%)
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Network Cards */}
      {Object.keys(networks).map((networkId) => renderNetworkCard(networkId))}

      {/* Quick Stats */}
      <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.statsTitle, { color: theme.text }]}>Today's Activity</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{transactions.filter(t => {
              const today = new Date().toDateString();
              return new Date(t.timestamp).toDateString() === today;
            }).length}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Transactions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {transactions.filter(t => {
                const today = new Date().toDateString();
                return new Date(t.timestamp).toDateString() === today && t.type === 'cash_in';
              }).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Cash Ins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {transactions.filter(t => {
                const today = new Date().toDateString();
                return new Date(t.timestamp).toDateString() === today && t.type === 'cash_out';
              }).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Cash Outs</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  totalBalanceCard: {
    backgroundColor: '#fff',
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
    color: '#666',
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  networkBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  networkBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  networkIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  networkBalanceText: {
    fontSize: 14,
    color: '#666',
  },
  networkCard: {
    backgroundColor: '#fff',
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
  networkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  networkIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  networkInfo: {
    flex: 1,
  },
  networkName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  accountCount: {
    fontSize: 14,
    color: '#666',
  },
  moreButton: {
    padding: 8,
  },
  balanceSection: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  recentTransactions: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  noTransactions: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  statsCard: {
    backgroundColor: '#fff',
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
    color: '#333',
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
    color: '#666',
    marginTop: 4,
  },
});