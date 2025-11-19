import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useImagePicker } from '../../hooks/useImagePicker';
import { uploadImage } from '../../services/firebase.service';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const EditProfileScreen = ({ navigation }: any) => {
  const { user, updateUserProfile } = useAuth();
  const { pickImage } = useImagePicker();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [photoChanged, setPhotoChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhone(user.phoneNumber || '');
      setBio(user.bio || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result) {
      if (Array.isArray(result) && result.length > 0 && result[0].uri) {
        setPhotoURL(result[0].uri);
        setPhotoChanged(true);
      } else if (typeof result === 'string') {
        setPhotoURL(result);
        setPhotoChanged(true);
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      let finalPhotoURL = photoURL;
      
      // Upload new photo if changed
      if (photoChanged && photoURL) {
        finalPhotoURL = await uploadImage(photoURL, 'profiles', user?.id);
      }

      // Update user profile
      await updateUserProfile({
        displayName,
        phoneNumber: phone,
        bio,
        photoURL: finalPhotoURL,
      });

      Alert.alert('Succès', 'Profil mis à jour avec succès');
      navigation.goBack();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      Alert.alert('Erreur', error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={saving}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text style={styles.saveButton}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <Image
            source={{ uri: photoURL || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.changePhotoButton} onPress={handlePickImage}>
            <Text style={styles.changePhotoText}>Changer la photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Votre nom"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={user?.email || ''}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+212 6XX XXX XXX"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Parlez-nous de vous..."
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  avatarSection: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    padding: SIZES.padding * 2,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  formSection: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  inputDisabled: {
    backgroundColor: COLORS.background,
    color: COLORS.textLight,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default EditProfileScreen;
