import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Cellular from 'expo-cellular';
import { useMultiNetwork } from '../state/MultiNetworkContext';

export default function SimManager() {
  const { networks, simSlots, simAssignments, assignSimToNetwork } = useMultiNetwork();
  const [simInfo, setSimInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectSimCards();
  }, []);

  const detectSimCards = async () => {
    try {
      setLoading(true);

      if (Platform.OS === 'android') {
        // For Android, we can get basic cellular info
        const cellularInfo = await Cellular.getCellularInfoAsync();
        setSimInfo({
          sim1: {
            carrier: cellularInfo.carrier || 'Unknown',
            countryCode: cellularInfo.isoCountryCode,
            networkType: cellularInfo.cellularGeneration,
          },
          sim2: null, // Android dual SIM detection is limited in Expo
        });
      } else {
        // iOS has limited SIM detection
        setSimInfo({
          sim1: { carrier: 'iOS Carrier', countryCode: 'GH' },
          sim2: null,
        });
      }
    } catch (error) {
      console.error('Error detecting SIM cards:', error);
      Alert.alert('SIM Detection Error', 'Unable to detect SIM cards. Please check permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimAssignment = (simSlot, networkId) => {
    assignSimToNetwork(simSlot, networkId);
    Alert.alert(
      'SIM Assigned',
      `${networks[networkId.toUpperCase()].name} assigned to ${simSlot.toUpperCase()}`
    );
  };

  const getAssignedNetwork = (simSlot) => {
    return simAssignments[simSlot];
  };

  const renderSimSlot = (simSlot) => {
    const assignedNetwork = getAssignedNetwork(simSlot);
    const slotInfo = simInfo?.[simSlot];

    return (
      <View key={simSlot} style={styles.simSlot}>
        <View style={styles.simHeader}>
          <MaterialIcons name="sim-card" size={24} color="#666" />
          <Text style={styles.simTitle}>{simSlot.toUpperCase()}</Text>
          {assignedNetwork && (
            <View style={[styles.networkBadge, { backgroundColor: networks[assignedNetwork.toUpperCase()].color }]}>
              <Text style={styles.networkBadgeText}>{networks[assignedNetwork.toUpperCase()].name}</Text>
            </View>
          )}
        </View>

        {slotInfo && (
          <View style={styles.simInfo}>
            <Text style={styles.carrierText}>Carrier: {slotInfo.carrier}</Text>
            <Text style={styles.networkText}>Network: {slotInfo.networkType || 'Unknown'}</Text>
          </View>
        )}

        <View style={styles.networkOptions}>
          {Object.values(networks).map((network) => (
            <TouchableOpacity
              key={network.id}
              style={[
                styles.networkOption,
                assignedNetwork === network.id && styles.networkOptionSelected
              ]}
              onPress={() => handleSimAssignment(simSlot, network.id)}
            >
              <View style={[styles.networkColor, { backgroundColor: network.color }]} />
              <Text style={styles.networkOptionText}>{network.name}</Text>
              {assignedNetwork === network.id && (
                <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Detecting SIM cards...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIM Card Management</Text>
      <Text style={styles.subtitle}>
        Assign mobile money networks to your SIM slots for seamless transactions
      </Text>

      {renderSimSlot('sim1')}

      {/* Note: Dual SIM detection is limited on mobile platforms */}
      <View style={styles.dualSimNote}>
        <MaterialIcons name="info" size={20} color="#FFC107" />
        <Text style={styles.noteText}>
          For full dual SIM support, ensure both SIM cards are active and properly configured in your device settings.
        </Text>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={detectSimCards}>
        <MaterialIcons name="refresh" size={20} color="#fff" />
        <Text style={styles.refreshButtonText}>Refresh SIM Info</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    lineHeight: 20,
  },
  simSlot: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  simTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  networkBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  networkBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  simInfo: {
    marginBottom: 15,
  },
  carrierText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  networkText: {
    fontSize: 14,
    color: '#666',
  },
  networkOptions: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  networkOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  networkOptionSelected: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  networkColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  networkOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dualSimNote: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    marginLeft: 10,
    lineHeight: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});