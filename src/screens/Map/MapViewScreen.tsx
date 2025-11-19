import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { Property } from '../../types';

const MapViewScreen = ({ route, navigation }: any) => {
  const { property } = route.params as { property: Property };

  // Fallback for web
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackText}>
            Map view is not available on web
          </Text>
          <Text style={styles.webFallbackSubtext}>
            {property.location.address}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  }

  // Dynamically load MapView for native only
  const RNMaps = require('react-native-maps');
  const MapView = RNMaps.default;
  const Marker = RNMaps.Marker;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: property.location.coordinates.latitude,
          longitude: property.location.coordinates.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: property.location.coordinates.latitude,
            longitude: property.location.coordinates.longitude,
          }}
          title={property.title}
          description={property.location.address}
        />
      </MapView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 20,
  },
  webFallbackText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  webFallbackSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
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
});

export default MapViewScreen;
