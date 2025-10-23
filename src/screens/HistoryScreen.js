import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { AppContext } from '../state/AppContext';
import { MaterialIcons } from '@expo/vector-icons';
import DateRangeModal from '../components/DateRangeModal';
import TypePickerModal from '../components/TypePickerModal';
import TransactionDetailsModal from '../components/TransactionDetailsModal';

import { FlatList } from 'react-native';

function formatAmount(amount, type) {
  if (amount === undefined || amount === null) return '$0.00';
  const sign = type === 'Cash In' ? '+' : '-';
  return `${sign} $${Number(amount).toFixed(2)}`;
}

function formatDate(date) {
  if (!date) return 'Unknown date';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

const typeIcon = {
  'Cash In': { icon: 'south-west', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  'Cash Out': { icon: 'north-east', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  'Airtime': { icon: 'phone-iphone', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  'Merchant': { icon: 'storefront', color: '#f59e42', bg: 'rgba(245,158,66,0.12)' },
    'Bill Payment': { icon: 'receipt-long', color: '#068cf9', bg: 'rgba(6,140,249,0.12)' },
  };

  const statusColor = {
    Success: '#22c55e',
    Failed: '#ef4444',
    Pending: '#f59e42',
  };

  export default function HistoryScreen() {
    const { transactions } = useContext(AppContext);
    const [query, setQuery] = useState('');
    const [dateModal, setDateModal] = useState(false);
    const [typeModal, setTypeModal] = useState(false);
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [type, setType] = useState('All');
    const [txList, setTxList] = useState([]);
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedTx, setSelectedTx] = useState(null);

    // Update txList when transactions change
    useEffect(() => {
      if (transactions && Array.isArray(transactions)) {
        setTxList(transactions.map(tx => ({ ...tx })));
      }
    }, [transactions]);

    // Filtering logic
    const filtered = (txList || []).filter((t) => {
      if (!t) return false;
      
      // Search
      const matchesQuery =
        (t.phone && t.phone.toString().toLowerCase().includes(query.toLowerCase())) ||
        (t.type && t.type.toLowerCase().includes(query.toLowerCase())) ||
        (t.id && t.id.toString().toLowerCase().includes(query.toLowerCase()));
      
      // Date filter
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        const txDate = new Date(t.date);
        matchesDate = txDate >= dateRange.start && txDate <= dateRange.end;
      }
      
      // Type filter
      let matchesType = type === 'All' || t.type === type;
      return matchesQuery && matchesDate && matchesType;
    });

        const renderItem = (data) => {
          const tx = data.item;
          if (!tx) return null;
          
          const icon = typeIcon[tx.type] || { icon: 'receipt-long', color: '#068cf9', bg: 'rgba(6,140,249,0.12)' };
          return (
            <TouchableOpacity
              style={styles.txRow}
              onPress={() => {
                setSelectedTx(tx);
                setDetailsModal(true);
              }}
              accessibilityLabel={`View details for ${tx.type || 'transaction'}`}
              accessibilityRole="button"
              activeOpacity={0.8}
            >
              <View style={[styles.txIconWrap, { backgroundColor: icon.bg }]}> 
                <MaterialIcons name={icon.icon} size={28} color={icon.color} />
              </View>
              <View style={styles.txDetails}>
                <Text style={styles.txType}>{tx.type || 'Transaction'}</Text>
                <Text style={styles.txDate}>{formatDate(tx.date)}</Text>
                <Text style={styles.txParty}>
                  {tx.type === 'Cash In' ? `From: ${tx.phone || 'Unknown'}` : 
                   tx.type === 'Cash Out' ? `To: ${tx.phone || 'Unknown'}` : 
                   tx.id ? `ID: ${tx.id}` : 'No details'}
                </Text>
              </View>
              <View style={styles.txAmountWrap}>
                <Text style={[styles.txAmount, { color: statusColor[tx.status] || '#222' }]}>
                  {formatAmount(tx.amount, tx.type)}
                </Text>
                <Text style={[styles.txStatus, { color: statusColor[tx.status] || '#222' }]}>
                  {tx.status || 'Unknown'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        };

        return (
          <View style={{ flex: 1, backgroundColor: '#f5f7f8' }}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <View style={styles.topBarIcon}><MaterialIcons name="arrow-back" size={24} color="#222" /></View>
              <Text style={styles.topBarTitle}>Transaction History</Text>
              <View style={styles.topBarIcon} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchWrap}>
              <View style={styles.searchIconWrap}>
                <MaterialIcons name="search" size={22} color="#6b7280" />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by phone number, transaction ID..."
                placeholderTextColor="#6b7280"
                value={query}
                onChangeText={setQuery}
              />
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterRow}>
              <TouchableOpacity style={styles.filterBtnActive} onPress={() => setDateModal(true)}>
                <Text style={styles.filterBtnActiveText}>
                  {dateRange.start && dateRange.end
                    ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
                    : 'Date Range'}
                </Text>
                <MaterialIcons name="expand-more" size={20} color="#068cf9" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterBtn} onPress={() => setTypeModal(true)}>
                <Text style={styles.filterBtnText}>{type === 'All' ? 'Transaction Type' : type}</Text>
                <MaterialIcons name="expand-more" size={20} color="#222" />
              </TouchableOpacity>
            </View>

            {/* Transaction List with Swipe-to-Delete */}
            {filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="history" size={64} color="#9ca3af" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyTitle}>No Transactions Found</Text>
                <Text style={styles.emptyDesc}>Adjust your filters or try a different search.</Text>
              </View>
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(item, index) => item?.id?.toString() || item?.date?.toString() || `item-${index}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 32 }}
              />
            )}

            {/* Date Range Modal */}
            <DateRangeModal
              visible={dateModal}
              onClose={() => setDateModal(false)}
              onSelect={(start, end) => {
                setDateRange({ start, end });
                setDateModal(false);
              }}
              initialStart={dateRange.start}
              initialEnd={dateRange.end}
            />
            {/* Type Picker Modal */}
            <TypePickerModal
              visible={typeModal}
              onClose={() => setTypeModal(false)}
              onSelect={(selected) => {
                setType(selected);
                setTypeModal(false);
              }}
              selectedType={type}
            />
            {/* Transaction Details Modal */}
            <TransactionDetailsModal
              visible={detailsModal}
              onClose={() => setDetailsModal(false)}
              transaction={selectedTx}
            />
          </View>
        );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  topBarIcon: { width: 40, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#222',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
    height: 44,
  },
  searchIconWrap: {
    backgroundColor: '#e5e7eb',
    paddingLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#222',
    fontSize: 16,
    paddingLeft: 8,
    height: 44,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  filterBtnActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6,140,249,0.12)',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    marginRight: 8,
  },
  filterBtnActiveText: {
    color: '#068cf9',
    fontWeight: '600',
    fontSize: 15,
    marginRight: 2,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
  },
  filterBtnText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 15,
    marginRight: 2,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  txIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  txDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  txType: {
    color: '#222',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  txDate: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 1,
  },
  txParty: {
    color: '#6b7280',
    fontSize: 13,
  },
  txAmountWrap: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  txAmount: {
    fontWeight: '700',
    fontSize: 16,
  },
  txStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ef4444',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 24,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  deleteBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#222',
    fontWeight: '700',
    fontSize: 18,
    marginTop: 8,
  },
  emptyDesc: {
    color: '#6b7280',
    fontSize: 15,
    marginTop: 2,
    textAlign: 'center',
    maxWidth: 260,
  },
});

