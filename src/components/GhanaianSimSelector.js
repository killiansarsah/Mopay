import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CARRIERS = {
  MTN: { color: '#FFCC00', secondary: '#000000', name: 'MTN MoMo' },
  Vodafone: { color: '#E60000', secondary: '#FFFFFF', name: 'Vodafone Cash' },
  AirtelTigo: { color: '#ED1C24', secondary: '#FFFFFF', name: 'AirtelTigo Money' }
};

const SimCard = ({ 
  simNumber, 
  isSelected, 
  carrier, 
  balance, 
  signalStrength, 
  networkType, 
  isAgent, 
  onPress,
  onQuickAction 
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  
  const carrierInfo = CARRIERS[carrier] || { color: '#6B7280', name: 'Unknown' };
  
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.98, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
    onPress();
  };

  const renderSignalBars = () => (
    <View style={styles.signalContainer}>
      {[1,2,3,4,5].map(bar => (
        <View
          key={bar}
          style={[
            styles.signalBar,
            { 
              height: bar * 2 + 4,
              backgroundColor: bar <= signalStrength ? '#10B981' : '#E5E7EB'
            }
          ]}
        />
      ))}
      <Text style={styles.networkType}>{networkType}</Text>
    </View>
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.simCard,
          isSelected && styles.simCardSelected,
          { borderColor: isSelected ? '#10B981' : '#D1D5DB' }
        ]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`SIM ${simNumber}, ${carrierInfo.name}, Balance ${balance}, ${isAgent ? 'Agent SIM' : 'Personal SIM'}`}
        accessibilityHint="Tap to select this SIM for transactions"
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.simLabelContainer}>
            <MaterialIcons name="sim-card" size={16} color={carrierInfo.color} />
            <Text style={styles.simLabel}>SIM {simNumber}</Text>
          </View>
          {renderSignalBars()}
        </View>

        {/* Carrier Info */}
        <Text style={[styles.carrierName, { color: carrierInfo.color }]}>
          {carrierInfo.name}
        </Text>

        {/* Balance */}
        <Text style={styles.balance}>GHS {balance}</Text>

        {/* Status Badge */}
        <View style={[
          styles.statusBadge,
          { backgroundColor: isAgent ? '#10B981' : '#6B7280' }
        ]}>
          <Text style={styles.statusText}>
            {isAgent ? '✓ Agent' : '○ Personal'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickButton}
            onPress={() => onQuickAction('balance')}
          >
            <MaterialIcons name="account-balance-wallet" size={12} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickButton}
            onPress={() => onQuickAction('data')}
          >
            <MaterialIcons name="data-usage" size={12} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Selection Indicator */}
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <MaterialIcons name="check-circle" size={20} color="#10B981" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const EmptySimCard = ({ simNumber, onPress, isSelected }) => (
  <TouchableOpacity
    style={[
      styles.simCard,
      styles.emptyCard,
      isSelected && styles.simCardSelected
    ]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`SIM ${simNumber} slot empty`}
  >
    <MaterialIcons name="sim-card-alert" size={24} color="#9CA3AF" />
    <Text style={styles.emptyText}>No SIM</Text>
    <Text style={styles.insertText}>Insert SIM Card</Text>
  </TouchableOpacity>
);

const DisableOption = ({ isSelected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.disableCard,
      isSelected && styles.disableCardSelected
    ]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="Disable SIM selection"
  >
    <MaterialIcons name="block" size={20} color={isSelected ? '#FFFFFF' : '#EF4444'} />
    <Text style={[
      styles.disableText,
      isSelected && styles.disableTextSelected
    ]}>DISABLE</Text>
  </TouchableOpacity>
);

export default function GhanaianSimSelector({
  selectedSim,
  onSimChange,
  onQuickAction,
  sim1Data = { carrier: 'MTN', balance: '245.50', signalStrength: 5, networkType: '4G', isAgent: true },
  sim2Data = { carrier: 'Vodafone', balance: '12.30', signalStrength: 3, networkType: '3G', isAgent: false }
}) {
  return (
    <View style={styles.container}>
      <View style={styles.simGrid}>
        {sim1Data ? (
          <SimCard
            simNumber={1}
            isSelected={selectedSim === 'SIM1'}
            onPress={() => onSimChange('SIM1')}
            onQuickAction={onQuickAction}
            {...sim1Data}
          />
        ) : (
          <EmptySimCard
            simNumber={1}
            isSelected={selectedSim === 'SIM1'}
            onPress={() => onSimChange('SIM1')}
          />
        )}

        {sim2Data ? (
          <SimCard
            simNumber={2}
            isSelected={selectedSim === 'SIM2'}
            onPress={() => onSimChange('SIM2')}
            onQuickAction={onQuickAction}
            {...sim2Data}
          />
        ) : (
          <EmptySimCard
            simNumber={2}
            isSelected={selectedSim === 'SIM2'}
            onPress={() => onSimChange('SIM2')}
          />
        )}
      </View>

      <DisableOption
        isSelected={selectedSim === 'None'}
        onPress={() => onSimChange('None')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  simGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  simCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    position: 'relative',
  },
  simCardSelected: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  simLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  simLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  signalBar: {
    width: 2,
    borderRadius: 1,
  },
  networkType: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
  carrierName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  balance: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: 8,
    left: 16,
  },
  quickButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 8,
  },
  insertText: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 2,
  },
  disableCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  disableCardSelected: {
    backgroundColor: '#EF4444',
  },
  disableText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  disableTextSelected: {
    color: '#FFFFFF',
  },
});