# Exemples d'Utilisation Complets 📘

Ce fichier contient des exemples complets et pratiques pour utiliser tous les hooks de l'application.

---

## 🏠 Exemple 1: Écran d'accueil avec recherche et filtres

```typescript
import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useProperties, useSearch, useFavorites, useAuth } from '../hooks';
import { PropertyCard, SearchBar } from '../components';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { properties, loading, error, refresh } = useProperties();
  const { applyFilters, updateFilter, filters } = useSearch();
  const { favorites, toggleFavorite, isFavorite } = useFavorites(user?.id || '');
  
  const [searchQuery, setSearchQuery] = useState('');

  // Appliquer les filtres aux propriétés
  const filteredProperties = applyFilters(properties);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilter('searchQuery', query);
  };

  const handlePropertyPress = (property) => {
    navigation.navigate('PropertyDetails', { propertyId: property.id });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Rechercher une propriété..."
      />
      
      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => handlePropertyPress(item)}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        onRefresh={refresh}
        refreshing={loading}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
});

export default HomeScreen;
```

---

## 🔐 Exemple 2: Authentification complète

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../hooks';

const AuthScreen = ({ navigation }) => {
  const { login, register, forgotPassword, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(email, password);
        navigation.replace('Home');
      } else {
        await register(email, password, displayName);
        Alert.alert('Succès', 'Compte créé avec succès!');
        navigation.replace('Home');
      }
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Une erreur est survenue');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre email');
      return;
    }
    
    try {
      await forgotPassword(email);
      Alert.alert(
        'Email envoyé',
        'Un email de réinitialisation a été envoyé à votre adresse'
      );
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLogin ? 'Connexion' : 'Inscription'}
      </Text>

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'S\'inscrire'}
        </Text>
      </TouchableOpacity>

      {isLogin && (
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.link}>Mot de passe oublié?</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.link}>
          {isLogin
            ? 'Pas de compte? S\'inscrire'
            : 'Déjà un compte? Se connecter'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  error: {
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default AuthScreen;
```

---

## 📝 Exemple 3: Ajouter une propriété avec images

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useImagePicker, useAuth, useLocation } from '../hooks';
import { addProperty } from '../services/firebase.service';

const AddPropertyScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { images, pickImage, uploadImages, removeImage, loading: uploading } = useImagePicker();
  const { location, getAddressFromCoordinates } = useLocation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'sale' | 'rent'>('sale');
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'villa' | 'studio' | 'office'>('apartment');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUseCurrentLocation = async () => {
    if (location) {
      const addr = await getAddressFromCoordinates(location);
      if (addr) {
        setAddress(addr);
        Alert.alert('Succès', 'Localisation actuelle utilisée');
      }
    } else {
      Alert.alert('Erreur', 'Impossible d\'obtenir votre localisation');
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!title || !description || !price || !address || !city) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter au moins une photo');
      return;
    }

    try {
      setLoading(true);

      // Upload images
      const imageUrls = await uploadImages('properties');

      // Create property
      await addProperty({
        title,
        description,
        price: parseFloat(price),
        type,
        propertyType,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        area: parseFloat(area) || 0,
        location: {
          address,
          city,
          country: 'Morocco',
          coordinates: location || { latitude: 0, longitude: 0 },
        },
        images: imageUrls,
        amenities: [],
        ownerId: user?.uid || '',
        ownerName: user?.displayName || '',
        ownerPhoto: user?.photoURL,
        featured: false,
      });

      Alert.alert('Succès', 'Propriété ajoutée avec succès!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Impossible d\'ajouter la propriété');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Photos</Text>
      <View style={styles.imageContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={() => pickImage(true)}
          >
            <Text style={styles.addImageText}>+ Ajouter</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>Informations de base</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre *"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description *"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Prix (MAD) *"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Type de transaction</Text>
      <Picker
        selectedValue={type}
        onValueChange={setType}
        style={styles.picker}
      >
        <Picker.Item label="Vente" value="sale" />
        <Picker.Item label="Location" value="rent" />
      </Picker>

      <Text style={styles.label}>Type de propriété</Text>
      <Picker
        selectedValue={propertyType}
        onValueChange={setPropertyType}
        style={styles.picker}
      >
        <Picker.Item label="Appartement" value="apartment" />
        <Picker.Item label="Maison" value="house" />
        <Picker.Item label="Villa" value="villa" />
        <Picker.Item label="Studio" value="studio" />
        <Picker.Item label="Bureau" value="office" />
      </Picker>

      <Text style={styles.sectionTitle}>Détails</Text>
      <TextInput
        style={styles.input}
        placeholder="Chambres"
        value={bedrooms}
        onChangeText={setBedrooms}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Salles de bain"
        value={bathrooms}
        onChangeText={setBathrooms}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Surface (m²)"
        value={area}
        onChangeText={setArea}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Localisation</Text>
      <TextInput
        style={styles.input}
        placeholder="Adresse *"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Ville *"
        value={city}
        onChangeText={setCity}
      />
      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleUseCurrentLocation}
      >
        <Text style={styles.locationButtonText}>
          📍 Utiliser ma localisation
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading || uploading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Publication...' : 'Publier l\'annonce'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    backgroundColor: '#FFF',
    marginBottom: 12,
  },
  imageContainer: {
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#E74C3C',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
  locationButton: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  locationButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddPropertyScreen;
```

---

## 💬 Exemple 4: Chat en temps réel

```typescript
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useMessages, useAuth } from '../hooks';

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    senderId: string;
    timestamp: Date;
  };
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => (
  <View style={[styles.messageBubble, isOwn ? styles.ownMessage : styles.otherMessage]}>
    <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
      {message.text}
    </Text>
    <Text style={styles.timestamp}>
      {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </Text>
  </View>
);

const ChatScreen = ({ route }) => {
  const { conversationId, receiverId, receiverName } = route.params;
  const { user } = useAuth();
  const { messages, send, loading } = useMessages(conversationId);
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async () => {
    if (messageText.trim() && user) {
      try {
        await send(messageText.trim(), user.uid, receiverId);
        setMessageText('');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{receiverName}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} isOwn={item.senderId === user?.uid} />
        )}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Écrire un message..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!messageText.trim() || loading}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  ownMessageText: {
    color: '#FFF',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 20,
  },
});

export default ChatScreen;
```

---

## 🗺️ Exemple 5: Carte interactive avec propriétés

```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useProperties, useLocation } from '../hooks';

const MapViewScreen = ({ navigation }) => {
  const { properties, loading } = useProperties();
  const { location, loading: locationLoading } = useLocation();
  const [selectedProperty, setSelectedProperty] = useState(null);

  const initialRegion = {
    latitude: location?.latitude || 33.5731,
    longitude: location?.longitude || -7.5898,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const handleMarkerPress = (property) => {
    setSelectedProperty(property);
  };

  const handleCalloutPress = (property) => {
    navigation.navigate('PropertyDetails', { propertyId: property.id });
  };

  if (locationLoading || loading) {
    return (
      <View style={styles.centered}>
        <Text>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {/* User location */}
        {location && (
          <Marker
            coordinate={location}
            title="Votre position"
            pinColor="blue"
          />
        )}

        {/* Property markers */}
        {properties.map((property) => (
          <Marker
            key={property.id}
            coordinate={property.location.coordinates}
            onPress={() => handleMarkerPress(property)}
          >
            <Callout onPress={() => handleCalloutPress(property)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{property.title}</Text>
                <Text style={styles.calloutPrice}>
                  {property.price.toLocaleString('fr-FR')} MAD
                </Text>
                <Text style={styles.calloutDetails}>
                  {property.bedrooms} ch • {property.bathrooms} sdb •{' '}
                  {property.area} m²
                </Text>
                <Text style={styles.calloutLink}>Voir les détails →</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {selectedProperty && (
        <View style={styles.bottomSheet}>
          <Text style={styles.propertyTitle}>{selectedProperty.title}</Text>
          <Text style={styles.propertyPrice}>
            {selectedProperty.price.toLocaleString('fr-FR')} MAD
          </Text>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => handleCalloutPress(selectedProperty)}
          >
            <Text style={styles.detailsButtonText}>Voir les détails</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  callout: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutPrice: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 4,
  },
  calloutDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  calloutLink: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 20,
    color: '#4A90E2',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailsButton: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapViewScreen;
```

---

## 🎯 Conseils d'optimisation

### 1. Mémorisation des composants
```typescript
import React, { memo } from 'react';

const PropertyCard = memo(({ property, onPress }) => {
  // Component code
}, (prevProps, nextProps) => {
  return prevProps.property.id === nextProps.property.id;
});
```

### 2. Debouncing des recherches
```typescript
import { useDebounce } from 'use-debounce';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 500);
  
  useEffect(() => {
    // Recherche avec le texte debounced
    updateFilter('searchQuery', debouncedSearchText);
  }, [debouncedSearchText]);
};
```

### 3. Pagination des listes
```typescript
const [page, setPage] = useState(1);
const ITEMS_PER_PAGE = 20;

const paginatedProperties = properties.slice(0, page * ITEMS_PER_PAGE);

const handleLoadMore = () => {
  if (paginatedProperties.length < properties.length) {
    setPage(prev => prev + 1);
  }
};
```

---

**Documentation complète - Version 1.0**
