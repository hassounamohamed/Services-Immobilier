# Documentation des Hooks 🎣

## Vue d'ensemble

Ce fichier documente tous les hooks personnalisés disponibles dans l'application. Chaque hook encapsule une logique réutilisable pour faciliter le développement.

---

## 📦 Hooks de Propriétés

### `useProperties(filters?)`

Hook pour charger et gérer la liste de toutes les propriétés.

**Paramètres:**
- `filters` (optionnel): Objet de filtres pour filtrer les propriétés
  - `type`: 'sale' | 'rent'
  - `status`: 'available' | 'rented' | 'sold'
  - `minPrice`: number
  - `maxPrice`: number
  - `city`: string

**Retourne:**
```typescript
{
  properties: Property[],
  loading: boolean,
  error: string | null,
  refresh: () => void
}
```

**Exemple d'utilisation:**
```typescript
import { useProperties } from '../hooks';

const HomeScreen = () => {
  const { properties, loading, error, refresh } = useProperties({
    type: 'sale',
    minPrice: 50000
  });

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <FlatList
      data={properties}
      renderItem={({ item }) => <PropertyCard property={item} />}
      onRefresh={refresh}
      refreshing={loading}
    />
  );
};
```

---

### `useUserProperties(userId)`

Hook pour charger les propriétés d'un utilisateur spécifique.

**Paramètres:**
- `userId`: string (requis)

**Retourne:**
```typescript
{
  properties: Property[],
  loading: boolean,
  error: string | null,
  refresh: () => void
}
```

**Exemple d'utilisation:**
```typescript
const { properties } = useUserProperties(user.id);
```

---

### `useFavorites(userId)`

Hook pour gérer les favoris d'un utilisateur.

**Paramètres:**
- `userId`: string (requis)

**Retourne:**
```typescript
{
  favorites: string[],
  loading: boolean,
  toggleFavorite: (propertyId: string) => Promise<void>,
  isFavorite: (propertyId: string) => boolean,
  refresh: () => void
}
```

**Exemple d'utilisation:**
```typescript
const { favorites, toggleFavorite, isFavorite } = useFavorites(user.id);

<TouchableOpacity onPress={() => toggleFavorite(property.id)}>
  <Icon 
    name={isFavorite(property.id) ? 'heart' : 'heart-outline'} 
    size={24} 
  />
</TouchableOpacity>
```

---

## 🔐 Hook d'Authentification

### `useAuth()`

Hook pour gérer l'authentification des utilisateurs.

**Retourne:**
```typescript
{
  user: User | null,
  loading: boolean,
  error: string | null,
  login: (email: string, password: string) => Promise<UserCredential>,
  register: (email: string, password: string, displayName: string) => Promise<UserCredential>,
  logout: () => Promise<void>,
  forgotPassword: (email: string) => Promise<void>,
  isAuthenticated: boolean
}
```

**Exemple d'utilisation:**
```typescript
import { useAuth } from '../hooks';

const LoginScreen = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Erreur', 'Email ou mot de passe incorrect');
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Se connecter" onPress={handleLogin} disabled={loading} />
    </View>
  );
};
```

---

## 💬 Hooks de Messagerie

### `useConversations(userId)`

Hook pour charger les conversations d'un utilisateur.

**Paramètres:**
- `userId`: string (requis)

**Retourne:**
```typescript
{
  conversations: Conversation[],
  loading: boolean,
  error: string | null,
  refresh: () => void
}
```

**Exemple d'utilisation:**
```typescript
const { conversations, loading } = useConversations(user.id);
```

---

### `useMessages(conversationId)`

Hook pour charger et envoyer des messages dans une conversation.

**Paramètres:**
- `conversationId`: string (requis)

**Retourne:**
```typescript
{
  messages: Message[],
  loading: boolean,
  error: string | null,
  send: (text: string, senderId: string, receiverId: string) => Promise<void>,
  markAsRead: (messageId: string) => Promise<void>,
  refresh: () => void
}
```

**Exemple d'utilisation:**
```typescript
const ChatScreen = ({ route }) => {
  const { conversationId, receiverId } = route.params;
  const { user } = useAuth();
  const { messages, send, loading } = useMessages(conversationId);
  const [messageText, setMessageText] = useState('');

  const handleSend = async () => {
    if (messageText.trim()) {
      await send(messageText, user.id, receiverId);
      setMessageText('');
    }
  };

  return (
    <View>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageBubble message={item} />}
      />
      <TextInput 
        value={messageText} 
        onChangeText={setMessageText}
      />
      <Button title="Envoyer" onPress={handleSend} />
    </View>
  );
};
```

---

## 🔍 Hook de Recherche

### `useSearch()`

Hook pour gérer les filtres et le tri des propriétés.

**Retourne:**
```typescript
{
  filters: SearchFilters,
  sortBy: 'price_asc' | 'price_desc' | 'date' | 'relevance',
  updateFilter: (key: string, value: any) => void,
  setSortBy: (sortBy: string) => void,
  clearFilters: () => void,
  applyFilters: (properties: Property[]) => Property[],
  hasActiveFilters: () => boolean
}
```

**Exemple d'utilisation:**
```typescript
const SearchScreen = () => {
  const { properties } = useProperties();
  const { 
    filters, 
    updateFilter, 
    applyFilters, 
    clearFilters 
  } = useSearch();

  const filteredProperties = applyFilters(properties);

  return (
    <View>
      <TextInput 
        placeholder="Prix min"
        onChangeText={(value) => updateFilter('priceMin', parseInt(value))}
      />
      <TextInput 
        placeholder="Prix max"
        onChangeText={(value) => updateFilter('priceMax', parseInt(value))}
      />
      <Button title="Effacer les filtres" onPress={clearFilters} />
      
      <FlatList
        data={filteredProperties}
        renderItem={({ item }) => <PropertyCard property={item} />}
      />
    </View>
  );
};
```

---

## 📍 Hook de Localisation

### `useLocation()`

Hook pour gérer la géolocalisation.

**Retourne:**
```typescript
{
  location: { latitude: number, longitude: number } | null,
  loading: boolean,
  error: string | null,
  permissionStatus: 'granted' | 'denied' | 'undetermined',
  requestLocationPermission: () => Promise<void>,
  getCurrentLocation: () => Promise<void>,
  getAddressFromCoordinates: (coords: Coordinates) => Promise<string | null>,
  getCoordinatesFromAddress: (address: string) => Promise<Coordinates | null>
}
```

**Exemple d'utilisation:**
```typescript
const MapViewScreen = () => {
  const { 
    location, 
    loading, 
    permissionStatus,
    getAddressFromCoordinates 
  } = useLocation();

  const [address, setAddress] = useState('');

  useEffect(() => {
    if (location) {
      getAddressFromCoordinates(location).then(addr => {
        if (addr) setAddress(addr);
      });
    }
  }, [location]);

  if (loading) return <ActivityIndicator />;
  if (permissionStatus === 'denied') {
    return <Text>Permission de localisation refusée</Text>;
  }

  return (
    <View>
      <MapView
        initialRegion={{
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {location && (
          <Marker coordinate={location} title="Votre position" />
        )}
      </MapView>
      <Text>{address}</Text>
    </View>
  );
};
```

---

## 📷 Hook de Sélection d'Images

### `useImagePicker()`

Hook pour gérer la sélection et l'upload d'images.

**Retourne:**
```typescript
{
  images: ImageResult[],
  loading: boolean,
  error: string | null,
  pickImage: (multiple?: boolean) => Promise<ImageResult[] | undefined>,
  takePhoto: () => Promise<ImageResult | undefined>,
  uploadImages: (folder?: string) => Promise<string[]>,
  removeImage: (index: number) => void,
  clearImages: () => void
}
```

**Exemple d'utilisation:**
```typescript
const AddPropertyScreen = () => {
  const { 
    images, 
    pickImage, 
    takePhoto, 
    uploadImages, 
    removeImage,
    loading 
  } = useImagePicker();

  const handleSubmit = async () => {
    try {
      // Upload images to Firebase Storage
      const imageUrls = await uploadImages('properties');
      
      // Create property with image URLs
      await addProperty({
        ...propertyData,
        images: imageUrls
      });
      
      Alert.alert('Succès', 'Propriété ajoutée avec succès!');
    } catch (err) {
      Alert.alert('Erreur', 'Impossible d\'ajouter la propriété');
    }
  };

  return (
    <View>
      <Button title="Choisir depuis la galerie" onPress={() => pickImage(true)} />
      <Button title="Prendre une photo" onPress={takePhoto} />
      
      <ScrollView horizontal>
        {images.map((image, index) => (
          <View key={index}>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <TouchableOpacity onPress={() => removeImage(index)}>
              <Icon name="close" size={24} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      <Button 
        title="Publier" 
        onPress={handleSubmit} 
        disabled={loading || images.length === 0}
      />
    </View>
  );
};
```

---

## 🎯 Bonnes Pratiques

### 1. Toujours gérer l'état de chargement
```typescript
const { data, loading, error } = useHook();

if (loading) return <ActivityIndicator />;
if (error) return <ErrorMessage message={error} />;
return <DataView data={data} />;
```

### 2. Nettoyer les effets secondaires
Les hooks nettoient automatiquement leurs effets secondaires (listeners, intervals) lors du démontage du composant.

### 3. Utiliser les fonctions de rafraîchissement
```typescript
<FlatList
  data={properties}
  onRefresh={refresh}
  refreshing={loading}
/>
```

### 4. Combiner plusieurs hooks
```typescript
const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { properties } = useUserProperties(user?.id);
  const { favorites } = useFavorites(user?.id);
  
  // Utiliser les données combinées
};
```

---

## 🔧 Dépannage

### Le hook ne se met pas à jour
- Vérifiez que les dépendances de `useEffect` sont correctes
- Assurez-vous que les IDs passés aux hooks ne sont pas `undefined`

### Erreurs de permission
- Vérifiez que vous avez demandé les permissions nécessaires
- Testez sur un appareil réel pour les fonctionnalités natives

### Images ne se chargent pas
- Vérifiez les règles Firebase Storage
- Assurez-vous que les URLs sont valides
- Vérifiez la connexion internet

---

## 📚 Ressources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

---

**Développé avec ❤️ pour l'application immobilière**
