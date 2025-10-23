import React, { useContext, useState } from 'react';
import { View, Text, Switch, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AppContext } from '../state/AppContext';
import { spacing, colors } from '../theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { profile, theme, setTheme } = useContext(AppContext);
  const [pushEnabled, setPushEnabled] = useState(true);

  if (!profile) return null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme === 'dark' ? '#121212' : '#fff' }} contentContainerStyle={{ padding: 0 }}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarIcon}><MaterialIcons name="arrow-back" size={24} color={theme === 'dark' ? '#EAEAEA' : '#333'} /></View>
        <Text style={[styles.topBarTitle, { color: theme === 'dark' ? '#EAEAEA' : '#333' }]}>Profile & Settings</Text>
        <View style={styles.topBarIcon} />
      </View>

      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: profile.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW7oZEzP-CnYaprXowZGNDTPWUJ02frcKQHuwv3Zuga2PqLv7hxx5PvBlLKGtAlKDXlMStaRMS5rpoHxDTTs0SpIRAuGoORRLlVJPflFO1mag46ZR6v6qf9iMliP8vLYdujHhgP6zPnBI6sZMg-S7-NCskUCQsSABpgsTSVnRuYoOuY6wmQ-pHChJsUAxhzsOi8T7qQexFuynoUMbgQdhkj2YbAAreYLALgLu7sRKV24wBhBVq9NW_WxjVYW4e2XTjN5ByCyHc7Jw' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile.name || 'John Doe'}</Text>
          <Text style={styles.agentId}>Agent ID: {profile.id || '12345678'}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={22} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <View style={styles.infoCol}><Text style={styles.infoLabel}>Full Name</Text><Text style={styles.infoValue}>{profile.name}</Text></View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={22} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <View style={styles.infoCol}><Text style={styles.infoLabel}>Phone Number</Text><Text style={styles.infoValue}>{profile.phone}</Text></View>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <MaterialIcons name="email" size={22} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <View style={styles.infoCol}><Text style={styles.infoLabel}>Email Address</Text><Text style={styles.infoValue}>{profile.email || 'john.doe@mopay.com'}</Text></View>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <MaterialIcons name="edit" size={20} color="#fff" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.prefRow}>
              <View style={styles.prefIcon}><MaterialIcons name="notifications" size={22} color={theme === 'dark' ? '#EAEAEA' : '#333'} /></View>
              <Text style={styles.prefLabel}>Push Notifications</Text>
              <Switch value={pushEnabled} onValueChange={setPushEnabled} />
            </View>
            <View style={styles.divider} />
            <View style={styles.prefRow}>
              <View style={styles.prefIcon}><MaterialIcons name="dark-mode" size={22} color={theme === 'dark' ? '#EAEAEA' : '#333'} /></View>
              <Text style={styles.prefLabel}>Dark Mode</Text>
              <Switch value={theme === 'dark'} onValueChange={(v) => setTheme(v ? 'dark' : 'light')} />
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionIcon}><MaterialIcons name="password" size={22} color={theme === 'dark' ? '#EAEAEA' : '#333'} /></View>
              <Text style={styles.actionLabel}>Change Security PIN</Text>
              <MaterialIcons name="chevron-right" size={22} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionIcon}><MaterialIcons name="help" size={22} color={theme === 'dark' ? '#EAEAEA' : '#333'} /></View>
              <Text style={styles.actionLabel}>Help & Support</Text>
              <MaterialIcons name="chevron-right" size={22} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn}>
          <MaterialIcons name="logout" size={22} color={theme === 'dark' ? '#f87171' : '#dc2626'} />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  topBarIcon: { width: 40, alignItems: 'center' },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  container: {
    padding: 16,
    gap: 32,
  },
  profileHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#e5e7eb',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
    textAlign: 'center',
  },
  agentId: {
    color: '#6b7280',
    fontSize: 15,
    textAlign: 'center',
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    gap: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 0,
    paddingVertical: 6,
  },
  infoCol: { flex: 1 },
  infoLabel: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 1,
  },
  infoValue: {
    color: '#222',
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 2,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
    gap: 8,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    gap: 8,
  },
  prefIcon: { width: 32, alignItems: 'center' },
  prefLabel: {
    flex: 1,
    color: '#222',
    fontSize: 16,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 8,
  },
  actionIcon: { width: 32, alignItems: 'center' },
  actionLabel: {
    flex: 1,
    color: '#222',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(220,38,38,0.08)',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 16,
    gap: 8,
  },
  logoutBtnText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 16,
  },
});
