import { useState, useEffect } from 'react';
import { getProperties, getUserProperties, addToFavorites, removeFromFavorites, getFavorites } from '../services/firebase.service';
import { Property } from '../types';

export const useProperties = (filters?: any) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties(filters);
      setProperties(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err?.message?.includes('permission') 
        ? 'Permissions insuffisantes. Veuillez vous connecter.'
        : 'Erreur lors du chargement des propriétés';
      setError(errorMessage);
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadProperties();
  };

  return { properties, loading, error, refresh };
};

export const useUserProperties = (userId: string) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadUserProperties();
    }
  }, [userId]);

  const loadUserProperties = async () => {
    try {
      setLoading(true);
      const data = await getUserProperties(userId);
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement de vos propriétés');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadUserProperties();
  };

  return { properties, loading, error, refresh };
};

export const useFavorites = (userId: string) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadFavorites();
    }
  }, [userId]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites(userId);
      setFavorites(data);
    } catch (err) {
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    try {
      if (favorites.includes(propertyId)) {
        await removeFromFavorites(userId, propertyId);
        setFavorites(favorites.filter(id => id !== propertyId));
      } else {
        await addToFavorites(userId, propertyId);
        setFavorites([...favorites, propertyId]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  return { favorites, loading, toggleFavorite, isFavorite, refresh: loadFavorites };
};
