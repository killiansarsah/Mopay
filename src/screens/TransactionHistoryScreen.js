import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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

export default function TransactionHistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="arrow-back" size={24} color="#000" />
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
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

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButtonActive}>
          <Text style={styles.filterTextActive}>Date Range</Text>
          <MaterialIcons name="expand-more" size={20} color="#068cf9" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Transaction Type</Text>
          <MaterialIcons name="expand-more" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <FlatList
        data={mockTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        style={styles.transactionList}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  },
  filterButtonActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 140, 249, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    height: 40,
  },
  filterTextActive: {
    color: '#068cf9',
    fontWeight: '500',
    marginRight: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    height: 40,
  },
  filterText: {
    color: '#000',
    fontWeight: '500',
    marginRight: 8,
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
});