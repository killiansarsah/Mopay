import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const types = [
  'All',
  'Cash In',
  'Cash Out',
  'Airtime',
  'Merchant',
  'Bill Payment',
];

export default function TypePickerModal({ visible, onClose, onSelect, selectedType }) {
  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Transaction Type</Text>
        {types.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeBtn, selectedType === type && styles.typeBtnActive]}
            onPress={() => onSelect(type)}
          >
            <Text style={[styles.typeText, selectedType === type && styles.typeTextActive]}>{type}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'center', margin: 0 },
  container: { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  typeBtn: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  typeBtnActive: { backgroundColor: 'rgba(6,140,249,0.08)' },
  typeText: { fontSize: 16, color: '#222' },
  typeTextActive: { color: '#068cf9', fontWeight: '700' },
  cancelBtn: { marginTop: 20, alignSelf: 'flex-end' },
  cancelText: { color: '#6b7280', fontSize: 16 },
});
