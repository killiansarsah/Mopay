import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, TextInput, Switch, Alert, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ActionGrid from '../components/ActionGrid';
import TransactionCard from '../components/TransactionCard';
import { AppContext } from '../state/AppContext';
import { spacing, colors } from '../theme/tokens';

export default function HomeScreen() {
  const { transactions } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [ported, setPorted] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const clearForm = () => {
    Alert.alert('Clear form', 'Are you sure you want to clear the form?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => { setAmount(''); setPhone(''); setPorted(false); } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f7f8ff' }}>
      {/* Top Bar (matches provided HTML layout) */}
      <View style={styles.topBar}>
        <View style={styles.leftGroup}>
          <TouchableOpacity style={styles.iconBtn}><MaterialIcons name="menu" size={24} color="#111827" /></TouchableOpacity>
          <TouchableOpacity style={styles.themeBtn}>
            <View style={styles.themeToggleInner}>
              <MaterialIcons name="dark_mode" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.topTitle}>MoPay Agent Portal</Text>
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
            <View style={styles.formRow}>
              <View style={styles.formCol1}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="GHS"
                  placeholderTextColor="#9CA3AF"
                  value={amount}
                  onChangeText={setAmount}
                  style={styles.input}
                />
              </View>
              <View style={styles.formCol2}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  keyboardType="phone-pad"
                  placeholder="Enter number"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={setPhone}
                  style={styles.input}
                />
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

          <ActionGrid onPress={(a) => Alert.alert(a.label)} />

          <View style={{ marginTop: spacing.md }}>
            <Text style={{ color: '#111827', fontSize: 16, marginBottom: 8, fontWeight: '700' }}>Recent Transactions</Text>
            {transactions.slice(0, 6).map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  formCol1: {
    flex: 1,
    marginRight: 8,
  },
  formCol2: {
    flex: 2,
    marginLeft: 8,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    fontFamily: 'System',
  },
  input: {
    backgroundColor: '#f1f5f9',
    color: '#111827',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 0,
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
