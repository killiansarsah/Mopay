import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ title = 'MoPay Agent Portal', onProfilePress }) {
  return (
    <LinearGradient colors={[colors.primaryStart, colors.primaryEnd]} style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.left}>
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.right}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onProfilePress} style={styles.avatarBtn}>
            <Image source={{ uri: 'https://placehold.co/48x48' }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: spacing.md,
  },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { width: 32 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  right: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginRight: 12 },
  avatarBtn: {},
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eee' },
});
