import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Network Configuration
export const NETWORKS = {
  MTN: {
    id: 'mtn',
    name: 'MTN Mobile Money',
    color: '#FFC107',
    logo: 'mtn-logo',
    ussdPrefix: '*170#',
    apiEndpoint: 'https://api.mtn.com/momo',
  },
  AIRTELTIGO: {
    id: 'airteltigo',
    name: 'AirtelTigo Money',
    color: '#FF5722',
    logo: 'airteltigo-logo',
    ussdPrefix: '*110#',
    apiEndpoint: 'https://api.airteltigo.com/momo',
  },
  VODAFONE: {
    id: 'vodafone',
    name: 'Vodafone Cash',
    color: '#E91E63',
    logo: 'vodafone-logo',
    ussdPrefix: '*110#',
    apiEndpoint: 'https://api.vodafone.com/cash',
  },
};

// SIM Card Management
export const SIM_SLOTS = {
  SIM1: 'sim1',
  SIM2: 'sim2',
};

// Account Types
export const ACCOUNT_TYPES = {
  PERSONAL: 'personal',
  AGENT: 'agent',
  BUSINESS: 'business',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  CASH_IN: 'cash_in',
  CASH_OUT: 'cash_out',
  SEND_MONEY: 'send_money',
  BUY_AIRTIME: 'buy_airtime',
  PAY_BILL: 'pay_bill',
  BALANCE_CHECK: 'balance_check',
};

// Multi-Network Context
const MultiNetworkContext = createContext();

export const useMultiNetwork = () => {
  const context = useContext(MultiNetworkContext);
  if (!context) {
    throw new Error('useMultiNetwork must be used within a MultiNetworkProvider');
  }
  return context;
};

export const MultiNetworkProvider = ({ children }) => {
  const [accounts, setAccounts] = useState({});
  const [activeNetwork, setActiveNetwork] = useState(NETWORKS.MTN.id);
  const [simAssignments, setSimAssignments] = useState({});
  const [isOnline, setIsOnline] = useState(true);
  const [transactions, setTransactions] = useState([]);

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedAccounts = await SecureStore.getItemAsync('mopay_accounts');
      const savedSimAssignments = await SecureStore.getItemAsync('mopay_sim_assignments');
      const savedTransactions = await AsyncStorage.getItem('mopay_transactions');

      if (savedAccounts) {
        setAccounts(JSON.parse(savedAccounts));
      }
      if (savedSimAssignments) {
        setSimAssignments(JSON.parse(savedSimAssignments));
      }
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  // Save data whenever it changes
  useEffect(() => {
    saveAccounts();
  }, [accounts]);

  useEffect(() => {
    saveSimAssignments();
  }, [simAssignments]);

  useEffect(() => {
    saveTransactions();
  }, [transactions]);

  const saveAccounts = async () => {
    try {
      await SecureStore.setItemAsync('mopay_accounts', JSON.stringify(accounts));
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  };

  const saveSimAssignments = async () => {
    try {
      await SecureStore.setItemAsync('mopay_sim_assignments', JSON.stringify(simAssignments));
    } catch (error) {
      console.error('Error saving SIM assignments:', error);
    }
  };

  const saveTransactions = async () => {
    try {
      await AsyncStorage.setItem('mopay_transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  // Account Management Functions
  const addAccount = async (networkId, accountData) => {
    const newAccount = {
      id: `${networkId}_${Date.now()}`,
      networkId,
      ...accountData,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setAccounts(prev => ({
      ...prev,
      [networkId]: [...(prev[networkId] || []), newAccount]
    }));

    return newAccount;
  };

  const removeAccount = async (networkId, accountId) => {
    setAccounts(prev => ({
      ...prev,
      [networkId]: prev[networkId]?.filter(acc => acc.id !== accountId) || []
    }));
  };

  const assignSimToNetwork = (simSlot, networkId) => {
    setSimAssignments(prev => ({
      ...prev,
      [simSlot]: networkId
    }));
  };

  // Transaction Functions
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: `txn_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...transaction,
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const getTransactionsByNetwork = (networkId) => {
    return transactions.filter(txn => txn.networkId === networkId);
  };

  const getTotalBalance = (networkId) => {
    const networkAccounts = accounts[networkId] || [];
    return networkAccounts.reduce((total, account) => total + (account.balance || 0), 0);
  };

  const value = {
    // State
    accounts,
    activeNetwork,
    simAssignments,
    isOnline,
    transactions,

    // Networks config
    networks: NETWORKS,
    simSlots: SIM_SLOTS,
    accountTypes: ACCOUNT_TYPES,
    transactionTypes: TRANSACTION_TYPES,

    // Actions
    setActiveNetwork,
    addAccount,
    removeAccount,
    assignSimToNetwork,
    addTransaction,
    getTransactionsByNetwork,
    getTotalBalance,
  };

  return (
    <MultiNetworkContext.Provider value={value}>
      {children}
    </MultiNetworkContext.Provider>
  );
};