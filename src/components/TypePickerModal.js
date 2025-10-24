import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const types = ['All', 'Cash In', 'Cash Out', 'Airtime', 'Merchant', 'Bill Payment'];

export default function TypePickerModal({ visible, onClose, onSelect, selectedType }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Transaction Type</Text>
          {types.map(type => (
            <TouchableOpacity 
              key={type} 
              style={[styles.option, selectedType === type && styles.selected]} 
              onPress={() => onSelect(type)}
            >
              <Text style={[styles.optionText, selectedType === type && styles.selectedText]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '80%', maxHeight: '70%' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  option: { padding: 12, borderRadius: 8, marginVertical: 2 },
  selected: { backgroundColor: '#068cf9' },
  optionText: { textAlign: 'center', fontSize: 16 },
  selectedText: { color: '#fff', fontWeight: '600' },
  closeButton: { backgroundColor: '#e5e7eb', padding: 12, borderRadius: 8, marginTop: 12 },
  closeText: { textAlign: 'center', fontWeight: '600' }
});