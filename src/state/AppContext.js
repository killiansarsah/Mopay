import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mockApi from '../services/mockApi';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    (async () => {
      const p = await AsyncStorage.getItem('profile');
      console.log('Profile before setting:', p);
      if (p) {
        setProfile(JSON.parse(p));
        console.log('Profile fetched from AsyncStorage:', JSON.parse(p));
      } else {
        const data = await mockApi.getProfile();
        setProfile(data);
        console.log('Profile fetched from API:', data);
        console.log('Setting profile:', data);
        console.log('Profile type:', typeof data);
        AsyncStorage.setItem('profile', JSON.stringify(data));
      }

      const tx = await mockApi.getTransactions();
      setTransactions(tx);
      console.log('Transactions fetched from API:', tx);
      console.log('Setting transactions:', tx);
      console.log('Transactions type:', typeof tx);
      console.log('Transactions structure:', tx);

      // Log transactions to verify data
      console.log('Transactions:', tx);
    })();
  }, []);

  const value = {
    profile,
    setProfile,
    transactions,
    setTransactions,
    theme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
