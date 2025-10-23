import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';

export default function TransactionDetailsModal({ visible, onClose, transaction }) {
  if (!transaction) return null;
  const icon = {
    'Cash In': { icon: 'south-west', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    'Cash Out': { icon: 'north-east', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    'Airtime': { icon: 'phone-iphone', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    'Merchant': { icon: 'storefront', color: '#f59e42', bg: 'rgba(245,158,66,0.12)' },
    'Bill Payment': { icon: 'receipt-long', color: '#068cf9', bg: 'rgba(6,140,249,0.12)' },
  }[transaction.type] || { icon: 'receipt-long', color: '#068cf9', bg: 'rgba(6,140,249,0.12)' };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <View style={[styles.iconWrap, { backgroundColor: icon.bg }]}> 
          <MaterialIcons name={icon.icon} size={36} color={icon.color} />
        </View>
        <Text style={styles.title}>{transaction.type || 'Transaction'}</Text>
        <Text style={styles.amount}>{transaction.type === 'Cash In' ? '+' : '-'} ${Number(transaction.amount).toFixed(2)}</Text>
        <Text style={styles.status}>{transaction.status}</Text>
        <View style={styles.detailRow}><Text style={styles.label}>Date:</Text><Text style={styles.value}>{new Date(transaction.date).toLocaleString()}</Text></View>
        {transaction.phone && <View style={styles.detailRow}><Text style={styles.label}>{transaction.type === 'Cash In' ? 'From:' : transaction.type === 'Cash Out' ? 'To:' : 'Phone:'}</Text><Text style={styles.value}>{transaction.phone}</Text></View>}
        {transaction.id && <View style={styles.detailRow}><Text style={styles.label}>ID:</Text><Text style={styles.value}>{transaction.id}</Text></View>}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close details" accessibilityRole="button">
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'center', margin: 0 },
  container: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center' },
  iconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  amount: { fontSize: 22, fontWeight: '700', marginBottom: 2 },
  status: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  detailRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 4 },
  label: { color: '#6b7280', fontWeight: '600', fontSize: 15 },
  value: { color: '#222', fontSize: 15 },
  closeBtn: { marginTop: 18, backgroundColor: '#068cf9', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 },
  closeText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
