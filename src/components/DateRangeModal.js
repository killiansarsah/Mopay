import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';

export default function DateRangeModal({ visible, onClose, onSelect, initialStart, initialEnd }) {
  const [startDate, setStartDate] = useState(initialStart || new Date());
  const [endDate, setEndDate] = useState(initialEnd || new Date());
  const [mode, setMode] = useState('start');
  const [showPicker, setShowPicker] = useState(false);

  const showDatePicker = (which) => {
    setMode(which);
    setShowPicker(true);
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      if (mode === 'start') setStartDate(selectedDate);
      else setEndDate(selectedDate);
    }
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Date Range</Text>
        <TouchableOpacity style={styles.dateBtn} onPress={() => showDatePicker('start')}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateValue}>{startDate.toDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateBtn} onPress={() => showDatePicker('end')}>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>{endDate.toDateString()}</Text>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.okBtn} onPress={() => onSelect(startDate, endDate)}>
            <Text style={styles.okText}>Apply</Text>
          </TouchableOpacity>
        </View>
        {showPicker && (
          <DateTimePicker
            value={mode === 'start' ? startDate : endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onChange}
            maximumDate={mode === 'start' ? endDate : undefined}
            minimumDate={mode === 'end' ? startDate : undefined}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'center', margin: 0 },
  container: { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  dateBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  dateLabel: { fontSize: 15, color: '#6b7280' },
  dateValue: { fontSize: 15, color: '#222', fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  cancelBtn: { marginRight: 16 },
  cancelText: { color: '#6b7280', fontSize: 16 },
  okBtn: { backgroundColor: '#068cf9', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 8 },
  okText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
