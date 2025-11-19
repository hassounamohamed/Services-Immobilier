# 📐 Guide de Style de Code

Ce document définit les conventions de codage à suivre pour maintenir la cohérence du code dans le projet.

---

## 🎯 Principes Généraux

1. **Clarté avant tout** - Le code doit être facile à lire et à comprendre
2. **Cohérence** - Suivre les mêmes patterns dans tout le projet
3. **Simplicité** - Éviter la sur-ingénierie
4. **Documentation** - Commenter le code complexe
5. **Tests** - Écrire du code testable

---

## 📁 Structure des Fichiers

### Nommage des fichiers

```typescript
// Components: PascalCase
PropertyCard.tsx
SearchBar.tsx

// Hooks: camelCase avec préfixe 'use'
useProperties.ts
useAuth.ts

// Services: camelCase avec suffixe '.service'
firebase.service.ts

// Types: camelCase
index.ts (pour les types)

// Screens: PascalCase avec suffixe 'Screen'
HomeScreen.tsx
LoginScreen.tsx
```

### Organisation des imports

```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. React Native imports
import { View, Text, StyleSheet } from 'react-native';

// 3. Third-party libraries
import { useNavigation } from '@react-navigation/native';

// 4. Internal components
import { PropertyCard, SearchBar } from '../components';

// 5. Hooks
import { useProperties, useAuth } from '../hooks';

// 6. Services
import { addProperty } from '../services/firebase.service';

// 7. Types
import { Property } from '../types';

// 8. Constants
import { theme } from '../constants/theme';
```

---

## 🎨 TypeScript

### Types et Interfaces

```typescript
// ✅ Bon - Interface pour les objets
interface User {
  id: string;
  email: string;
  displayName: string;
}

// ✅ Bon - Type pour les unions/alias
type PropertyType = 'sale' | 'rent';
type Status = 'loading' | 'success' | 'error';

// ❌ Mauvais - any
const data: any = fetchData();

// ✅ Bon - Type explicite
const data: Property[] = fetchData();
```

### Props des composants

```typescript
// ✅ Bon - Props typées avec interface
interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  isFavorite?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onPress, 
  isFavorite = false 
}) => {
  // Component code
};

// ❌ Mauvais - Props non typées
const PropertyCard = (props) => {
  // Component code
};
```

### Types de retour de fonctions

```typescript
// ✅ Bon - Type de retour explicite
const calculateTotal = (price: number, quantity: number): number => {
  return price * quantity;
};

// ✅ Bon - Promise typée
const fetchProperty = async (id: string): Promise<Property> => {
  const response = await getProperty(id);
  return response;
};

// ✅ Bon - void pour les fonctions sans retour
const logMessage = (message: string): void => {
  console.log(message);
};
```

---

## ⚛️ React & React Native

### Composants fonctionnels

```typescript
// ✅ Bon - Composant fonctionnel avec TypeScript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GreetingProps {
  name: string;
  age?: number;
}

const Greeting: React.FC<GreetingProps> = ({ name, age }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, {name}!</Text>
      {age && <Text>Age: {age}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Greeting;
```

### Hooks

```typescript
// ✅ Bon - useState avec type
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
const [properties, setProperties] = useState<Property[]>([]);

// ✅ Bon - useEffect avec cleanup
useEffect(() => {
  const subscription = subscribeToMessages();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);

// ✅ Bon - useCallback pour optimisation
const handlePress = useCallback(() => {
  navigation.navigate('Details');
}, [navigation]);

// ✅ Bon - useMemo pour calculs coûteux
const filteredProperties = useMemo(() => {
  return properties.filter(p => p.price < maxPrice);
}, [properties, maxPrice]);
```

### Conditional Rendering

```typescript
// ✅ Bon - Early return
const PropertyCard = ({ property }) => {
  if (!property) {
    return <Text>No property found</Text>;
  }

  return <View>{/* Property content */}</View>;
};

// ✅ Bon - Ternaire simple
const Status = ({ isActive }) => (
  <Text>{isActive ? 'Active' : 'Inactive'}</Text>
);

// ✅ Bon - && pour condition unique
const Message = ({ hasMessages }) => (
  <View>
    {hasMessages && <Text>You have new messages</Text>}
  </View>
);

// ❌ Mauvais - Conditions imbriquées complexes
const Component = () => {
  return (
    <View>
      {condition1 ? (
        condition2 ? (
          <ComponentA />
        ) : condition3 ? (
          <ComponentB />
        ) : (
          <ComponentC />
        )
      ) : (
        <ComponentD />
      )}
    </View>
  );
};
```

---

## 🎨 Styling

### StyleSheet

```typescript
// ✅ Bon - Styles définis avec StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});

// ❌ Mauvais - Inline styles
<View style={{ flex: 1, padding: 16, backgroundColor: '#F5F5F5' }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Title</Text>
</View>

// ✅ Exception - Styles dynamiques
<View style={[styles.card, isActive && styles.activeCard]}>
  <Text style={{ color: textColor }}>Dynamic color</Text>
</View>
```

### Constantes de thème

```typescript
// constants/theme.ts
export const theme = {
  colors: {
    primary: '#4A90E2',
    secondary: '#27AE60',
    error: '#E74C3C',
    text: '#333333',
    textSecondary: '#666666',
    background: '#F5F5F5',
    white: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
  fontSize: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
};

// Utilisation
import { theme } from '../constants/theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
});
```

---

## 🔧 Bonnes Pratiques

### Gestion des erreurs

```typescript
// ✅ Bon - try-catch avec gestion d'erreur
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await getProperties();
    setProperties(data);
    setError(null);
  } catch (err) {
    console.error('Error fetching properties:', err);
    setError('Impossible de charger les propriétés');
  } finally {
    setLoading(false);
  }
};

// ✅ Bon - Affichage des erreurs
{error && (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
)}
```

### Validation des données

```typescript
// ✅ Bon - Validation avant soumission
const handleSubmit = () => {
  if (!title.trim()) {
    Alert.alert('Erreur', 'Le titre est requis');
    return;
  }

  if (price <= 0) {
    Alert.alert('Erreur', 'Le prix doit être supérieur à 0');
    return;
  }

  if (images.length === 0) {
    Alert.alert('Erreur', 'Au moins une image est requise');
    return;
  }

  submitProperty();
};
```

### Destructuring

```typescript
// ✅ Bon - Destructuring des props
const PropertyCard = ({ property, onPress, isFavorite }) => {
  const { title, price, location, images } = property;
  
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri: images[0] }} />
      <Text>{title}</Text>
      <Text>{price} MAD</Text>
    </TouchableOpacity>
  );
};

// ❌ Mauvais - Pas de destructuring
const PropertyCard = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text>{props.property.title}</Text>
    </TouchableOpacity>
  );
};
```

### Async/Await

```typescript
// ✅ Bon - async/await
const loadProperties = async () => {
  try {
    const properties = await getProperties();
    const favorites = await getFavorites(userId);
    setData({ properties, favorites });
  } catch (err) {
    console.error(err);
  }
};

// ❌ Mauvais - Promises avec then
getProperties()
  .then(properties => {
    setProperties(properties);
    return getFavorites(userId);
  })
  .then(favorites => {
    setFavorites(favorites);
  })
  .catch(err => console.error(err));
```

---

## 📝 Commentaires

### Quand commenter

```typescript
// ✅ Bon - Commentaire pour logique complexe
// Calculate the distance between two coordinates using Haversine formula
const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  
  // Haversine formula
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) * Math.cos(toRad(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ❌ Mauvais - Commentaire inutile
// Set the name
setName('John');

// Increment counter by 1
setCounter(counter + 1);
```

### JSDoc pour fonctions complexes

```typescript
/**
 * Uploads an image to Firebase Storage
 * @param uri - Local URI of the image
 * @param folder - Destination folder in Storage
 * @returns Promise<string> - Download URL of uploaded image
 * @throws Error if upload fails
 */
export const uploadImage = async (
  uri: string, 
  folder: string
): Promise<string> => {
  // Implementation
};
```

---

## 🧪 Testabilité

### Composants testables

```typescript
// ✅ Bon - Composant facilement testable
export const Button = ({ onPress, title, disabled = false }) => (
  <TouchableOpacity 
    onPress={onPress} 
    disabled={disabled}
    testID="custom-button"
  >
    <Text>{title}</Text>
  </TouchableOpacity>
);

// ✅ Bon - Hook testable
export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
};
```

---

## 🚫 Anti-patterns à éviter

### 1. Mutation directe de state

```typescript
// ❌ Mauvais
properties.push(newProperty);
setProperties(properties);

// ✅ Bon
setProperties([...properties, newProperty]);
```

### 2. Logique complexe dans JSX

```typescript
// ❌ Mauvais
return (
  <View>
    {properties.filter(p => p.price < maxPrice && p.type === 'sale')
      .sort((a, b) => a.price - b.price)
      .map(p => <PropertyCard key={p.id} property={p} />)}
  </View>
);

// ✅ Bon
const filteredProperties = useMemo(() => {
  return properties
    .filter(p => p.price < maxPrice && p.type === 'sale')
    .sort((a, b) => a.price - b.price);
}, [properties, maxPrice]);

return (
  <View>
    {filteredProperties.map(p => (
      <PropertyCard key={p.id} property={p} />
    ))}
  </View>
);
```

### 3. Trop de props

```typescript
// ❌ Mauvais
<PropertyCard
  title={property.title}
  price={property.price}
  location={property.location}
  bedrooms={property.bedrooms}
  bathrooms={property.bathrooms}
  images={property.images}
  onPress={handlePress}
/>

// ✅ Bon
<PropertyCard
  property={property}
  onPress={handlePress}
/>
```

---

## 📋 Checklist avant commit

- [ ] Code formaté (Prettier)
- [ ] Pas d'erreurs TypeScript
- [ ] Pas de console.log inutiles
- [ ] Imports organisés
- [ ] Styles cohérents
- [ ] Commentaires pour code complexe
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour

---

## 🔗 Ressources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Native Best Practices](https://github.com/jondot/awesome-react-native)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

---

**Version:** 1.0.0  
**Dernière mise à jour:** Novembre 2025
