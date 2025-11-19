import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        setPermissionStatus('granted');
        await getCurrentLocation();
      } else {
        setPermissionStatus('denied');
        setError('Permission de localisation refusée');
      }
    } catch (err) {
      console.error('Error requesting location permission:', err);
      setError('Erreur lors de la demande de permission');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setError(null);
    } catch (err) {
      console.error('Error getting current location:', err);
      setError('Impossible d\'obtenir la position actuelle');
    } finally {
      setLoading(false);
    }
  };

  const getAddressFromCoordinates = async (coords: Coordinates): Promise<string | null> => {
    try {
      const addresses = await Location.reverseGeocodeAsync(coords);
      if (addresses.length > 0) {
        const address = addresses[0];
        return `${address.street}, ${address.city}, ${address.region}`;
      }
      return null;
    } catch (err) {
      console.error('Error reverse geocoding:', err);
      return null;
    }
  };

  const getCoordinatesFromAddress = async (address: string): Promise<Coordinates | null> => {
    try {
      const locations = await Location.geocodeAsync(address);
      if (locations.length > 0) {
        return {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude,
        };
      }
      return null;
    } catch (err) {
      console.error('Error geocoding:', err);
      return null;
    }
  };

  return {
    location,
    loading,
    error,
    permissionStatus,
    requestLocationPermission,
    getCurrentLocation,
    getAddressFromCoordinates,
    getCoordinatesFromAddress,
  };
};
