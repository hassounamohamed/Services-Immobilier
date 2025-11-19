import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../hooks/useProperties';
import { Property } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const FavoritesScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { toggleFavorite } = useFavorites(user?.id || '');
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const favoritesQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', user.id)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);
      const propertyIds = favoritesSnapshot.docs.map(doc => doc.data().propertyId);

      if (propertyIds.length > 0) {
        const propertiesQuery = query(
          collection(db, 'properties'),
          where('__name__', 'in', propertyIds)
        );
        const propertiesSnapshot = await getDocs(propertiesQuery);
        const propertiesData = propertiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Property[];
        setFavorites(propertiesData);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Erreur', 'Impossible de charger les favoris');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await toggleFavorite(propertyId);
      setFavorites(prev => prev.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Erreur', 'Impossible de retirer des favoris');
    }
  };

  const renderFavoriteItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => navigation.navigate('PropertyDetails', { property: item })}
    >
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/150' }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.location}>{item.location.city}</Text>
        </View>
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="bed-outline" size={16} color={COLORS.primary} />
            <Text style={styles.featureText}>{item.bedrooms}</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="water-outline" size={16} color={COLORS.primary} />
            <Text style={styles.featureText}>{item.bathrooms}</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="expand-outline" size={16} color={COLORS.primary} />
            <Text style={styles.featureText}>{item.area}m²</Text>
          </View>
        </View>
        <Text style={styles.price}>{item.price.toLocaleString()} €</Text>
      </View>
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Ionicons name="heart" size={24} color={COLORS.accent} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        <Text style={styles.count}>{favorites.length} propriétés</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={COLORS.textLight} />
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyText}>
            Commencez à ajouter des propriétés à vos favoris
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  count: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  list: {
    padding: SIZES.padding,
  },
  propertyCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  image: {
    width: 120,
    height: 120,
  },
  info: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  features: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.text,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FavoritesScreen;
