import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function FilterDropdown({ 
  label, 
  options, 
  selectedValue, 
  onSelect, 
  placeholder = "Select option",
  isActive = false,
  disabled = false,
  loading = false,
  error = null
}) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.option,
        { borderBottomColor: theme.border },
        selectedValue === item.value && styles.selectedOption
      ]}
      onPress={() => handleSelect(item.value)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Select ${item.label}`}
      accessibilityState={{ selected: selectedValue === item.value }}
    >
      <View style={styles.optionContent}>
        {item.icon && (
          <MaterialIcons 
            name={item.icon} 
            size={18} 
            color={selectedValue === item.value ? "#068cf9" : "#6b7280"} 
            style={styles.optionIcon}
          />
        )}
        <Text style={[
          styles.optionText,
          { color: theme.text },
          selectedValue === item.value && styles.selectedOptionText
        ]}>
          {item.label}
        </Text>
      </View>
      {selectedValue === item.value && (
        <MaterialIcons name="check" size={20} color="#068cf9" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          { backgroundColor: theme.surface, borderColor: theme.border },
          isActive && styles.dropdownButtonActive,
          isOpen && styles.dropdownButtonOpen,
          disabled && styles.dropdownButtonDisabled,
          isPressed && styles.dropdownButtonPressed
        ]}
        onPress={() => !disabled && !loading && setIsOpen(true)}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={disabled || loading}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`${label} filter`}
        accessibilityHint="Tap to open filter options"
        accessibilityState={{ 
          disabled: disabled || loading,
          expanded: isOpen 
        }}
      >
        <View style={styles.dropdownContent}>
          {loading ? (
            <ActivityIndicator size="small" color="#068cf9" style={styles.loadingIndicator} />
          ) : (
            <Text style={[
              styles.dropdownText,
              { color: theme.text },
              isActive && styles.dropdownTextActive,
              disabled && styles.dropdownTextDisabled
            ]}>
              {selectedValue ? options.find(opt => opt.value === selectedValue)?.label : placeholder}
            </Text>
          )}
        </View>
        <MaterialIcons 
          name={isOpen ? "expand-less" : "expand-more"} 
          size={20} 
          color={disabled ? "#9ca3af" : isActive ? "#068cf9" : "#374151"} 
        />
      </TouchableOpacity>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.dropdownModal, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{label}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={renderOption}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    height: 44,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownButtonActive: {
    backgroundColor: 'rgba(6, 140, 249, 0.08)',
    borderColor: '#068cf9',
    shadowColor: '#068cf9',
    shadowOpacity: 0.15,
  },
  dropdownButtonOpen: {
    backgroundColor: 'rgba(6, 140, 249, 0.12)',
    borderColor: '#068cf9',
    transform: [{ scale: 0.98 }],
  },
  dropdownButtonPressed: {
    backgroundColor: '#f3f4f6',
    transform: [{ scale: 0.96 }],
  },
  dropdownButtonDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
    opacity: 0.6,
  },
  dropdownContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 14,
    flex: 1,
  },
  dropdownTextActive: {
    color: '#068cf9',
    fontWeight: '600',
  },
  dropdownTextDisabled: {
    color: '#9ca3af',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedOption: {
    backgroundColor: 'rgba(6, 140, 249, 0.1)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '400',
  },
  selectedOptionText: {
    color: '#068cf9',
    fontWeight: '600',
  },
});