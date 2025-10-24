import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

export default function DateRangeModal({ visible, onClose, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Date Range</Text>
          <TouchableOpacity style={styles.button} onPress={() => onSelect(null, null)}>
            <Text style={styles.buttonText}>Clear Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '80%' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  button: { backgroundColor: '#068cf9', padding: 12, borderRadius: 8, marginVertical: 4 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' }
});