import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useMultiNetwork } from '../state/MultiNetworkContext';

export default function SecurityManager() {
  const { networks } = useMultiNetwork();
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [sessionTimeout, setSessionTimeout] = useState(5); // minutes
  const [autoLogout, setAutoLogout] = useState(true);
  const [securitySettings, setSecuritySettings] = useState({});

  useEffect(() => {
    checkBiometricSupport();
    loadSecuritySettings();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setBiometricSupported(compatible);

      if (compatible) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        }
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
    }
  };

  const loadSecuritySettings = async () => {
    try {
      const settings = await SecureStore.getItemAsync('mopay_security_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setBiometricEnabled(parsed.biometricEnabled || false);
        setSessionTimeout(parsed.sessionTimeout || 5);
        setAutoLogout(parsed.autoLogout !== false);
        setSecuritySettings(parsed);
      }
    } catch (error) {
      console.error('Error loading security settings:', error);
    }
  };

  const saveSecuritySettings = async (settings) => {
    try {
      await SecureStore.setItemAsync('mopay_security_settings', JSON.stringify(settings));
      setSecuritySettings(settings);
    } catch (error) {
      console.error('Error saving security settings:', error);
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access security settings',
        fallbackLabel: 'Use PIN',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const toggleBiometricAuth = async (enabled) => {
    if (enabled && !biometricSupported) {
      Alert.alert('Not Supported', 'Biometric authentication is not supported on this device.');
      return;
    }

    if (enabled) {
      const authenticated = await authenticateWithBiometrics();
      if (!authenticated) {
        Alert.alert('Authentication Failed', 'Unable to verify your identity.');
        return;
      }
    }

    const newSettings = {
      ...securitySettings,
      biometricEnabled: enabled,
    };

    await saveSecuritySettings(newSettings);
    setBiometricEnabled(enabled);

    Alert.alert(
      'Settings Updated',
      `Biometric authentication ${enabled ? 'enabled' : 'disabled'}`
    );
  };

  const updateSessionTimeout = async (minutes) => {
    const newSettings = {
      ...securitySettings,
      sessionTimeout: minutes,
    };

    await saveSecuritySettings(newSettings);
    setSessionTimeout(minutes);
  };

  const toggleAutoLogout = async (enabled) => {
    const newSettings = {
      ...securitySettings,
      autoLogout: enabled,
    };

    await saveSecuritySettings(newSettings);
    setAutoLogout(enabled);
  };

  const clearAllStoredData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all stored accounts, transactions, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all secure storage
              const keys = [
                'mopay_accounts',
                'mopay_sim_assignments',
                'mopay_security_settings',
              ];

              // Add network-specific keys
              Object.values(networks).forEach(network => {
                keys.push(`${network.id}_auth_token`);
                keys.push(`${network.id}_refresh_token`);
                keys.push(`${network.id}_api_key`);
              });

              for (const key of keys) {
                await SecureStore.deleteItemAsync(key);
              }

              // Clear AsyncStorage
              await AsyncStorage.clear();

              Alert.alert('Data Cleared', 'All stored data has been removed.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear all data.');
            }
          }
        }
      ]
    );
  };

  const testBiometricAuth = async () => {
    if (!biometricSupported) {
      Alert.alert('Not Supported', 'Biometric authentication is not available on this device.');
      return;
    }

    const authenticated = await authenticateWithBiometrics();
    Alert.alert(
      authenticated ? 'Success' : 'Failed',
      authenticated ? 'Biometric authentication successful!' : 'Biometric authentication failed.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security Settings</Text>
      <Text style={styles.subtitle}>
        Manage authentication and security preferences for your accounts
      </Text>

      {/* Biometric Authentication */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Biometric Authentication</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="fingerprint" size={24} color="#666" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>
                {biometricType || 'Biometric'} Authentication
              </Text>
              <Text style={styles.settingDescription}>
                {biometricSupported
                  ? `Use ${biometricType || 'biometric'} for quick access`
                  : 'Biometric authentication not supported on this device'
                }
              </Text>
            </View>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={toggleBiometricAuth}
            disabled={!biometricSupported}
          />
        </View>

        {biometricSupported && (
          <TouchableOpacity style={styles.testButton} onPress={testBiometricAuth}>
            <MaterialIcons name="touch-app" size={20} color="#007bff" />
            <Text style={styles.testButtonText}>Test Biometric Auth</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Session Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session Management</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MaterialIcons name="timer" size={24} color="#666" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Auto Logout</Text>
              <Text style={styles.settingDescription}>
                Automatically log out after period of inactivity
              </Text>
            </View>
          </View>
          <Switch
            value={autoLogout}
            onValueChange={toggleAutoLogout}
          />
        </View>

        {autoLogout && (
          <View style={styles.timeoutSetting}>
            <Text style={styles.timeoutLabel}>Session Timeout: {sessionTimeout} minutes</Text>
            <View style={styles.timeoutButtons}>
              {[1, 5, 15, 30, 60].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.timeoutButton,
                    sessionTimeout === minutes && styles.timeoutButtonActive
                  ]}
                  onPress={() => updateSessionTimeout(minutes)}
                >
                  <Text style={[
                    styles.timeoutButtonText,
                    sessionTimeout === minutes && styles.timeoutButtonTextActive
                  ]}>
                    {minutes}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity style={styles.dangerButton} onPress={clearAllStoredData}>
          <MaterialIcons name="delete-forever" size={20} color="#fff" />
          <Text style={styles.dangerButtonText}>Clear All Stored Data</Text>
        </TouchableOpacity>

        <Text style={styles.warningText}>
          This will permanently remove all accounts, transactions, and settings from this device.
        </Text>
      </View>

      {/* Security Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security Status</Text>

        <View style={styles.statusItem}>
          <MaterialIcons
            name={biometricSupported ? "check-circle" : "cancel"}
            size={20}
            color={biometricSupported ? "#28a745" : "#dc3545"}
          />
          <Text style={styles.statusText}>
            Biometric Hardware: {biometricSupported ? 'Available' : 'Not Available'}
          </Text>
        </View>

        <View style={styles.statusItem}>
          <MaterialIcons
            name="encrypted"
            size={20}
            color="#28a745"
          />
          <Text style={styles.statusText}>Data Encryption: Enabled</Text>
        </View>

        <View style={styles.statusItem}>
          <MaterialIcons
            name="security"
            size={20}
            color="#28a745"
          />
          <Text style={styles.statusText}>Secure Storage: Active</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  testButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  timeoutSetting: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  timeoutLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  timeoutButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  timeoutButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  timeoutButtonText: {
    fontSize: 14,
    color: '#666',
  },
  timeoutButtonTextActive: {
    color: '#fff',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc3545',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    marginTop: 8,
    lineHeight: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});