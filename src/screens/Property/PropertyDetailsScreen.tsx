import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { Property } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../hooks/useProperties';

const { width, height } = Dimensions.get('window');

const PropertyDetailsScreen = ({ route, navigation }: any) => {
  // Safety check for route params
  if (!route?.params?.property) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20 }}>Property not found</Text>
      </View>
    );
  }
  
  const { property } = route.params as { property: Property };
  const { user } = useAuth();
  const { toggleFavorite, isFavorite: checkIsFavorite } = useFavorites(user?.id || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      setIsFavorite(checkIsFavorite(property.id));
    }
  }, [user, property.id, checkIsFavorite]);

  const handleToggleFavorite = async () => {
    if (!user) {
      Alert.alert('Connexion requise', 'Veuillez vous connecter pour ajouter des favoris');
      return;
    }
    try {
      await toggleFavorite(property.id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Erreur', 'Impossible de modifier les favoris');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cette propriété: ${property.title} - ${property.price.toLocaleString()} €`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {property.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </ScrollView>
          
          <View style={styles.imageIndicator}>
            <Text style={styles.imageIndicatorText}>
              {currentImageIndex + 1} / {property.images.length}
            </Text>
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleToggleFavorite}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? COLORS.accent : COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{property.price.toLocaleString()} €</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {property.type === 'sale' ? 'À vendre' : 'À louer'}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{property.title}</Text>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.location}>{property.location.address}, {property.location.city}</Text>
          </View>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="bed" size={24} color={COLORS.primary} />
              <Text style={styles.featureText}>{property.bedrooms} chambres</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="water" size={24} color={COLORS.primary} />
              <Text style={styles.featureText}>{property.bathrooms} bains</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="expand" size={24} color={COLORS.primary} />
              <Text style={styles.featureText}>{property.area} m²</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Équipements</Text>
              <View style={styles.amenitiesContainer}>
                {property.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Map */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localisation</Text>
            <TouchableOpacity 
              style={styles.mapContainer}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  navigation.navigate('MapView', { property });
                }
              }}
            >
              {Platform.OS !== 'web' ? (
                (() => {
                  const RNMaps = require('react-native-maps');
                  const MapView = RNMaps.default;
                  const Marker = RNMaps.Marker;
                  return (
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: property.location.coordinates.latitude,
                        longitude: property.location.coordinates.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                    >
                      <Marker
                        coordinate={{
                          latitude: property.location.coordinates.latitude,
                          longitude: property.location.coordinates.longitude,
                        }}
                      />
                    </MapView>
                  );
                })()
              ) : (
                <View style={styles.map}>
                  <View style={styles.mapPlaceholder}>
                    <Ionicons name="location-outline" size={48} color={COLORS.textLight} />
                    <Text style={styles.mapPlaceholderText}>
                      {property.location.address}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Owner Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Propriétaire</Text>
            <View style={styles.ownerCard}>
              <Image
                source={{ 
                  uri: property.ownerPhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(property.ownerName) + '&background=2C3E50&color=fff&size=120'
                }}
                style={styles.ownerImage}
              />
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>{property.ownerName}</Text>
                <Text style={styles.ownerLabel}>Propriétaire</Text>
              </View>
              <TouchableOpacity style={styles.messageButton}>
                <Ionicons name="chatbubble-outline" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => {}}
        >
          <Ionicons name="call" size={24} color={COLORS.white} />
          <Text style={styles.callButtonText}>Appeler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.messageBottomButton}
          onPress={async () => {
            if (!user) {
              Alert.alert('Connexion requise', 'Veuillez vous connecter pour envoyer un message');
              return;
            }
            if (user.id === property.ownerId) {
              Alert.alert('Information', 'Vous ne pouvez pas vous envoyer un message à vous-même');
              return;
            }
            try {
              const { findOrCreateConversation } = require('../../services/firebase.service');
              const conversationId = await findOrCreateConversation(
                user.id,
                property.ownerId,
                property.id,
                property.title,
                property.images[0]
              );
              navigation.navigate('Chat', { 
                conversationId, 
                recipientId: property.ownerId,
                propertyTitle: property.title 
              });
            } catch (error) {
              console.error('Error creating conversation:', error);
              Alert.alert('Erreur', 'Impossible de créer la conversation');
            }
          }}
        >
          <Ionicons name="chatbubble" size={24} color={COLORS.white} />
          <Text style={styles.messageBottomButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // Add padding for the bottom bar
  },
  imageContainer: {
    height: height * 0.4,
  },
  image: {
    width,
    height: height * 0.4,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageIndicatorText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    position: 'absolute',
    top: 50,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SIZES.padding,
    // Remove flex: 1 if it exists
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  typeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeBadgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    color: COLORS.textLight,
    marginLeft: 8,
    flex: 1,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 8,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    gap: 8,
  },
  amenityText: {
    fontSize: 14,
    color: COLORS.text,
  },
  mapContainer: {
    height: 200,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  mapPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: SIZES.radius,
  },
  ownerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  ownerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ownerLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  messageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  callButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageBottomButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  messageBottomButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PropertyDetailsScreen;
