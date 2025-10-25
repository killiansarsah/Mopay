import React, { useState, useMemo, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import FilterDropdown from '../components/FilterDropdown';
import { useTheme } from '../context/ThemeContext';
import { AppContext } from '../state/AppContext';

// Generate 100+ realistic Ghanaian transactions for history
const generateHistoryTransactions = () => {
  const networkPrefixes = {
    MTN: ['024', '054', '055', '059'],
    AirtelTigo: ['027', '057', '026', '056'],
    Vodafone: ['020', '050', '023', '053']
  };
  
  const transactionTypes = [
    { type: 'Cash In', icon: 'south-west', color: '#22c55e' },
    { type: 'Cash Out', icon: 'north-east', color: '#ef4444' },
    { type: 'Send Money', icon: 'send', color: '#068cf9' },
    { type: 'Buy Airtime', icon: 'phone', color: '#8b5cf6' },
    { type: 'Bill Payment', icon: 'receipt-long', color: '#f59e0b' }
  ];
  
  const statuses = ['Success', 'Pending', 'Failed'];
  
  const generatePhone = () => {
    const networks = Object.keys(networkPrefixes);
    const network = networks[Math.floor(Math.random() * networks.length)];
    const prefix = networkPrefixes[network][Math.floor(Math.random() * networkPrefixes[network].length)];
    const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return `${prefix}${suffix}`;
  };
  
  const generateAmount = (type) => {
    const ranges = {
      'Cash In': [20, 2000],
      'Cash Out': [10, 1500],
      'Send Money': [5, 800],
      'Buy Airtime': [2, 100],
      'Bill Payment': [25, 500]
    };
    const [min, max] = ranges[type] || [5, 500];
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  };
  
  return Array.from({ length: 120 }, (_, i) => {
    const txType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const amount = generateAmount(txType.type);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const hoursAgo = Math.floor(Math.random() * 2160); // Up to 90 days
    
    return {
      id: `hist_${(i + 1).toString().padStart(3, '0')}`,
      type: txType.type,
      amount,
      phone: txType.type !== 'Bill Payment' ? generatePhone() : null,
      transactionId: txType.type === 'Bill Payment' ? `BILL${Math.floor(Math.random() * 100000)}` : null,
      status,
      date: new Date(Date.now() - hoursAgo * 1000 * 60 * 60).toISOString(),
      icon: txType.icon,
      color: txType.color
    };
  });
};

const mockTransactions = generateHistoryTransactions();

const statusColors = {
  Success: '#22c55e',
  Failed: '#ef4444',
  Pending: '#f59e0b'
};

export default function HistoryScreen({ navigation }) {
  const { theme } = useTheme();
  const { transactions } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedTransactionType, setSelectedTransactionType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced Date Range options (chronological order - most recent to oldest)
  const dateRangeOptions = [
    { label: 'All Time', value: 'all', icon: 'all-inclusive' },
    { label: 'Last 7 days', value: '7days', icon: 'date-range' },
    { label: 'Last 30 days', value: '30days', icon: 'date-range' },
    { label: 'Last 3 months', value: '3months', icon: 'calendar-today' },
    { label: 'Last 6 months', value: '6months', icon: 'calendar-today' },
    { label: 'Last year', value: '1year', icon: 'calendar-view-year' },
    { label: 'Custom date range', value: 'custom', icon: 'edit-calendar' },
  ];

  const transactionTypeOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Cash In', value: 'Cash In' },
    { label: 'Cash Out', value: 'Cash Out' },
    { label: 'Bill Payment', value: 'Bill Payment' },
    { label: 'Airtime', value: 'Airtime' },
  ];

  // Combine global transactions with mock data and filter
  const allTransactions = useMemo(() => {
    const combinedTransactions = [...transactions, ...mockTransactions];
    // Remove duplicates and sort by date (most recent first)
    const uniqueTransactions = combinedTransactions.filter((tx, index, self) => 
      index === self.findIndex(t => t.id === tx.id)
    );
    return uniqueTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  // Add icon and color to transactions that don't have them
  const addIconsToTransactions = (transactions) => {
    return transactions.map(tx => {
      if (tx.icon && tx.color) return tx;
      
      const iconMap = {
        'Cash In': { icon: 'call-received', color: '#22c55e' },
        'cash_in': { icon: 'call-received', color: '#22c55e' },
        'Cash Out': { icon: 'call-made', color: '#ef4444' },
        'cash_out': { icon: 'call-made', color: '#ef4444' },
        'Send Money': { icon: 'send', color: '#068cf9' },
        'send_money': { icon: 'send', color: '#068cf9' },
        'Buy Airtime': { icon: 'phone-android', color: '#8b5cf6' },
        'buy_airtime': { icon: 'phone-android', color: '#8b5cf6' },
        'Airtime': { icon: 'phone-android', color: '#8b5cf6' },
        'Bill Payment': { icon: 'receipt', color: '#f59e0b' },
        'pay_bills': { icon: 'receipt', color: '#f59e0b' }
      };
      
      const iconData = iconMap[tx.type] || { icon: 'account-balance-wallet', color: '#6b7280' };
      return { ...tx, ...iconData };
    });
  };

  // Filter transactions based on selected criteria
  const filteredTransactions = useMemo(() => {
    let filtered = addIconsToTransactions(allTransactions);

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(tx => 
        tx.phone?.includes(searchQuery) ||
        tx.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Transaction type filter
    if (selectedTransactionType !== 'all') {
      filtered = filtered.filter(tx => tx.type === selectedTransactionType);
    }

    // Date range filter
    if (selectedDateRange !== 'all') {
      const now = new Date();
      const txDate = (dateStr) => new Date(dateStr);
      
      filtered = filtered.filter(tx => {
        const date = txDate(tx.date);
        switch (selectedDateRange) {
          case '7days':
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return date >= sevenDaysAgo;
          case '30days':
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return date >= thirtyDaysAgo;
          case '3months':
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
            return date >= threeMonthsAgo;
          case '6months':
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
            return date >= sixMonthsAgo;
          case '1year':
            const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            return date >= oneYearAgo;
          case 'custom':
            // TODO: Implement custom date picker
            return true;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [allTransactions, searchQuery, selectedDateRange, selectedTransactionType]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }) + ', ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatAmount = (amount, type) => {
    const sign = type === 'Cash In' ? '+' : '-';
    return `${sign} $${amount.toFixed(2)}`;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDateRange('all');
    setSelectedTransactionType('all');
  };

  const hasActiveFilters = selectedDateRange !== 'all' || selectedTransactionType !== 'all' || searchQuery.trim();

  const renderTransaction = ({ item }) => (
    <View style={[styles.transactionItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
      <View style={styles.transactionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color || '#6b7280'}20` }]}>
          <MaterialIcons name={item.icon || 'account-balance-wallet'} size={24} color={item.color || '#6b7280'} />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={[styles.transactionType, { color: theme.text }]}>{item.type}</Text>
          <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>{formatDate(item.date)}</Text>
          <Text style={[styles.transactionInfo, { color: theme.textSecondary }]}>
            {item.phone ? `${item.type === 'Cash In' ? 'From' : 'To'}: ${item.phone}` : `ID: ${item.transactionId}`}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.amount, { color: statusColors[item.status] }]}>
          {formatAmount(item.amount, item.type)}
        </Text>
        <Text style={[styles.status, { color: statusColors[item.status] }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.statusBar} backgroundColor={theme.surface} />
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Transaction History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
          <View style={styles.searchIcon}>
            <MaterialIcons name="search" size={20} color="#6b7280" />
          </View>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by phone number, transaction ID..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={[styles.filterContainer, { borderBottomColor: theme.border }]}>
        <FilterDropdown
          label="Date Range"
          options={dateRangeOptions}
          selectedValue={selectedDateRange}
          onSelect={setSelectedDateRange}
          placeholder="Date Range"
          isActive={selectedDateRange !== 'all'}
        />
        <FilterDropdown
          label="Transaction Type"
          options={transactionTypeOptions}
          selectedValue={selectedTransactionType}
          onSelect={setSelectedTransactionType}
          placeholder="Transaction Type"
          isActive={selectedTransactionType !== 'all'}
        />
        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <MaterialIcons name="clear" size={16} color="#ef4444" />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="history" size={64} color="#9ca3af" />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No Transactions Found</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            {hasActiveFilters ? 'Try adjusting your filters' : 'No transaction history available'}
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          style={styles.transactionList}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={() => {
            setIsLoading(true);
            // Refresh will automatically show updated transactions from context
            setTimeout(() => setIsLoading(false), 500);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
    backgroundColor: '#f5f7f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 48,
  },
  searchIcon: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingRight: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexWrap: 'wrap',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    height: 40,
  },
  clearButtonText: {
    color: '#ef4444',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: 14,
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  transactionInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: '#068cf9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});