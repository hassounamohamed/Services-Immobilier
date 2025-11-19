# Documentation de l'Architecture C4 - Application Mobile Home Rental

## Vue d'ensemble du projet

Application mobile cross-platform de services immobiliers développée avec React Native et Expo, permettant aux utilisateurs de rechercher, publier et gérer des annonces immobilières.

---

## Niveau 1: Diagramme de Contexte Système

```
┌─────────────────────────────────────────────────────────────────┐
│                    Home Rental Mobile App                       │
│                                                                 │
│  Système mobile de gestion d'annonces immobilières             │
│  - Recherche et consultation de biens                          │
│  - Publication d'annonces                                       │
│  - Messagerie entre utilisateurs                               │
│  - Géolocalisation des propriétés                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ utilise
                              ▼
        ┌─────────────────────────────────────┐
        │                                     │
        │     Utilisateurs (Acteurs)         │
        │                                     │
        │  • Acheteurs/Locataires            │
        │  • Propriétaires/Agents            │
        │                                     │
        └─────────────────────────────────────┘

Systèmes Externes:
┌───────────────┐       ┌──────────────┐       ┌─────────────────┐
│   Firebase    │       │   Google     │       │  Expo Services  │
│               │       │    Maps      │       │                 │
│ - Auth        │       │              │       │ - Notifications │
│ - Firestore   │       │ - Carte      │       │ - Image Picker  │
│ - Storage     │       │ - Geocoding  │       │ - Location      │
└───────────────┘       └──────────────┘       └─────────────────┘
```

---

## Niveau 2: Diagramme de Conteneur

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Application Mobile (React Native)                 │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Couche UI      │   │ Couche Logique  │   │ Couche Services │
│                 │   │                 │   │                 │
│ - Screens       │   │ - Context API   │   │ - Firebase      │
│ - Navigation    │   │ - State Mgmt    │   │ - API Calls     │
│ - Components    │   │ - Business Logic│   │ - Storage       │
└─────────────────┘   └─────────────────┘   └─────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ Firebase Auth   │   │   Firestore DB  │   │ Cloud Storage   │
│                 │   │                 │   │                 │
│ - Authentif.    │   │ - Properties    │   │ - Images        │
│ - Utilisateurs  │   │ - Messages      │   │ - Avatars       │
└─────────────────┘   │ - Conversations │   └─────────────────┘
                      │ - Favorites     │
                      └─────────────────┘
```

---

## Niveau 3: Diagramme de Composants

### 1. Module d'Authentification
```
┌───────────────────────────────────────────────────┐
│           Module Authentification                 │
├───────────────────────────────────────────────────┤
│                                                   │
│  Components:                                      │
│  ├─ LoginScreen                                   │
│  ├─ SignUpScreen                                  │
│  └─ AuthContext (Provider)                        │
│                                                   │
│  Services:                                        │
│  ├─ signIn(email, password)                       │
│  ├─ signUp(email, password, displayName)          │
│  └─ logout()                                      │
│                                                   │
│  Firebase:                                        │
│  └─ Firebase Authentication                       │
└───────────────────────────────────────────────────┘
```

### 2. Module de Navigation
```
┌───────────────────────────────────────────────────┐
│            Module Navigation                      │
├───────────────────────────────────────────────────┤
│                                                   │
│  Navigateurs:                                     │
│  ├─ StackNavigator (Auth)                         │
│  │   ├─ Login                                     │
│  │   └─ SignUp                                    │
│  │                                                 │
│  └─ TabNavigator (Main)                           │
│      ├─ Home                                      │
│      ├─ Search                                    │
│      ├─ AddProperty                               │
│      ├─ Favorites                                 │
│      └─ Profile                                   │
│                                                   │
│  Navigation Library:                              │
│  └─ React Navigation v7                           │
└───────────────────────────────────────────────────┘
```

### 3. Module des Propriétés
```
┌───────────────────────────────────────────────────┐
│           Module Propriétés                       │
├───────────────────────────────────────────────────┤
│                                                   │
│  Screens:                                         │
│  ├─ HomeScreen                                    │
│  │   └─ Affiche liste et propriétés vedettes     │
│  ├─ SearchScreen                                  │
│  │   └─ Filtres avancés                          │
│  ├─ PropertyDetailsScreen                         │
│  │   └─ Détails complets + carte                │
│  └─ AddPropertyScreen                             │
│      └─ Formulaire + upload images               │
│                                                   │
│  Services:                                        │
│  ├─ getProperties(filters)                        │
│  ├─ getPropertyById(id)                           │
│  ├─ createProperty(data)                          │
│  └─ uploadImages(files)                           │
│                                                   │
│  Firebase Collections:                            │
│  └─ properties                                    │
└───────────────────────────────────────────────────┘
```

### 4. Module de Messagerie
```
┌───────────────────────────────────────────────────┐
│           Module Messagerie                       │
├───────────────────────────────────────────────────┤
│                                                   │
│  Screens:                                         │
│  ├─ MessagesScreen                                │
│  │   └─ Liste conversations                      │
│  └─ ChatScreen                                    │
│      └─ Conversation en temps réel               │
│                                                   │
│  Services:                                        │
│  ├─ getConversations(userId)                      │
│  ├─ getMessages(conversationId)                   │
│  ├─ sendMessage(data)                             │
│  └─ subscribeToMessages(callback)                 │
│                                                   │
│  Firebase Collections:                            │
│  ├─ conversations                                 │
│  └─ messages                                      │
│                                                   │
│  Realtime:                                        │
│  └─ Firestore onSnapshot listeners                │
└───────────────────────────────────────────────────┘
```

### 5. Module des Favoris
```
┌───────────────────────────────────────────────────┐
│            Module Favoris                         │
├───────────────────────────────────────────────────┤
│                                                   │
│  Screens:                                         │
│  └─ FavoritesScreen                               │
│      └─ Liste propriétés favorites               │
│                                                   │
│  Services:                                        │
│  ├─ getFavorites(userId)                          │
│  ├─ addFavorite(userId, propertyId)               │
│  └─ removeFavorite(userId, propertyId)            │
│                                                   │
│  Firebase Collections:                            │
│  └─ favorites                                     │
└───────────────────────────────────────────────────┘
```

### 6. Module de Géolocalisation
```
┌───────────────────────────────────────────────────┐
│          Module Géolocalisation                   │
├───────────────────────────────────────────────────┤
│                                                   │
│  Screens:                                         │
│  └─ MapViewScreen                                 │
│      └─ Carte interactive                        │
│                                                   │
│  Services:                                        │
│  ├─ getCurrentLocation()                          │
│  ├─ geocodeAddress(address)                       │
│  └─ reverseGeocode(coords)                        │
│                                                   │
│  Libraries:                                       │
│  ├─ react-native-maps                             │
│  └─ expo-location                                 │
└───────────────────────────────────────────────────┘
```

### 7. Module Profil Utilisateur
```
┌───────────────────────────────────────────────────┐
│         Module Profil Utilisateur                 │
├───────────────────────────────────────────────────┤
│                                                   │
│  Screens:                                         │
│  └─ ProfileScreen                                 │
│      ├─ Informations utilisateur                 │
│      ├─ Statistiques                             │
│      └─ Paramètres                               │
│                                                   │
│  Services:                                        │
│  ├─ getUserProfile(userId)                        │
│  ├─ updateProfile(data)                           │
│  └─ uploadAvatar(image)                           │
│                                                   │
│  Firebase Collections:                            │
│  └─ users                                         │
└───────────────────────────────────────────────────┘
```

---

## Niveau 4: Diagramme de Code (Structure des Dossiers)

```
projet/
├── App.tsx                          # Point d'entrée
├── package.json                     # Dépendances
├── app.json                         # Configuration Expo
├── tsconfig.json                    # Configuration TypeScript
│
├── src/
│   ├── config/
│   │   └── firebase.ts              # Configuration Firebase
│   │
│   ├── types/
│   │   └── index.ts                 # Définitions TypeScript
│   │
│   ├── constants/
│   │   └── theme.ts                 # Couleurs, tailles, styles
│   │
│   ├── context/
│   │   └── AuthContext.tsx          # Context d'authentification
│   │
│   ├── navigation/
│   │   └── Navigation.tsx           # Configuration navigation
│   │
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignUpScreen.tsx
│   │   │
│   │   ├── Home/
│   │   │   └── HomeScreen.tsx
│   │   │
│   │   ├── Search/
│   │   │   └── SearchScreen.tsx
│   │   │
│   │   ├── Property/
│   │   │   ├── PropertyDetailsScreen.tsx
│   │   │   └── AddPropertyScreen.tsx
│   │   │
│   │   ├── Favorites/
│   │   │   └── FavoritesScreen.tsx
│   │   │
│   │   ├── Messages/
│   │   │   ├── MessagesScreen.tsx
│   │   │   └── ChatScreen.tsx
│   │   │
│   │   ├── Profile/
│   │   │   └── ProfileScreen.tsx
│   │   │
│   │   └── Map/
│   │       └── MapViewScreen.tsx
│   │
│   └── assets/                       # Images, icônes, fonts
│
└── .gitignore
```

---

## Flux de Données

### 1. Flux d'Authentification
```
User → LoginScreen → AuthContext.signIn() 
     → Firebase Auth → Update AuthContext 
     → Navigation (redirect to MainTabs)
```

### 2. Flux de Publication d'Annonce
```
User → AddPropertyScreen → Sélection images 
     → Upload vers Firebase Storage 
     → Création document Firestore (properties)
     → Navigation vers Home
```

### 3. Flux de Messagerie
```
User → ChatScreen → sendMessage() 
     → Firestore (messages collection)
     → onSnapshot listener 
     → Update UI en temps réel
```

### 4. Flux de Recherche
```
User → SearchScreen → Applique filtres 
     → Query Firestore 
     → Affiche résultats
     → PropertyDetailsScreen (on select)
```

---

## Modèle de Données Firebase

### Collection: users
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://...",
  "phoneNumber": "+33...",
  "createdAt": "timestamp"
}
```

### Collection: properties
```json
{
  "id": "property_id",
  "title": "Bel appartement...",
  "description": "Description...",
  "price": 250000,
  "type": "sale | rent",
  "propertyType": "apartment | house | villa | studio | office",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 85,
  "location": {
    "address": "123 Rue...",
    "city": "Paris",
    "country": "France",
    "coordinates": {
      "latitude": 48.8566,
      "longitude": 2.3522
    }
  },
  "images": ["url1", "url2"],
  "amenities": ["Parking", "Piscine"],
  "ownerId": "user_id",
  "ownerName": "John Doe",
  "ownerPhoto": "url",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "featured": false
}
```

### Collection: messages
```json
{
  "id": "message_id",
  "conversationId": "conv_id",
  "senderId": "user_id",
  "receiverId": "user_id",
  "text": "Message content",
  "timestamp": "timestamp",
  "read": false
}
```

### Collection: conversations
```json
{
  "id": "conversation_id",
  "participants": ["user_id1", "user_id2"],
  "lastMessage": "Last message text",
  "lastMessageTime": "timestamp",
  "propertyId": "property_id",
  "propertyTitle": "Property title"
}
```

### Collection: favorites
```json
{
  "userId": "user_id",
  "propertyId": "property_id",
  "addedAt": "timestamp"
}
```

---

## Technologies et Dépendances

### Core
- **React Native**: 0.76.5
- **Expo**: ~52.0.0
- **TypeScript**: ^5.3.3

### Backend & Services
- **Firebase**: ^11.0.0
  - Authentication
  - Firestore Database
  - Cloud Storage
  - Analytics

### Navigation
- **@react-navigation/native**: ^7.0.0
- **@react-navigation/stack**: ^7.0.0
- **@react-navigation/bottom-tabs**: ^7.0.0
- **react-native-screens**: ~4.4.0
- **react-native-safe-area-context**: 4.12.0
- **react-native-gesture-handler**: ~2.20.0
- **react-native-reanimated**: ~3.16.1

### Features
- **react-native-maps**: 1.18.0
- **expo-location**: ~18.0.4
- **expo-image-picker**: ~16.0.3
- **expo-notifications**: ~0.29.9
- **expo-linear-gradient**: ~14.0.1

### UI & Storage
- **@react-native-async-storage/async-storage**: 2.1.0
- **react-native-vector-icons**: ^10.2.0
- **@expo/vector-icons**: (included with Expo)

---

## Principes de Conception

1. **Modularité**: Chaque fonctionnalité est isolée dans son propre module
2. **Réutilisabilité**: Composants et services partagés
3. **Scalabilité**: Architecture permettant l'ajout facile de nouvelles fonctionnalités
4. **Performance**: Utilisation de la pagination et du lazy loading
5. **Sécurité**: Authentification Firebase et règles Firestore
6. **UX/UI**: Interface moderne et intuitive avec design cohérent

---

## Commandes d'Installation et de Lancement

```bash
# Installation des dépendances
npm install

# Lancement de l'application
npm start

# Lancement sur Android
npm run android

# Lancement sur iOS
npm run ios

# Lancement sur web
npm run web
```

---

*Documentation générée selon la méthode C4 pour Home Rental Mobile App*
