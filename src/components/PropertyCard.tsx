import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  onFavorite,
  isFavorite = false,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[0] || 'https://via.placeholder.com/300' }}
          style={styles.image}
          resizeMode="cover"
        />
        {onFavorite && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#FF385C' : '#FFF'}
            />
          </TouchableOpacity>
        )}
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{property.type}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.location} numberOfLines={1}>
            {property.location.address}, {property.location.city}
          </Text>
        </View>

        <View style={styles.featuresRow}>
          <View style={styles.feature}>
            <Ionicons name="bed-outline" size={16} color="#666" />
            <Text style={styles.featureText}>{property.bedrooms}</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="water-outline" size={16} color="#666" />
            <Text style={styles.featureText}>{property.bathrooms}</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="expand-outline" size={16} color="#666" />
            <Text style={styles.featureText}>{property.area} m²</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>
            {property.price.toLocaleString('fr-FR')} DH
            {property.rentType && (
              <Text style={styles.rentType}> /{property.rentType}</Text>
            )}
          </Text>
          <View style={styles.statusTag}>
            <Text style={styles.statusText}>{property.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  typeTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  featuresRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A90E2',
  },
  rentType: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  statusTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
});
