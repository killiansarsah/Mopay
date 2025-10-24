import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SimCard = ({ simNumber, isActive, carrier, status, onPress, signalStrength = 0 }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'error': return '#EF4444';
      case 'no-sim': return '#D1D5DB';
      default: return '#6B7280';
    }
  };

  const getCarrierColor = () => {
    switch (carrier) {
      case 'MTN': return '#FFCC00';
      case 'Vodafone': return '#E60000';
      case 'AirtelTigo': return '#ED1C24';
      case 'Telecel': return '#00A651';
      default: return '#6B7280';
    }
  };

  const renderSignalBars = () => {
    return (
      <View style={styles.signalContainer}>
        {[1, 2, 3, 4].map((bar) => (
          <View
            key={bar}
            style={[
              styles.signalBar,
              { 
                height: bar * 3 + 2,
                backgroundColor: bar <= signalStrength ? getStatusColor() : '#E5E7EB'
              }
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.simCard,
        isActive && styles.simCardActive,
        { borderColor: getStatusColor() }
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`SIM ${simNumber} ${carrier || 'empty'} ${status}`}
      accessibilityHint="Tap to select this SIM for transactions"
    >
      {/* SIM Header */}
      <View style={styles.simHeader}>
        <View style={styles.simLabelContainer}>
          <MaterialIcons 
            name="sim-card" 
            size={16} 
            color={status === 'no-sim' ? '#9CA3AF' : getCarrierColor()} 
          />
          <Text style={[styles.simLabel, { color: isActive ? '#1F2937' : '#6B7280' }]}>SIM {simNumber}</Text>
        </View>
        {status === 'active' && renderSignalBars()}
      </View>

      {/* Carrier Info */}
      <View style={styles.carrierContainer}>
        {carrier ? (
          <>
            <Text style={[styles.carrierName, { color: getCarrierColor() }]}>{carrier}</Text>
            <Text style={styles.statusText}>
              {status === 'active' ? 'Agent SIM' : 'Inactive'}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.noSimText}>No SIM</Text>
            <Text style={styles.insertText}>Insert SIM</Text>
          </>
        )}
      </View>

      {/* Active Indicator */}
      {isActive && (
        <View style={styles.activeIndicator}>
          <MaterialIcons name="check-circle" size={20} color="#10B981" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function EnhancedSimSelector({ 
  selectedSim, 
  onSimChange, 
  sim1Data = { carrier: 'MTN', status: 'active', signalStrength: 4 },
  sim2Data = { carrier: null, status: 'no-sim', signalStrength: 0 }
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>SIM Card Selection</Text>
      <Text style={styles.subtitle}>Choose which SIM to use for transactions</Text>
      
      <View style={styles.simGrid}>
        <SimCard
          simNumber={1}
          isActive={selectedSim === 'SIM1'}
          carrier={sim1Data.carrier}
          status={sim1Data.status}
          signalStrength={sim1Data.signalStrength}
          onPress={() => onSimChange('SIM1')}
        />
        
        <SimCard
          simNumber={2}
          isActive={selectedSim === 'SIM2'}
          carrier={sim2Data.carrier}
          status={sim2Data.status}
          signalStrength={sim2Data.signalStrength}
          onPress={() => onSimChange('SIM2')}
        />
      </View>

      {/* None Option */}
      <TouchableOpacity
        style={[
          styles.noneOption,
          selectedSim === 'None' && styles.noneOptionActive
        ]}
        onPress={() => onSimChange('None')}
        accessibilityRole="button"
        accessibilityLabel="No SIM selected"
      >
        <MaterialIcons 
          name="block" 
          size={20} 
          color={selectedSim === 'None' ? '#EF4444' : '#9CA3AF'} 
        />
        <Text style={[
          styles.noneText,
          selectedSim === 'None' && styles.noneTextActive
        ]}>None (Disable)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  simGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  simCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    position: 'relative',
  },
  simCardActive: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
  },
  simHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  simLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  simLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  signalBar: {
    width: 3,
    borderRadius: 1,
  },
  carrierContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  carrierName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  noSimText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  insertText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  noneOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  noneOptionActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  noneText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  noneTextActive: {
    color: '#EF4444',
  },
});