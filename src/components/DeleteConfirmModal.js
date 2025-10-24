import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

export default function DeleteConfirmModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Delete Transaction</Text>
          <Text style={styles.message}>Are you sure you want to delete this transaction?</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '80%' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 16, color: '#6b7280', marginBottom: 20, textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, backgroundColor: '#e5e7eb', padding: 12, borderRadius: 8 },
  cancelText: { textAlign: 'center', fontWeight: '600' },
  confirmButton: { flex: 1, backgroundColor: '#ef4444', padding: 12, borderRadius: 8 },
  confirmText: { color: '#fff', textAlign: 'center', fontWeight: '600' }
});