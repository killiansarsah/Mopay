import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SimCard = ({ label, isSelected, onPress, icon, colors }) => (
  <TouchableOpacity
    style={[
      styles.simCard,
      { backgroundColor: colors.bg, borderColor: colors.border },
      isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
    ]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected: isSelected }}
    accessibilityLabel={`${label} ${isSelected ? 'selected' : 'not selected'}`}
  >
    <MaterialIcons 
      name={icon} 
      size={20} 
      color={isSelected ? '#FFFFFF' : colors.primary} 
    />
    <Text style={[
      styles.simLabel,
      { color: isSelected ? '#FFFFFF' : colors.text }
    ]}>
      {label}
    </Text>
    {isSelected && (
      <MaterialIcons name="check" size={16} color="#FFFFFF" style={styles.checkIcon} />
    )}
  </TouchableOpacity>
);

export default function SimpleSimSelector({ selectedSim, onSimChange, networkType = 'MTN' }) {
  const { theme } = useTheme();
  const getNetworkColors = () => {
    switch (networkType) {
      case 'MTN':
        return { bg: theme.surface, border: '#FFCC00', primary: '#FFCC00', text: theme.text };
      case 'AirtelTigo':
        return { bg: theme.surface, border: '#3B82F6', primary: '#3B82F6', text: theme.text };
      case 'Telecel':
        return { bg: theme.surface, border: '#EF4444', primary: '#EF4444', text: theme.text };
      default:
        return { bg: theme.surface, border: theme.border, primary: theme.primary, text: theme.text };
    }
  };

  const colors = getNetworkColors();

  return (
    <View style={styles.container}>
      <View style={styles.optionsRow}>
        <SimCard
          label="SIM 1"
          icon="sim-card"
          isSelected={selectedSim === 'SIM1'}
          onPress={() => onSimChange('SIM1')}
          colors={colors}
        />
        <SimCard
          label="SIM 2"
          icon="sim-card"
          isSelected={selectedSim === 'SIM2'}
          onPress={() => onSimChange('SIM2')}
          colors={colors}
        />
        <SimCard
          label="None"
          icon="block"
          isSelected={selectedSim === 'None'}
          onPress={() => onSimChange('None')}
          colors={colors}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  simCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    minHeight: 60,
    position: 'relative',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  simLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});