import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useUserProperties } from '../../hooks/useProperties';
import { deleteProperty, updateProperty } from '../../services/firebase.service';
import { Property } from '../../types';
import { useFocusEffect } from '@react-navigation/native';

const MyPropertiesScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'available' | 'rented' | 'sold'>('available');
  const { properties: allProperties, loading, error, refresh } = useUserProperties(user?.uid || '');

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        refresh();
      }
    }, [user])
  );

  // Filter properties based on active tab
  const properties = (allProperties || []).filter(property => 
    property.status === activeTab
  );

  const handleDeleteProperty = (propertyId: string) => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProperty(propertyId);
              Alert.alert('Success', 'Property deleted successfully');
              refresh();
            } catch (error) {
              console.error('Error deleting property:', error);
              Alert.alert('Error', 'Failed to delete property. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleEditProperty = (property: Property) => {
    // Navigate to AddPropertyScreen with property data for editing
    navigation.navigate('AddPropertyStack', { propertyToEdit: property });
  };

  const handleChangeStatus = (propertyId: string, newStatus: 'available' | 'rented' | 'sold') => {
    Alert.alert(
      'Change Status',
      `Change property status to ${newStatus}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await updateProperty(propertyId, { status: newStatus });
              Alert.alert('Success', 'Property status updated successfully');
              refresh();
            } catch (error) {
              console.error('Error updating property status:', error);
              Alert.alert('Error', 'Failed to update property status. Please try again.');
            }
          },
        },
      ]
    );
  };

  const showPropertyActions = (property: Property) => {
    const statusOptions = [
      { label: 'Available', value: 'available' as const },
      { label: 'Rented', value: 'rented' as const },
      { label: 'Sold', value: 'sold' as const },
    ].filter(option => option.value !== property.status);

    const buttons = [
      {
        text: 'Edit',
        onPress: () => handleEditProperty(property),
      },
      ...statusOptions.map(option => ({
        text: `Mark as ${option.label}`,
        onPress: () => handleChangeStatus(property.id, option.value),
      })),
      {
        text: 'Delete',
        onPress: () => handleDeleteProperty(property.id),
        style: 'destructive' as const,
      },
      {
        text: 'Cancel',
        style: 'cancel' as const,
      },
    ];

    Alert.alert('Property Actions', 'Choose an action', buttons);
  };

  // Mock data - remplacer par les vraies données de Firebase (kept for reference, not used)


  const renderProperty = ({ item }: { item: Property }) => {
    if (!item) return null;
    
    return (
      <TouchableOpacity
        style={styles.propertyCard}
        onPress={() => navigation.navigate('PropertyDetails', { id: item.id })}
      >
        <Image 
          source={{ uri: item.images?.[0] || 'https://ui-avatars.com/api/?name=Property&size=150' }} 
          style={styles.propertyImage} 
        />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{item.title || 'Untitled'}</Text>
          <View style={styles.propertyDetails}>
            <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
            <Text style={styles.propertyLocation}>{item.location?.city || 'Unknown'}</Text>
          </View>
          <Text style={styles.propertyPrice}>
            {(item.price || 0).toLocaleString()} DH
            {item.type === 'rent' && '/month'}
          </Text>
        <View style={[
          styles.statusBadge,
          item.status === 'available' && { backgroundColor: COLORS.success + '20' },
          item.status === 'rented' && { backgroundColor: COLORS.warning + '20' },
          item.status === 'sold' && { backgroundColor: COLORS.error + '20' },
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'available' && { color: COLORS.success },
            item.status === 'rented' && { color: COLORS.warning },
            item.status === 'sold' && { color: COLORS.error },
          ]}>
            {item.status?.toUpperCase() || 'AVAILABLE'}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.moreButton}
        onPress={() => showPropertyActions(item)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text} />
      </TouchableOpacity>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Properties</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddPropertyStack')}>
          <Ionicons name="add" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}
        >
          <Text
            style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}
          >
            Available
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rented' && styles.activeTab]}
          onPress={() => setActiveTab('rented')}
        >
          <Text
            style={[styles.tabText, activeTab === 'rented' && styles.activeTabText]}
          >
            Rented
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sold' && styles.activeTab]}
          onPress={() => setActiveTab('sold')}
        >
          <Text
            style={[styles.tabText, activeTab === 'sold' && styles.activeTabText]}
          >
            Sold
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.emptyText}>Loading properties...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.emptyText}>Error loading properties</Text>
          <TouchableOpacity onPress={refresh} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="home-outline" size={64} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No properties in this category</Text>
            </View>
          }
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  listContainer: {
    padding: SIZES.padding,
  },
  propertyCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    ...SHADOWS.small,
    overflow: 'hidden',
  },
  propertyImage: {
    width: 100,
    height: 100,
  },
  propertyInfo: {
    flex: 1,
    padding: 12,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  moreButton: {
    padding: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 16,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyPropertiesScreen;
