import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useColorScheme } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppProvider } from '../state/AppContext';
import { MultiNetworkProvider } from '../state/MultiNetworkContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const name = {
            Home: 'home',
            History: 'time',
            Reports: 'stats-chart',
            Settings: 'settings',
          }[route.name];

          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <MultiNetworkProvider>
        <AppProvider>
          <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Main" component={Tabs} />
            </Stack.Navigator>
          </NavigationContainer>
        </AppProvider>
      </MultiNetworkProvider>
    </SafeAreaProvider>
  );
}
