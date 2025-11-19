import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { Property } from '../types';

// Screens
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import PropertyDetailsScreen from '../screens/Property/PropertyDetailsScreen';
import AddPropertyScreen from '../screens/Property/AddPropertyScreen';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';
import MessagesScreen from '../screens/Messages/MessagesScreen';
import ChatScreen from '../screens/Messages/ChatScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import MyPropertiesScreen from '../screens/Profile/MyPropertiesScreen';
import NotificationsScreen from '../screens/Profile/NotificationsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import HelpScreen from '../screens/Profile/HelpScreen';
import AboutScreen from '../screens/Profile/AboutScreen';
import MapViewScreen from '../screens/Map/MapViewScreen';

import { useAuth } from '../context/AuthContext';

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  Login: undefined;
  SignUp: undefined;
  PropertyDetails: { id: string };
  Messages: undefined;
  Chat: { conversationId: string; propertyId?: string };
  MapView: undefined;
  EditProfile: undefined;
  MyProperties: undefined;
  Notifications: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
  AddProperty: { propertyToEdit?: Property };
  AddPropertyStack: { propertyToEdit?: Property };
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    // @ts-ignore
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'AddProperty') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Accueil' }} 
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Recherche' }} 
      />
      <Tab.Screen 
        name="AddProperty" 
        component={AddPropertyScreen} 
        options={{ title: 'Publier' }} 
        listeners={({ navigation }) => ({
          tabPress: (e: any) => {
            e.preventDefault();
            navigation.navigate('AddPropertyStack' as never);
          },
        })}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: 'Favoris' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profil' }} 
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {/* @ts-ignore */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showOnboarding ? (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <OnboardingScreen
                {...props}
                onGetStarted={handleOnboardingComplete}
              />
            )}
          </Stack.Screen>
        ) : user ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="AddPropertyStack" component={AddPropertyScreen} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="MapView" component={MapViewScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="MyProperties" component={MyPropertiesScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
