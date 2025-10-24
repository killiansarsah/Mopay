import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TransactionDetailsModal({ visible, onClose, transaction }) {
  if (!transaction) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Transaction Details</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#222" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.row}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{transaction.type}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>${transaction.amount}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{transaction.status}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{transaction.phone || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{new Date(transaction.date).toLocaleString()}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 18, fontWeight: '600' },
  content: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  label: { fontSize: 16, color: '#6b7280', fontWeight: '500' },
  value: { fontSize: 16, color: '#222', fontWeight: '600' }
});