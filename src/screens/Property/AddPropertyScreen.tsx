import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToCloudinary } from '../../services/cloudinary.service';
import { updateProperty } from '../../services/firebase.service';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { Property } from '../../types';

const AddPropertyScreen = ({ navigation, route }: any) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const propertyToEdit = route.params?.propertyToEdit;
  const isEditMode = !!propertyToEdit;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'sale' as 'sale' | 'rent',
    propertyType: 'apartment' as 'apartment' | 'house' | 'villa' | 'studio' | 'office',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    address: '',
    city: '',
    country: 'France',
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Load existing property data if in edit mode
  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        title: propertyToEdit.title,
        description: propertyToEdit.description,
        price: propertyToEdit.price.toString(),
        type: propertyToEdit.type,
        propertyType: propertyToEdit.propertyType,
        bedrooms: propertyToEdit.bedrooms.toString(),
        bathrooms: propertyToEdit.bathrooms.toString(),
        area: propertyToEdit.area.toString(),
        address: propertyToEdit.location.address,
        city: propertyToEdit.location.city,
        country: propertyToEdit.location.country,
      });
      setImages(propertyToEdit.images);
      setSelectedAmenities(propertyToEdit.amenities);
    }
  }, [propertyToEdit]);

  const amenitiesList = [
    'Parking', 'Piscine', 'Jardin', 'Balcon', 'Ascenseur',
    'Climatisation', 'Chauffage', 'Sécurité', 'Internet', 'Meublé'
  ];

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder aux photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset: any) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const imageUri of images) {
      const folderPath = `properties/${user?.id}`;
      const downloadUrl = await uploadImageToCloudinary(imageUri, folderPath);
      uploadedUrls.push(downloadUrl);
    }
    
    return uploadedUrls;
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à votre localisation');
      return { latitude: 48.8566, longitude: 2.3522 }; // Paris par défaut
    }

    const location = await Location.getCurrentPositionAsync();
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.address || !formData.city) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one photo');
      return;
    }

    setLoading(true);

    try {
      // Only upload new images (images that start with 'file://')
      const newImages = images.filter(img => img.startsWith('file://'));
      const existingImages = images.filter(img => !img.startsWith('file://'));
      
      const uploadedUrls = newImages.length > 0 ? await uploadImages() : [];
      const allImageUrls = [...existingImages, ...uploadedUrls];

      const coordinates = await getCurrentLocation();

      if (isEditMode && propertyToEdit) {
        // Update existing property
        const updateData = {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          type: formData.type,
          propertyType: formData.propertyType,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          area: parseFloat(formData.area),
          location: {
            address: formData.address,
            city: formData.city,
            country: formData.country,
            coordinates,
          },
          images: allImageUrls,
          amenities: selectedAmenities,
        };
        await updateProperty(propertyToEdit.id, updateData);
        Alert.alert('Success', 'Property updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // Create new property
        const newPropertyData = {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          type: formData.type,
          propertyType: formData.propertyType,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          area: parseFloat(formData.area),
          location: {
            address: formData.address,
            city: formData.city,
            country: formData.country,
            coordinates,
          },
          images: allImageUrls,
          amenities: selectedAmenities,
          ownerId: user?.id,
          ownerName: user?.displayName || '',
          ownerPhoto: user?.photoURL || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          featured: false,
          status: 'available' as const,
        };
        await addDoc(collection(db, 'properties'), newPropertyData);
        Alert.alert('Success', 'Property published successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }) }
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while saving the property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Property' : 'Add Property'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesList}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageItem}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color={COLORS.accent} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
              <Ionicons name="camera" size={32} color={COLORS.primary} />
              <Text style={styles.addImageText}>Ajouter</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type de transaction *</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeButton, formData.type === 'sale' && styles.typeButtonActive]}
              onPress={() => setFormData({ ...formData, type: 'sale' })}
            >
              <Text style={[styles.typeText, formData.type === 'sale' && styles.typeTextActive]}>
                Vente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, formData.type === 'rent' && styles.typeButtonActive]}
              onPress={() => setFormData({ ...formData, type: 'rent' })}
            >
              <Text style={[styles.typeText, formData.type === 'rent' && styles.typeTextActive]}>
                Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de base *</Text>
          <TextInput
            style={styles.input}
            placeholder="Titre de l'annonce"
            value={formData.title}
            onChangeText={(text: string) => setFormData({ ...formData, title: text })}
            placeholderTextColor={COLORS.textLight}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description détaillée"
            value={formData.description}
            onChangeText={(text: string) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
            placeholderTextColor={COLORS.textLight}
          />
          <TextInput
            style={styles.input}
            placeholder="Prix (€)"
            value={formData.price}
            onChangeText={(text: string) => setFormData({ ...formData, price: text })}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Property Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails de la propriété *</Text>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Chambres</Text>
              <TextInput
                style={styles.input}
                value={formData.bedrooms}
                onChangeText={(text: string) => setFormData({ ...formData, bedrooms: text })}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Salles de bain</Text>
              <TextInput
                style={styles.input}
                value={formData.bathrooms}
                onChangeText={(text: string) => setFormData({ ...formData, bathrooms: text })}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Surface (m²)"
            value={formData.area}
            onChangeText={(text: string) => setFormData({ ...formData, area: text })}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localisation *</Text>
          <TextInput
            style={styles.input}
            placeholder="Adresse complète"
            value={formData.address}
            onChangeText={(text: string) => setFormData({ ...formData, address: text })}
            placeholderTextColor={COLORS.textLight}
          />
          <TextInput
            style={styles.input}
            placeholder="Ville"
            value={formData.city}
            onChangeText={(text: string) => setFormData({ ...formData, city: text })}
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Équipements</Text>
          <View style={styles.amenitiesContainer}>
            {amenitiesList.map((amenity) => (
              <TouchableOpacity
                key={amenity}
                style={[
                  styles.amenityChip,
                  selectedAmenities.includes(amenity) && styles.amenityChipActive
                ]}
                onPress={() => toggleAmenity(amenity)}
              >
                <Text
                  style={[
                    styles.amenityText,
                    selectedAmenities.includes(amenity) && styles.amenityTextActive
                  ]}
                >
                  {amenity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditMode ? 'Update Property' : 'Publish Property'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  imagesList: {
    flexDirection: 'row',
  },
  imageItem: {
    marginRight: 12,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: SIZES.radius,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  addImageText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  typeText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  typeTextActive: {
    color: COLORS.white,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amenityChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  amenityText: {
    fontSize: 14,
    color: COLORS.text,
  },
  amenityTextActive: {
    color: COLORS.white,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SIZES.padding,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddPropertyScreen;
