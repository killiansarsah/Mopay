import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import FilterDropdown from '../components/FilterDropdown';

const mockTransactions = [
  {
    id: '1',
    type: 'Cash In',
    amount: 50.00,
    phone: '0123456789',
    status: 'Success',
    date: '2024-01-12T10:30:00Z',
    icon: 'south-west',
    color: '#22c55e'
  },
  {
    id: '2',
    type: 'Cash Out',
    amount: 20.00,
    phone: '9876543210',
    status: 'Failed',
    date: '2024-01-11T14:45:00Z',
    icon: 'north-east',
    color: '#ef4444'
  },
  {
    id: '3',
    type: 'Bill Payment',
    amount: 15.50,
    transactionId: 'MOP12345',
    status: 'Success',
    date: '2024-01-10T09:15:00Z',
    icon: 'receipt-long',
    color: '#068cf9'
  },
  {
    id: '4',
    type: 'Cash In',
    amount: 100.00,
    phone: '555123456',
    status: 'Pending',
    date: '2024-01-09T17:00:00Z',
    icon: 'south-west',
    color: '#f59e0b'
  }
];

const statusColors = {
  Success: '#22c55e',
  Failed: '#ef4444',
  Pending: '#f59e0b'
};

export default function HistoryScreen() {
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

  // Filter transactions based on selected criteria
  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions;

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
  }, [searchQuery, selectedDateRange, selectedTransactionType]);

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
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <MaterialIcons name={item.icon} size={24} color={item.color} />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionType}>{item.type}</Text>
          <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
          <Text style={styles.transactionInfo}>
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#f5f7f8" />
      <View style={styles.header}>
        <MaterialIcons name="arrow-back" size={24} color="#000" />
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <MaterialIcons name="search" size={20} color="#6b7280" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by phone number, transaction ID..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
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
          <Text style={styles.emptyTitle}>No Transactions Found</Text>
          <Text style={styles.emptySubtitle}>
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
            setTimeout(() => setIsLoading(false), 1000);
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