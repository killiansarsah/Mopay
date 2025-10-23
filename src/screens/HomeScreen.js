import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, TextInput, Switch, Alert } from 'react-native';
import Header from '../components/Header';
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
    <View style={{ flex: 1, backgroundColor: '#0f1724' }}>
      <Header />
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
                <Text style={{ marginLeft: 8, color: '#cbd5e1' }}>Number is ported</Text>
              </View>
              <Text onPress={clearForm} style={{ color: colors.primaryStart, fontWeight: '600' }}>Clear</Text>
            </View>
          </View>

          <ActionGrid onPress={(a) => Alert.alert(a.label)} />

          <View style={{ marginTop: spacing.md }}>
            <Text style={{ color: '#fff', fontSize: 16, marginBottom: 8, fontWeight: '700' }}>Recent Transactions</Text>
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
    backgroundColor: '#1c2733',
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
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    fontFamily: 'System',
  },
  input: {
    backgroundColor: '#27313a',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 0,
  },
  rowSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
});
