import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getUserProperties } from '../../services/firebase.service';
import { getFavorites } from '../../services/firebase.service';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';


const ProfileScreen = ({ navigation }: any) => {
  const { user, logout, refreshUser } = useAuth();
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshUser();
      loadStats();
    });

    return unsubscribe;
  }, [navigation]);

  const loadStats = async () => {
    if (user) {
      try {
        const properties = await getUserProperties(user.id);
        setPropertiesCount(properties.length);
        
        const favorites = await getFavorites(user.id);
        setFavoritesCount(favorites.length);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', onPress: () => logout(), style: 'destructive' },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Modifier le profil',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'home-outline',
      title: 'Mes annonces',
      onPress: () => navigation.navigate('MyProperties'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: 'settings-outline',
      title: 'Paramètres',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Aide & Support',
      onPress: () => navigation.navigate('Help'),
    },
    {
      icon: 'information-circle-outline',
      title: 'À propos',
      onPress: () => navigation.navigate('About'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user?.photoURL || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.displayName || 'Utilisateur'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{propertiesCount}</Text>
              <Text style={styles.statLabel}>Annonces</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{favoritesCount}</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.accent} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
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
  profileSection: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    padding: SIZES.padding * 2,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  menuSection: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    gap: 12,
    ...SHADOWS.small,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  version: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 14,
    marginTop: 24,
    marginBottom: 40,
  },
});

export default ProfileScreen;
