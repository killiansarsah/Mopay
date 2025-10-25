import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import SimpleSimSelector from '../components/SimpleSimSelector';
import { useTheme } from '../context/ThemeContext';

const RadioButton = ({ selected, onPress, label }) => (
  <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
    <View style={[styles.radioButton, selected && styles.radioSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

const NetworkSection = ({ title, simSettings, onSimChange, networkType }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.networkSection}>
      <Text style={[styles.networkTitle, { color: theme.textSecondary }]}>{title}</Text>
    <SimpleSimSelector
      selectedSim={simSettings}
      onSimChange={onSimChange}
      networkType={networkType}
    />
    </View>
  );
};

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
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

  // New state for extra features
  const [abnormalWarningEnabled, setAbnormalWarningEnabled] = useState(false);
  const [phoneHistoryEnabled, setPhoneHistoryEnabled] = useState(true);
  const [thresholds, setThresholds] = useState({
    airtime: '',
    cashIn: '',
    cashOut: ''
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  
  // New competitive features state
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [notifications, setNotifications] = useState({
    push: true,
    sms: false,
    email: true,
    transactions: true
  });
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [historyRetention, setHistoryRetention] = useState('6months');

  const handleThresholdChange = (type, value) => {
    setThresholds(prev => ({ ...prev, [type]: value }));
    setSettingsSaved(false);
  };

  const saveSettings = () => {
    // Save settings logic here
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleProfileImageChange = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Open Camera') },
        { text: 'Gallery', onPress: () => console.log('Open Gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleManageSubscription = () => {
    // Redirect to Stripe or payment platform
    const paymentUrl = 'https://billing.stripe.com/p/login/test_example';
    Linking.openURL(paymentUrl).catch(() => {
      Alert.alert('Error', 'Unable to open payment platform');
    });
  };
  
  const handleNotificationChange = (type, value) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };
  
  const handleHistoryCleanup = () => {
    Alert.alert(
      'Clear Transaction History',
      `This will delete transactions older than ${historyRetention === '1month' ? '1 month' : historyRetention === '3months' ? '3 months' : '6 months'}. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => console.log('History cleared') }
      ]
    );
  };
  
  // Biometric Authentication Functions
  useEffect(() => {
    checkBiometricAvailability();
  }, []);
  
  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setBiometricAvailable(compatible && enrolled);
      
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Fingerprint');
      } else {
        setBiometricType('Biometric');
      }
    } catch (error) {
      console.log('Biometric check error:', error);
      setBiometricAvailable(false);
    }
  };
  
  const handleBiometricToggle = async (value) => {
    if (!biometricAvailable) {
      Alert.alert(
        'Biometric Not Available',
        'Please set up fingerprint or face recognition in your device settings first.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (value) {
      // Enable biometric - require authentication first
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to enable biometric login',
          cancelLabel: 'Cancel',
          fallbackLabel: 'Use PIN'
        });
        
        if (result.success) {
          setBiometricEnabled(true);
          Alert.alert('Success', 'Biometric login has been enabled!');
        } else {
          Alert.alert('Authentication Failed', 'Could not verify your identity.');
        }
      } catch (error) {
        Alert.alert('Error', 'Biometric authentication failed.');
      }
    } else {
      // Disable biometric - require confirmation
      Alert.alert(
        'Disable Biometric Login',
        'Are you sure you want to disable biometric login?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Disable', style: 'destructive', onPress: () => setBiometricEnabled(false) }
        ]
      );
    }
  };
  


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: theme.background }]}>
        {/* Account Information Section */}
        <View style={[styles.accountSection, { backgroundColor: theme.card }]}>
          <View style={styles.accountHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton} onPress={handleProfileImageChange}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: theme.text }]}>John Doe</Text>
              <Text style={[styles.accountEmail, { color: theme.textSecondary }]}>john.doe@mopay.com</Text>
              <View style={styles.accountStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active Agent</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.subscriptionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.subscriptionHeader}>
              <Ionicons name="card-outline" size={20} color="#3B82F6" />
              <Text style={[styles.subscriptionTitle, { color: theme.text }]}>Subscription Plan</Text>
            </View>
            
            <View style={styles.subscriptionDetails}>
              <View style={styles.planInfo}>
                <Text style={[styles.planName, { color: theme.text }]}>Premium Agent Plan</Text>
                <View style={styles.renewalInfo}>
                  <Text style={[styles.renewalLabel, { color: theme.textSecondary }]}>Next Renewal:</Text>
                  <Text style={[styles.renewalDate, { color: theme.text }]}>March 15, 2024</Text>
                </View>
              </View>
              
              <TouchableOpacity style={[styles.manageButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.manageButtonText, { color: theme.primary }]}>Manage</Text>
                <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.renewalCountdown, { borderTopColor: theme.border }]}>
              <Ionicons name="time-outline" size={14} color="#10B981" />
              <Text style={[styles.countdownText, { color: theme.success }]}>Renews in 23 days</Text>
            </View>
          </View>
        </View>
        
        {/* Money Transfer Settings */}
        <View style={styles.section}>
          <Text style={[styles.instruction, { color: theme.textSecondary }]}>
            Choose SIM(s) for money related transactions.{'\n'}
            NB: SIM must be an agent SIM.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Money Transfer SIM Settings</Text>
          
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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Airtime Transfer SIM Settings</Text>
          <Text style={[styles.instruction, { color: theme.textSecondary }]}>
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
        
        {/* Security & Authentication */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Security & Authentication</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name={biometricType === 'Face ID' ? 'scan' : 'finger-print'} 
                size={20} 
                color={biometricAvailable ? '#3B82F6' : '#9CA3AF'} 
              />
              <View style={styles.biometricLabelContainer}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>Biometric Login</Text>
                {biometricType && (
                  <Text style={[styles.biometricType, { color: theme.textSecondary }]}>({biometricType})</Text>
                )}
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={biometricEnabled ? '#FFFFFF' : '#9CA3AF'}
              disabled={!biometricAvailable}
            />
          </View>
          
          <Text style={[styles.settingDescription, { color: theme.textSecondary }, !biometricAvailable && styles.disabledText]}>
            {biometricAvailable 
              ? `Use ${biometricType.toLowerCase()} to unlock the app securely` 
              : 'Biometric authentication not available on this device'
            }
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notification Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color="#10B981" />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications.push}
              onValueChange={(value) => handleNotificationChange('push', value)}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="mail" size={20} color="#F59E0B" />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Email Alerts</Text>
            </View>
            <Switch
              value={notifications.email}
              onValueChange={(value) => handleNotificationChange('email', value)}
              trackColor={{ false: '#E5E7EB', true: '#F59E0B' }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="card" size={20} color="#8B5CF6" />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Transaction Alerts</Text>
            </View>
            <Switch
              value={notifications.transactions}
              onValueChange={(value) => handleNotificationChange('transactions', value)}
              trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
            />
          </View>
        </View>
        
        <View style={styles.divider} />
        
        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>App Preferences</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="language" size={20} color="#06B6D4" />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Language</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={[styles.valueText, { color: theme.textSecondary }]}>{selectedLanguage}</Text>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name={isDark ? "moon" : "sunny"} size={20} color={isDark ? "#6366F1" : "#F59E0B"} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait" size={20} color="#EC4899" />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Haptic Feedback</Text>
            </View>
            <Switch
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              trackColor={{ false: '#E5E7EB', true: '#EC4899' }}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={20} color="#10B981" />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Sound Effects</Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
            />
          </View>
        </View>
        
        <View style={styles.divider} />
        
        {/* Data Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Management</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="time" size={20} color="#EF4444" />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Transaction History Retention</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={[styles.valueText, { color: theme.textSecondary }]}>{historyRetention === '1month' ? '1 Month' : historyRetention === '3months' ? '3 Months' : '6 Months'}</Text>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          </View>
          
          <TouchableOpacity style={styles.cleanupButton} onPress={handleHistoryCleanup}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={styles.cleanupButtonText}>Clear Old Transaction History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Enhanced Extras Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Extras</Text>
          
          {/* Abnormal Transaction Warning */}
          <View style={[styles.extraFeature, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.featureHeader}>
              <View style={styles.featureInfo}>
                <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                <Text style={[styles.featureTitle, { color: theme.text }]}>Abnormal Transaction Amount Warning</Text>
              </View>
              <Switch
                value={abnormalWarningEnabled}
                onValueChange={setAbnormalWarningEnabled}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={abnormalWarningEnabled ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
              Get alerts before executing transactions that exceed your set thresholds
            </Text>
            
            {abnormalWarningEnabled && (
              <View style={styles.thresholdContainer}>
                <Text style={styles.thresholdLabel}>Set Amount Thresholds:</Text>
                
                <View style={styles.thresholdRow}>
                  <Text style={styles.thresholdType}>Airtime</Text>
                  <View style={styles.amountInput}>
                    <Text style={styles.currencySymbol}>GH₵</Text>
                    <TextInput
                      style={styles.amountField}
                      placeholder="0.00"
                      value={thresholds.airtime}
                      onChangeText={(value) => handleThresholdChange('airtime', value)}
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
                
                <View style={styles.thresholdRow}>
                  <Text style={styles.thresholdType}>Cash In</Text>
                  <View style={styles.amountInput}>
                    <Text style={styles.currencySymbol}>GH₵</Text>
                    <TextInput
                      style={styles.amountField}
                      placeholder="0.00"
                      value={thresholds.cashIn}
                      onChangeText={(value) => handleThresholdChange('cashIn', value)}
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
                
                <View style={styles.thresholdRow}>
                  <Text style={styles.thresholdType}>Cash Out</Text>
                  <View style={styles.amountInput}>
                    <Text style={styles.currencySymbol}>GH₵</Text>
                    <TextInput
                      style={styles.amountField}
                      placeholder="0.00"
                      value={thresholds.cashOut}
                      onChangeText={(value) => handleThresholdChange('cashOut', value)}
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
          
          {/* Phone Number History */}
          <View style={[styles.extraFeature, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.featureHeader}>
              <View style={styles.featureInfo}>
                <Ionicons name="people-outline" size={20} color="#10B981" />
                <Text style={[styles.featureTitle, { color: theme.text }]}>Smart Customer Suggestions</Text>
              </View>
              <Switch
                value={phoneHistoryEnabled}
                onValueChange={setPhoneHistoryEnabled}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor={phoneHistoryEnabled ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
              Get instant suggestions for frequent customers as you type phone numbers. Save time on repeat transactions.
            </Text>
            
            {phoneHistoryEnabled && (
              <View style={styles.historyPreview}>
                <Text style={styles.previewTitle}>Example suggestions while typing:</Text>
                <View style={styles.previewItem}>
                  <Text style={styles.previewPhone}>024-123-4567</Text>
                  <Text style={styles.previewHistory}>Frequent customer • Last: Cash In GH₵50</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewPhone}>055-987-6543</Text>
                  <Text style={styles.previewHistory}>Regular customer • 12 transactions this month</Text>
                </View>
                <View style={styles.benefitNote}>
                  <Ionicons name="flash" size={14} color="#F59E0B" />
                  <Text style={styles.benefitText}>Faster transactions for repeat customers</Text>
                </View>
              </View>
            )}
          </View>
          
          {/* Save Settings Button */}
          <TouchableOpacity 
            style={[styles.saveButton, settingsSaved && styles.saveButtonSuccess]} 
            onPress={saveSettings}
          >
            <Ionicons 
              name={settingsSaved ? "checkmark-circle" : "save-outline"} 
              size={20} 
              color={settingsSaved ? "#10B981" : "#FFFFFF"} 
            />
            <Text style={[styles.saveButtonText, settingsSaved && styles.saveButtonTextSuccess]}>
              {settingsSaved ? 'Settings Saved!' : 'Save Settings'}
            </Text>
          </TouchableOpacity>
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
    backgroundColor: '#f5f7f8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#333',
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
  // Enhanced Extras Styles
  extraFeature: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  thresholdContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  thresholdLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  thresholdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  thresholdType: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    flex: 1,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    minWidth: 120,
  },
  currencySymbol: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginRight: 4,
  },
  amountField: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    padding: 0,
  },
  historyPreview: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 12,
  },
  previewItem: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
  },
  previewPhone: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  previewHistory: {
    fontSize: 12,
    color: '#059669',
    marginTop: 2,
  },
  benefitNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
  },
  benefitText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonSuccess: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButtonTextSuccess: {
    color: '#10B981',
  },
  
  // Account Section Styles
  accountSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  accountStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  subscriptionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  subscriptionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  renewalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renewalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 6,
  },
  renewalDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  manageButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    marginRight: 4,
  },
  renewalCountdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  countdownText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // New Settings Styles
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: 12,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 32,
    lineHeight: 20,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  cleanupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cleanupButtonText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Biometric Styles
  biometricLabelContainer: {
    marginLeft: 12,
  },
  biometricType: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 2,
  },
  disabledText: {
    color: '#9CA3AF',
  },

});