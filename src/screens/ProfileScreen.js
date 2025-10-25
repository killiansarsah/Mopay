import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/tokens';

export default function ProfileScreen({ visible, onClose }) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Yvonne',
    displayName: 'Yvonne',
    email: 'Yvonne@mopay.com',
    profileImage: null,
    subscription: 'Premium Agent',
    subscriptionStatus: 'Active',
    nextRenewal: '2025-12-01',
    agentId: 'AG001234'
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  console.log('ProfileScreen rendered, visible:', visible);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) {
        const data = JSON.parse(saved);
        setProfile(data);
        setEditedProfile(data);
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(editedProfile));
      setProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const cancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setEditedProfile({...editedProfile, profileImage: result.assets[0].uri});
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>My Profile</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.avatarSection}>
            <TouchableOpacity 
              style={styles.avatarContainer} 
              onPress={isEditing ? pickImage : null}
              disabled={!isEditing}
            >
              {(isEditing ? editedProfile.profileImage : profile.profileImage) ? (
                <Image 
                  source={{ uri: isEditing ? editedProfile.profileImage : profile.profileImage }} 
                  style={styles.avatarImage} 
                />
              ) : (
                <View style={styles.avatar}>
                  <MaterialIcons name="person" size={40} color="#fff" />
                </View>
              )}
              {isEditing && (
                <View style={styles.cameraIcon}>
                  <MaterialIcons name="camera-alt" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
            <Text style={[styles.agentId, { color: theme.textSecondary }]}>Agent ID: {profile.agentId}</Text>
            {isEditing && (
              <Text style={[styles.photoHint, { color: theme.textSecondary }]}>Tap to change photo</Text>
            )}
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                value={isEditing ? editedProfile.name : profile.name}
                onChangeText={(text) => setEditedProfile({...editedProfile, name: text})}
                editable={isEditing}
                placeholder="Enter your full name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Display Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                value={isEditing ? editedProfile.displayName : profile.displayName}
                onChangeText={(text) => setEditedProfile({...editedProfile, displayName: text})}
                editable={isEditing}
                placeholder="How others see your name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                value={isEditing ? editedProfile.email : profile.email}
                onChangeText={(text) => setEditedProfile({...editedProfile, email: text})}
                editable={isEditing}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.subscriptionSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Subscription Details</Text>
              
              <View style={[styles.subscriptionCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <View style={styles.subscriptionHeader}>
                  <View style={styles.subscriptionBadge}>
                    <MaterialIcons name="star" size={16} color="#fff" />
                  </View>
                  <View style={styles.subscriptionInfo}>
                    <Text style={[styles.subscriptionName, { color: theme.text }]}>{profile.subscription}</Text>
                    <View style={styles.statusContainer}>
                      <View style={[styles.statusDot, { backgroundColor: profile.subscriptionStatus === 'Active' ? '#10b981' : '#f59e0b' }]} />
                      <Text style={[styles.subscriptionStatus, { color: profile.subscriptionStatus === 'Active' ? '#10b981' : '#f59e0b' }]}>
                        {profile.subscriptionStatus}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.renewalInfo}>
                  <MaterialIcons name="schedule" size={16} color={theme.textSecondary} />
                  <Text style={[styles.renewalText, { color: theme.textSecondary }]}>Next renewal: {profile.nextRenewal}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actions}>
          {isEditing ? (
            <View style={styles.editActions}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={cancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveProfile}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setIsEditing(true)}>
              <MaterialIcons name="edit" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryStart,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryStart,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  agentId: {
    fontSize: 14,
    fontWeight: '500',
  },
  photoHint: {
    fontSize: 12,
    marginTop: 4,
  },
  form: {
    padding: 20,
    paddingTop: 0,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  subscriptionSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  subscriptionCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  subscriptionStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  renewalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renewalText: {
    fontSize: 14,
    marginLeft: 6,
  },
  actions: {
    padding: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    minHeight: 48,
  },
  editButton: {
    backgroundColor: colors.primaryStart,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primaryStart,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});