import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../services/firebase.service';

interface ImageResult {
  uri: string;
  url?: string;
}

export const useImagePicker = () => {
  const [images, setImages] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return cameraStatus === 'granted' && mediaStatus === 'granted';
  };

  const pickImage = async (multiple: boolean = false) => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setError('Permission d\'accès à la galerie refusée');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: multiple,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => ({
          uri: asset.uri,
        }));
        
        if (multiple) {
          setImages(prev => [...prev, ...newImages]);
        } else {
          setImages(newImages);
        }
        
        setError(null);
        return newImages;
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Erreur lors de la sélection de l\'image');
    }
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setError('Permission d\'accès à l\'appareil photo refusée');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const newImage = {
          uri: result.assets[0].uri,
        };
        
        setImages(prev => [...prev, newImage]);
        setError(null);
        return newImage;
      }
    } catch (err) {
      console.error('Error taking photo:', err);
      setError('Erreur lors de la prise de photo');
    }
  };

  const uploadImages = async (folder: string = 'properties') => {
    try {
      setLoading(true);
      setError(null);

      const uploadPromises = images.map(async (image) => {
        if (!image.url) {
          const url = await uploadImage(image.uri, folder);
          return { ...image, url };
        }
        return image;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages(uploadedImages);
      
      return uploadedImages.map(img => img.url!);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Erreur lors du téléchargement des images');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setImages([]);
    setError(null);
  };

  return {
    images,
    loading,
    error,
    pickImage,
    takePhoto,
    uploadImages,
    removeImage,
    clearImages,
  };
};
