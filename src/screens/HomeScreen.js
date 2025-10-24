import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, TextInput, Switch, Alert, TouchableOpacity, Image } from 'react-native';
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

export default function HomeScreen() {
  const { transactions } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [ported, setPorted] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [countryCode, setCountryCode] = useState('+233');

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
  };

  const handleMenuPress = () => {
    const menuOptions = [
      { text: 'Profile', onPress: () => Alert.alert('Profile', 'View and edit your profile information') },
      { text: 'Account Settings', onPress: () => Alert.alert('Account Settings', 'Manage your account preferences') },
      { text: 'Help & Support', onPress: () => Alert.alert('Help & Support', 'Get help and contact support') },
      { text: 'Logout', style: 'destructive', onPress: () => Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => Alert.alert('Logged Out', 'You have been logged out successfully') }
      ])},
      { text: 'Cancel', style: 'cancel' }
    ];
    
    Alert.alert('Menu', 'Choose an option:', menuOptions);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7f8ff' }}>
      <StatusBar style="dark" backgroundColor="#f5f7f8" />
      {/* Top Bar (matches provided HTML layout) */}
      <View style={styles.topBar}>
        <View style={styles.leftGroup}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleMenuPress}>
            <MaterialIcons name="menu" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeBtn}>
            <View style={styles.themeToggleInner}>
              <MaterialIcons name="dark-mode" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.topTitle}>MoPay Agent</Text>
        <View style={styles.rightGroup}>
          <TouchableOpacity style={styles.profileBtn}>
            <MaterialIcons name="person" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 0, paddingBottom: spacing.lg }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.container}>
          <View style={styles.formCard}>
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount *</Text>
                <View style={[styles.inputContainer, amountError && styles.inputError]}>
                  <Text style={styles.currencyPrefix}>GHS</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    value={amount}
                    onChangeText={handleAmountChange}
                    style={styles.amountInput}
                    accessibilityLabel="Amount input"
                    accessibilityHint="Enter the transaction amount in Ghana Cedis"
                  />
                </View>
                {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <View style={[styles.inputContainer, phoneError && styles.inputError]}>
                  <TextInput
                    keyboardType="phone-pad"
                    placeholder="024 123 4567"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    style={styles.phoneInput}
                    maxLength={12}
                    accessibilityLabel="Phone number input"
                    accessibilityHint="Enter the recipient's phone number"
                  />
                </View>
                {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
              </View>
            </View>
            <View style={styles.rowSmall}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Switch value={ported} onValueChange={setPorted} />
                <Text style={{ marginLeft: 8, color: '#374151ff' }}>Number is ported</Text>
              </View>
              <Text onPress={clearForm} style={{ color: colors.primaryStart, fontWeight: '600' }}>Clear</Text>
            </View>
          </View>

          <OptimizedActionGrid onPress={(a) => Alert.alert(a.label)} />

          <View style={{ marginTop: spacing.md }}>
            <Text style={{ color: '#111827', fontSize: 16, marginBottom: 8, fontWeight: '700' }}>Recent Transactions</Text>
            {transactions.slice(0, 6).map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </View>
        </View>

        {/* Multi-Network Dashboard */}
        <View style={{ marginTop: spacing.lg }}>
          <UnifiedDashboard />
        </View>
      </ScrollView>
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
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  formSection: {
    gap: 20,
    marginBottom: 16,
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
    minHeight: 56,
    paddingHorizontal: 16,
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
  currencyPrefix: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
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
  rightGroup: { width: 40, alignItems: 'flex-end' },
  topTitle: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', flex: 1 },
  iconBtn: { padding: 6 },
  themeBtn: { marginLeft: 8 },
  themeToggleInner: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#9CA3AF', alignItems: 'center', justifyContent: 'center' },
  profileBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#068cf9', alignItems: 'center', justifyContent: 'center' },
  rowSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
});
