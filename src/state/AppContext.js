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
      if (p) setProfile(JSON.parse(p));
      else {
        const data = await mockApi.getProfile();
        setProfile(data);
        AsyncStorage.setItem('profile', JSON.stringify(data));
      }

      const tx = await mockApi.getTransactions();
      setTransactions(tx);
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
