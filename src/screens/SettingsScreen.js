import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import SimpleSimSelector from '../components/SimpleSimSelector';

const RadioButton = ({ selected, onPress, label }) => (
  <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
    <View style={[styles.radioButton, selected && styles.radioSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

const NetworkSection = ({ title, simSettings, onSimChange, networkType }) => (
  <View style={styles.networkSection}>
    <Text style={styles.networkTitle}>{title}</Text>
    <SimpleSimSelector
      selectedSim={simSettings}
      onSimChange={onSimChange}
      networkType={networkType}
    />
  </View>
);

export default function SettingsScreen() {
  const [moneyTransferSettings, setMoneyTransferSettings] = useState({
    mtn: 'None',
    airtelTigo: 'None',
    telecel: 'None'
  });

  const [airtimeSettings, setAirtimeSettings] = useState({
    mtn: 'None',
    airtelTigo: 'None',
    telecel: 'None'
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#f5f7f8" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Money Transfer Settings */}
        <View style={styles.section}>
          <Text style={styles.instruction}>
            Choose SIM(s) for money related transactions.{'\n'}
            NB: SIM must be an agent SIM.
          </Text>
          
          <Text style={styles.sectionTitle}>Money Transfer SIM Settings</Text>
          
          <NetworkSection
            title="MTN Mobile Money Transactions"
            simSettings={moneyTransferSettings.mtn}
            onSimChange={(value) => setMoneyTransferSettings(prev => ({ ...prev, mtn: value }))}
            networkType="MTN"
          />
          
          <NetworkSection
            title="AirtelTigo Money Transactions"
            simSettings={moneyTransferSettings.airtelTigo}
            onSimChange={(value) => setMoneyTransferSettings(prev => ({ ...prev, airtelTigo: value }))}
            networkType="AirtelTigo"
          />
          
          <NetworkSection
            title="Telecel Cash Transactions"
            simSettings={moneyTransferSettings.telecel}
            onSimChange={(value) => setMoneyTransferSettings(prev => ({ ...prev, telecel: value }))}
            networkType="Telecel"
          />
        </View>

        <View style={styles.divider} />

        {/* Airtime Transfer Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Airtime Transfer SIM Settings</Text>
          <Text style={styles.instruction}>
            Choose SIM(s) for airtime transfer transactions.{'\n'}
            NB: SIM must be an agent SIM.
          </Text>
          
          <NetworkSection
            title="MTN Airtime Transfer"
            simSettings={airtimeSettings.mtn}
            onSimChange={(value) => setAirtimeSettings(prev => ({ ...prev, mtn: value }))}
            networkType="MTN"
          />
          
          <NetworkSection
            title="AirtelTigo Airtime Transfer"
            simSettings={airtimeSettings.airtelTigo}
            onSimChange={(value) => setAirtimeSettings(prev => ({ ...prev, airtelTigo: value }))}
            networkType="AirtelTigo"
          />
          
          <NetworkSection
            title="Telecel Airtime Transfer"
            simSettings={airtimeSettings.telecel}
            onSimChange={(value) => setAirtimeSettings(prev => ({ ...prev, telecel: value }))}
            networkType="Telecel"
          />
        </View>

        <View style={styles.divider} />

        {/* Extras Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Extras</Text>
          <View style={styles.extrasPlaceholder}>
            <Text style={styles.placeholderText}>Additional settings will appear here</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  networkSection: {
    marginBottom: 20,
  },
  networkTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  radioContainer: {
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  radioSelected: {
    borderColor: '#4A90E2',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A90E2',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  extrasPlaceholder: {
    padding: 20,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
});