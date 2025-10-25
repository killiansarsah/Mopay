import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, RefreshControl, StyleSheet, TextInput, Switch, Alert, TouchableOpacity, Image, Modal, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import OptimizedActionGrid from '../components/OptimizedActionGrid';
import EnhancedInputField from '../components/EnhancedInputField';
import TransactionCard from '../components/TransactionCard';
import UnifiedDashboard from '../components/UnifiedDashboard';

import { AppContext } from '../state/AppContext';
import { useMultiNetwork } from '../state/MultiNetworkContext';
import { spacing, colors } from '../theme/tokens';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { transactions, addTransaction } = useContext(AppContext);
  
  // Get threshold settings from AsyncStorage
  const [thresholds, setThresholds] = useState({ airtime: '', cashIn: '', cashOut: '' });
  const [abnormalWarningEnabled, setAbnormalWarningEnabled] = useState(false);
  
  useEffect(() => {
    loadThresholdSettings();
    // Listen for settings changes
    const interval = setInterval(loadThresholdSettings, 1000);
    
    // Start pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    
    return () => {
      clearInterval(interval);
      pulseAnimation.stop();
    };
  }, []);
  
  const loadThresholdSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('thresholdSettings');
      const warningEnabled = await AsyncStorage.getItem('abnormalWarningEnabled');
      if (settings) setThresholds(JSON.parse(settings));
      if (warningEnabled) setAbnormalWarningEnabled(JSON.parse(warningEnabled));
    } catch (error) {
      console.log('Error loading threshold settings:', error);
    }
  };
  const [refreshing, setRefreshing] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [ported, setPorted] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [countryCode, setCountryCode] = useState('+233');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Subscription Renewal',
      message: 'Your Premium Agent plan renews in 23 days on December 1, 2025',
      type: 'renewal',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: 2,
      title: 'Transaction Alert',
      message: 'Large transaction detected: GH₵5,000 Cash Out completed',
      type: 'transaction',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    {
      id: 3,
      title: 'Security Notice',
      message: 'New device login detected. Please verify if this was you.',
      type: 'security',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false
    },
    {
      id: 4,
      title: 'Daily Limit Warning',
      message: 'You have reached 80% of your daily transaction limit (GH₵8,000/10,000)',
      type: 'transaction',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      read: true
    },
    {
      id: 5,
      title: 'System Maintenance',
      message: 'Scheduled maintenance on December 15, 2024 from 2:00 AM - 4:00 AM',
      type: 'renewal',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      read: false
    },
    {
      id: 6,
      title: 'Failed Transaction',
      message: 'Cash Out transaction of GH₵2,500 to 024-567-8901 failed. Please retry.',
      type: 'security',
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      read: false
    },
    {
      id: 7,
      title: 'Commission Update',
      message: 'Your commission rate has been updated to 2.8% effective immediately',
      type: 'transaction',
      timestamp: new Date(Date.now() - 21600000).toISOString(),
      read: true
    },
    {
      id: 8,
      title: 'Password Changed',
      message: 'Your account password was successfully changed on December 10, 2024',
      type: 'security',
      timestamp: new Date(Date.now() - 25200000).toISOString(),
      read: true
    }
  ]);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(-320)).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const formatPhoneNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Format as XXX XXX XXXX
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    return text;
  };

  const validateAmount = (value) => {
    if (!value.trim()) {
      setAmountError('Amount is required');
      return false;
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setAmountError('Please enter a valid amount');
      return false;
    }
    if (numValue > 10000) {
      setAmountError('Amount cannot exceed GHS 10,000');
      return false;
    }
    setAmountError('');
    return true;
  };

  const validatePhone = (value) => {
    if (!value.trim()) {
      setPhoneError('Phone number is required');
      return false;
    }
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 9 || cleaned.length > 10) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleAmountChange = (text) => {
    setAmount(text);
    if (text.trim()) validateAmount(text);
    else setAmountError('');
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
    if (text.trim()) validatePhone(text);
    else setPhoneError('');
    
    // Check for existing customers when user types 7+ digits
    const cleanedInput = text.replace(/\D/g, '');
    
    if (cleanedInput.length >= 7) {
      const existingNumbers = [];
      
      transactions.forEach(tx => {
        const txPhone = tx.phoneNumber || tx.phone || '';
        const cleanedTxPhone = txPhone.replace(/\D/g, '');
        
        if (cleanedTxPhone.includes(cleanedInput) && cleanedTxPhone !== cleanedInput) {
          if (!existingNumbers.includes(txPhone)) {
            existingNumbers.push(txPhone);
          }
        }
      });
      
      if (existingNumbers.length > 0) {
        setSuggestions(existingNumbers[0]);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleMenuPress = () => {
    setShowMenu(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -320,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMenu(false);
    });
  };

  const menuItems = [
    { icon: 'person', title: 'My Profile', subtitle: 'View and edit profile', action: () => {
      Alert.alert('Profile Test', 'Profile menu was clicked! Modal state: ' + showProfile);
      setShowProfile(true);
    } },
    { icon: 'settings', title: 'Account Settings', subtitle: 'Manage preferences', action: () => Alert.alert('Settings', 'Manage your account preferences') },
    { icon: 'help', title: 'Help & Support', subtitle: 'Get assistance', action: () => Alert.alert('Help', 'Get help and contact support') },
    { icon: 'security', title: 'Security', subtitle: 'Privacy & security settings', action: () => Alert.alert('Security', 'Manage security settings') },
    { icon: 'report', title: 'Report Fraud', subtitle: 'Report suspicious activity', action: () => {
      Alert.alert('Report Fraud', 'Report suspicious transactions or activities to help keep the platform secure.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', onPress: () => Alert.alert('Fraud Reported', 'Thank you for reporting. Our security team will investigate.') }
      ]);
    }},
    { icon: 'logout', title: 'Logout', subtitle: 'Sign out of account', action: () => {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => Alert.alert('Logged Out', 'Successfully logged out') }
      ]);
    }}
  ];

  const processTransaction = (action, transactionAmount) => {
    const transaction = {
      type: action.label,
      amount: transactionAmount,
      phone: phone.replace(/\s/g, ''),
      network: phone.startsWith('024') || phone.startsWith('054') || phone.startsWith('055') ? 'MTN' : 
              phone.startsWith('027') || phone.startsWith('057') || phone.startsWith('026') ? 'AirtelTigo' : 'Vodafone',
      commission: transactionAmount * 0.025
    };
    addTransaction(transaction);
    Alert.alert('Success', `${action.label} transaction completed successfully!`);
    setAmount('');
    setPhone('');
    setPorted(false);
  };

  const clearForm = () => {
    Alert.alert('Clear form', 'Are you sure you want to clear the form?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => { 
        setAmount(''); 
        setPhone(''); 
        setPorted(false);
        setAmountError('');
        setPhoneError('');
      }},
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={theme.statusBar} backgroundColor={theme.surface} />
      {/* Top Bar (matches provided HTML layout) */}
      <View style={[styles.topBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={styles.leftGroup}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleMenuPress}>
            <MaterialIcons name="menu" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.topTitle, { color: theme.text }]}>MoPay Agent</Text>
        <View style={styles.rightGroup}>
          <TouchableOpacity style={styles.notificationBtn} onPress={() => setShowNotifications(true)}>
            <Animated.View style={{ transform: [{ scale: notifications.filter(n => !n.read).length > 0 ? pulseAnim : 1 }] }}>
              <MaterialIcons name="notifications" size={22} color="#111827" />
            </Animated.View>
            {notifications.filter(n => !n.read).length > 0 && (
              <Animated.View style={[styles.notificationBadge, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.badgeText}>{notifications.filter(n => !n.read).length}</Text>
              </Animated.View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn}>
            <MaterialIcons name="storefront" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 0, paddingBottom: spacing.lg }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.container}>
          <View style={[styles.formCard, { backgroundColor: theme.card }]}>
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Amount *</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }, amountError && styles.inputError]}>
                  <Animated.Text 
                    style={[
                      styles.currencySymbol, 
                      { transform: [{ scale: pulseAnim }] }
                    ]}
                  >
                    GH₵
                  </Animated.Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    value={amount}
                    onChangeText={handleAmountChange}
                    style={[styles.amountInput, { color: theme.text }]}
                    accessibilityLabel="Amount input"
                    accessibilityHint="Enter the transaction amount in Ghana Cedis"
                  />
                </View>
                {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Phone Number *</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }, phoneError && styles.inputError]}>
                  <TextInput
                    keyboardType="phone-pad"
                    placeholder="024 123 4567"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    style={[styles.phoneInput, { color: theme.text }]}
                    maxLength={12}
                    accessibilityLabel="Phone number input"
                    accessibilityHint="Enter the recipient's phone number"
                  />
                </View>
                {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                {showSuggestions && (
                  <TouchableOpacity 
                    style={[styles.suggestionBubble, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={() => {
                      setPhone(formatPhoneNumber(suggestions));
                      setShowSuggestions(false);
                    }}
                  >
                    <Text style={[styles.suggestionText, { color: theme.text }]}>{suggestions}</Text>
                  </TouchableOpacity>
                )}

              </View>
            </View>
            <View style={styles.rowSmall}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Switch value={ported} onValueChange={setPorted} />
                <Text style={{ marginLeft: 8, color: theme.text }}>Number is ported</Text>
              </View>
              <Text onPress={clearForm} style={{ color: colors.primaryStart, fontWeight: '600' }}>Clear</Text>
            </View>
          </View>

          <OptimizedActionGrid onPress={(action) => {
            if (amount && phone && validateAmount(amount) && validatePhone(phone)) {
              const transactionAmount = parseFloat(amount);
              
              // Check abnormal transaction warning
              if (abnormalWarningEnabled) {
                let threshold = 0;
                const actionType = action.label.toLowerCase();
                
                if (actionType.includes('airtime') && thresholds.airtime) {
                  threshold = parseFloat(thresholds.airtime);
                } else if (actionType.includes('cash in') && thresholds.cashIn) {
                  threshold = parseFloat(thresholds.cashIn);
                } else if (actionType.includes('cash out') && thresholds.cashOut) {
                  threshold = parseFloat(thresholds.cashOut);
                }
                
                if (threshold > 0 && transactionAmount > threshold) {
                  Alert.alert(
                    'Abnormal Transaction Amount',
                    `This ${action.label} amount (GH₵${transactionAmount}) exceeds your set threshold of GH₵${threshold}. Do you want to continue?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Continue', onPress: () => processTransaction(action, transactionAmount) }
                    ]
                  );
                  return;
                }
              }
              
              processTransaction(action, transactionAmount);
            } else {
              Alert.alert('Error', 'Please fill in valid amount and phone number');
            }
          }} />

          <View style={{ marginTop: spacing.md }}>
            <Text style={{ color: theme.text, fontSize: 16, marginBottom: 8, fontWeight: '700' }}>Recent Transactions</Text>
            {transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6).map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </View>
        </View>

        {/* Multi-Network Dashboard */}
        <View style={{ marginTop: spacing.lg }}>
          <UnifiedDashboard />
        </View>
      </ScrollView>
      
      {/* Professional Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity 
          style={styles.menuOverlay} 
          activeOpacity={1} 
          onPress={closeMenu}
        >
          <Animated.View style={[
            styles.menuContainer, 
            { backgroundColor: theme.card, transform: [{ translateX: slideAnim }] }
          ]}>
            <View style={[styles.menuHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.menuTitle, { color: theme.text }]}>Menu</Text>
              <TouchableOpacity onPress={closeMenu}>
                <MaterialIcons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuContent}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.menuItem, { borderBottomColor: theme.border }]}
                  onPress={() => {
                    closeMenu();
                    setTimeout(item.action, 300);
                  }}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: theme.background }]}>
                    <MaterialIcons name={item.icon} size={20} color={colors.primaryStart} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={[styles.menuItemTitle, { color: theme.text }]}>{item.title}</Text>
                    <Text style={[styles.menuItemSubtitle, { color: theme.textSecondary }]}>{item.subtitle}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Profile Modal */}
      {showProfile && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: '90%',
            maxHeight: '80%'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>My Profile</Text>
            <Text>Name: Adeleke Adekunle</Text>
            <Text>Agent ID: MPA-84321</Text>
            <Text>Email: a.adekunle@mopay.com</Text>
            <TouchableOpacity 
              onPress={() => setShowProfile(false)}
              style={{
                backgroundColor: '#007bff',
                padding: 10,
                borderRadius: 5,
                marginTop: 20,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <Modal
        visible={false}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProfile(false)}
      >
        <View style={styles.profileOverlay}>
          <View style={[styles.profileContainer, { backgroundColor: theme.card }]}>
            <View style={[styles.profileHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.profileTitle, { color: theme.text }]}>My Profile</Text>
              <TouchableOpacity onPress={() => setShowProfile(false)}>
                <MaterialIcons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.profileContent}>
              <View style={styles.profileAvatarSection}>
                <View style={styles.profileAvatar}>
                  <MaterialIcons name="person" size={40} color="#fff" />
                </View>
                <Text style={[styles.profileName, { color: theme.text }]}>Adeleke Adekunle</Text>
                <Text style={[styles.profileAgentId, { color: theme.textSecondary }]}>Agent ID: MPA-84321</Text>
              </View>
              
              <View style={styles.profileSections}>
                {/* Personal Details */}
                <View style={styles.profileSection}>
                  <Text style={[styles.profileSectionTitle, { color: theme.textSecondary }]}>Personal Details</Text>
                  <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.profileItem}>
                      <View style={[styles.profileIcon, { backgroundColor: colors.primaryStart + '20' }]}>
                        <MaterialIcons name="phone" size={20} color={colors.primaryStart} />
                      </View>
                      <View style={styles.profileItemText}>
                        <Text style={[styles.profileItemLabel, { color: theme.textSecondary }]}>Phone Number</Text>
                        <Text style={[styles.profileItemValue, { color: theme.text }]}>+234 801 234 5678</Text>
                      </View>
                    </View>
                    <View style={[styles.profileDivider, { borderColor: theme.border }]} />
                    <View style={styles.profileItem}>
                      <View style={[styles.profileIcon, { backgroundColor: colors.primaryStart + '20' }]}>
                        <MaterialIcons name="email" size={20} color={colors.primaryStart} />
                      </View>
                      <View style={styles.profileItemText}>
                        <Text style={[styles.profileItemLabel, { color: theme.textSecondary }]}>Email Address</Text>
                        <Text style={[styles.profileItemValue, { color: theme.text }]}>a.adekunle@mopay.com</Text>
                      </View>
                    </View>
                    <View style={[styles.profileDivider, { borderColor: theme.border }]} />
                    <View style={styles.profileItem}>
                      <View style={[styles.profileIcon, { backgroundColor: colors.primaryStart + '20' }]}>
                        <MaterialIcons name="cake" size={20} color={colors.primaryStart} />
                      </View>
                      <View style={styles.profileItemText}>
                        <Text style={[styles.profileItemLabel, { color: theme.textSecondary }]}>Date of Birth</Text>
                        <Text style={[styles.profileItemValue, { color: theme.text }]}>15 August 1985</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Business Information */}
                <View style={styles.profileSection}>
                  <Text style={[styles.profileSectionTitle, { color: theme.textSecondary }]}>Business Information</Text>
                  <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.profileItem}>
                      <View style={[styles.profileIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                        <MaterialIcons name="storefront" size={20} color="#4CAF50" />
                      </View>
                      <View style={styles.profileItemText}>
                        <Text style={[styles.profileItemLabel, { color: theme.textSecondary }]}>Business Name</Text>
                        <Text style={[styles.profileItemValue, { color: theme.text }]}>Adeleke Connect</Text>
                      </View>
                    </View>
                    <View style={[styles.profileDivider, { borderColor: theme.border }]} />
                    <View style={styles.profileItem}>
                      <View style={[styles.profileIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                        <MaterialIcons name="location-on" size={20} color="#4CAF50" />
                      </View>
                      <View style={styles.profileItemText}>
                        <Text style={[styles.profileItemLabel, { color: theme.textSecondary }]}>Business Address</Text>
                        <Text style={[styles.profileItemValue, { color: theme.text }]}>123, Ikorodu Road, Lagos, Nigeria</Text>
                      </View>
                    </View>
                    <View style={[styles.profileDivider, { borderColor: theme.border }]} />
                    <View style={styles.profileItem}>
                      <View style={[styles.profileIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                        <MaterialIcons name="workspace-premium" size={20} color="#4CAF50" />
                      </View>
                      <View style={styles.profileItemText}>
                        <Text style={[styles.profileItemLabel, { color: theme.textSecondary }]}>Agent Tier</Text>
                        <Text style={[styles.profileItemValue, { color: theme.text }]}>Gold Tier Agent</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Account Actions */}
                <View style={styles.profileSection}>
                  <Text style={[styles.profileSectionTitle, { color: theme.textSecondary }]}>Account Actions</Text>
                  <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <TouchableOpacity style={styles.profileActionItem}>
                      <View style={[styles.profileIcon, { backgroundColor: '#6B7280' + '20' }]}>
                        <MaterialIcons name="lock-reset" size={20} color="#6B7280" />
                      </View>
                      <Text style={[styles.profileActionText, { color: theme.text }]}>Change Password</Text>
                      <MaterialIcons name="chevron-right" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                    <View style={[styles.profileDivider, { borderColor: theme.border }]} />
                    <TouchableOpacity style={styles.profileActionItem}>
                      <View style={[styles.profileIcon, { backgroundColor: '#D32F2F' + '20' }]}>
                        <MaterialIcons name="logout" size={20} color="#D32F2F" />
                      </View>
                      <Text style={[styles.profileActionText, { color: '#D32F2F' }]}>Log Out</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.profileEditButton}>
                <MaterialIcons name="edit" size={20} color="#fff" />
                <Text style={styles.profileEditButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={styles.notificationRow}
                  onPress={() => {
                    setNotifications(prev => prev.map(n => n.id === notification.id ? {...n, read: true} : n));
                    setShowNotifications(false);
                    Alert.alert('Notification', notification.title);
                  }}
                >
                  <View style={[styles.notificationDot, { backgroundColor: 
                    notification.type === 'renewal' ? '#3B82F6' :
                    notification.type === 'transaction' ? '#10B981' : '#EF4444'
                  }]} />
                  <View style={styles.notificationText}>
                    <Text style={styles.notificationRowTitle}>{notification.title}</Text>
                    <Text style={styles.notificationRowMessage}>{notification.message}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    padding: 16,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  formSection: {
    gap: 16,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'System',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  currencySymbol: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
  },
  amountInput: {
    flex: 1,
    color: '#111827',
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 16,
  },

  phoneInput: {
    flex: 1,
    color: '#111827',
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 4,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f7f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e9ef',
  },
  leftGroup: { flexDirection: 'row', alignItems: 'center' },
  rightGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  topTitle: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', flex: 1 },
  iconBtn: { padding: 6 },

  notificationBtn: {
    position: 'relative',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  profileBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#068cf9', alignItems: 'center', justifyContent: 'center' },
  rowSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  suggestionBubble: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  menuContainer: {
    backgroundColor: '#fff',
    width: '80%',
    maxWidth: 320,
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  menuContent: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
  },
  profileOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileContent: {
    flex: 1,
  },
  profileAvatarSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileAgentId: {
    fontSize: 14,
    fontWeight: '500',
  },
  profileSections: {
    padding: 16,
  },
  profileSection: {
    marginBottom: 24,
  },
  profileSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  profileCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileItemText: {
    flex: 1,
  },
  profileItemLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileItemValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  profileDivider: {
    height: 1,
    marginHorizontal: 16,
    borderTopWidth: 1,
  },
  profileActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileActionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
  profileActions: {
    padding: 20,
  },
  profileEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    minHeight: 48,
  },
  profileEditButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '70%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    maxHeight: 400,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationRowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationRowMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
});
