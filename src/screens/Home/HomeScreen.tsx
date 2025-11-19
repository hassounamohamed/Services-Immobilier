import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Property } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../hooks/useProperties';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites(user?.id || '');
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'sale' | 'rent'>('all');

  useEffect(() => {
    loadProperties();
  }, [selectedType]);

  const handleToggleFavorite = async (propertyId: string, e: any) => {
    e.stopPropagation();
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    try {
      await toggleFavorite(propertyId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const loadProperties = async () => {
    try {
      let q = query(
        collection(db, 'properties'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      if (selectedType !== 'all') {
        q = query(
          collection(db, 'properties'),
          where('type', '==', selectedType),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
      }

      const querySnapshot = await getDocs(q);
      const propertiesData: Property[] = [];
      querySnapshot.forEach((doc) => {
        propertiesData.push({ id: doc.id, ...doc.data() } as Property);
      });

      setProperties(propertiesData);

      // Get featured properties
      const featured = propertiesData.filter(p => p.featured);
      setFeaturedProperties(featured);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const renderPropertyCard = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => navigation.navigate('PropertyDetails', { property: item })}
    >
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/400x300' }}
        style={styles.propertyImage}
      />
      <View style={styles.propertyBadge}>
        <Text style={styles.propertyBadgeText}>
          {item.type === 'sale' ? 'À vendre' : 'À louer'}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={(e) => handleToggleFavorite(item.id, e)}
      >
        <Ionicons 
          name={isFavorite(item.id) ? "heart" : "heart-outline"} 
          size={24} 
          color={isFavorite(item.id) ? COLORS.accent : COLORS.white} 
        />
      </TouchableOpacity>
      
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
          <Text style={styles.locationText} numberOfLines={1}>{item.location.city}</Text>
        </View>
        <View style={styles.propertyDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="bed-outline" size={18} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.bedrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={18} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.bathrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="expand-outline" size={18} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.area}m²</Text>
          </View>
        </View>
        <Text style={styles.propertyPrice}>{item.price.toLocaleString()} €</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedProperty = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigation.navigate('PropertyDetails', { property: item })}
    >
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/400x300' }}
        style={styles.featuredImage}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}
      >
        <Text style={styles.featuredTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.featuredPrice}>{item.price.toLocaleString()} €</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.displayName || 'Utilisateur'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
            <View style={styles.notificationBadge}>
              <Ionicons name="notifications-outline" size={28} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for properties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textLight}
            onSubmitEditing={() => {
              if (searchQuery.trim()) {
                navigation.navigate('Search', { initialQuery: searchQuery });
                setSearchQuery('');
              }
            }}
          />
          <TouchableOpacity onPress={() => navigation.navigate('MapView')}>
            <Ionicons name="map-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedType === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedType('all')}
          >
            <Text style={[styles.filterText, selectedType === 'all' && styles.filterTextActive]}>
              Tout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedType === 'sale' && styles.filterButtonActive]}
            onPress={() => setSelectedType('sale')}
          >
            <Text style={[styles.filterText, selectedType === 'sale' && styles.filterTextActive]}>
              À vendre
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedType === 'rent' && styles.filterButtonActive]}
            onPress={() => setSelectedType('rent')}
          >
            <Text style={[styles.filterText, selectedType === 'rent' && styles.filterTextActive]}>
              À louer
            </Text>
          </TouchableOpacity>
        </View>

        {featuredProperties.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Propriétés en vedette</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={featuredProperties}
              renderItem={renderFeaturedProperty}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Toutes les propriétés</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.seeAll}>Filtres</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.propertiesGrid}>
          {properties.map((property) => (
            <View key={property.id} style={styles.gridItem}>
              {renderPropertyCard({ item: property })}
            </View>
          ))}
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: SIZES.padding,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 4,
  },
  notificationBadge: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  featuredList: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 24,
  },
  featuredCard: {
    width: width * 0.7,
    height: 200,
    marginRight: 16,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    justifyContent: 'flex-end',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.padding / 2,
    paddingBottom: 20,
  },
  gridItem: {
    width: '50%',
    padding: SIZES.padding / 2,
  },
  propertyCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  propertyImage: {
    width: '100%',
    height: 120,
  },
  propertyBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  propertyBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyInfo: {
    padding: 12,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 4,
    flex: 1,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.text,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default HomeScreen;
