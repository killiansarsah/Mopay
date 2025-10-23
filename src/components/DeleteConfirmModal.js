import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';

export default function DeleteConfirmModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal isVisible={visible} onBackdropPress={onCancel} style={styles.modal}>
      <View style={styles.container}>
        <MaterialIcons name="delete" size={48} color="#ef4444" style={{ alignSelf: 'center', marginBottom: 12 }} />
        <Text style={styles.title}>Delete Transaction?</Text>
        <Text style={styles.desc}>Are you sure you want to delete this transaction? This action cannot be undone.</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'center', margin: 0 },
  container: { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  desc: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelBtn: { marginRight: 16 },
  cancelText: { color: '#6b7280', fontSize: 16 },
  deleteBtn: { backgroundColor: '#ef4444', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 8 },
  deleteText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
