# 🏠 Home Rental - Application Mobile Immobilier

Application mobile cross-platform développée avec React Native et Expo pour la recherche, consultation et publication d'annonces immobilières.

![React Native](https://img.shields.io/badge/React%20Native-0.76.5-blue)
![Expo](https://img.shields.io/badge/Expo-52.0.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-11.0.0-orange)

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription et connexion par email/mot de passe
- Gestion de profil utilisateur
- Authentification sécurisée via Firebase

### 🏘️ Gestion des Propriétés
- Recherche avancée avec filtres multiples (prix, type, localisation, caractéristiques)
- Affichage en liste et en grille
- Propriétés en vedette
- Détails complets avec galerie photos
- Informations détaillées (chambres, salles de bain, superficie)

### 📝 Publication d'Annonces
- Formulaire complet de publication
- Upload multiple d'images
- Géolocalisation automatique
- Sélection d'équipements
- Types de transaction (vente/location)

### ⭐ Favoris
- Sauvegarde des propriétés favorites
- Accès rapide aux annonces sauvegardées

### 💬 Messagerie
- Chat en temps réel entre utilisateurs
- Conversations liées aux propriétés
- Notifications de nouveaux messages

### 🗺️ Géolocalisation
- Carte interactive avec React Native Maps
- Localisation des propriétés
- Vue carte détaillée

### 👤 Profil Utilisateur
- Gestion des informations personnelles
- Statistiques (annonces, favoris, messages)
- Paramètres de l'application

## 🛠️ Technologies Utilisées

### Frontend
- **React Native** 0.76.5 - Framework mobile
- **Expo** ~52.0.0 - Plateforme de développement
- **TypeScript** - Typage statique
- **React Navigation** 7.0.0 - Navigation

### Backend & Services
- **Firebase Authentication** - Authentification
- **Cloud Firestore** - Base de données NoSQL
- **Firebase Storage** - Stockage d'images
- **Firebase Analytics** - Analyse d'utilisation

### Bibliothèques Principales
- **react-native-maps** - Cartes interactives
- **expo-location** - Géolocalisation
- **expo-image-picker** - Sélection d'images
- **expo-linear-gradient** - Dégradés
- **@react-navigation/native** - Navigation
- **@expo/vector-icons** - Icônes

## 📦 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn
- Expo CLI
- Compte Firebase

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd projet
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Firebase**

Le projet est déjà configuré avec Firebase. Les identifiants sont dans `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyCo0plyCME9jog1-zQdST4PHYv75l2P6AQ",
  authDomain: "home-rental-app-de64b.firebaseapp.com",
  projectId: "home-rental-app-de64b",
  storageBucket: "home-rental-app-de64b.firebasestorage.app",
  messagingSenderId: "30533233383",
  appId: "1:30533233383:web:63981d33c533a5750c9042",
  measurementId: "G-V1ZFFHDJF4"
};
```

## 🚀 Lancement de l'application

### Démarrage du serveur de développement
```bash
npm start
```

### Lancement sur Android
```bash
npm run android
```

### Lancement sur iOS (macOS uniquement)
```bash
npm run ios
```

### Lancement sur Web
```bash
npm run web
```

## 📱 Utilisation avec Expo Go

1. Installez l'application **Expo Go** sur votre smartphone:
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Lancez le serveur de développement:
```bash
npm start
```

3. Scannez le QR code avec:
   - **Android**: Application Expo Go
   - **iOS**: Appareil photo natif

## 📂 Structure du Projet

```
projet/
├── App.tsx                          # Point d'entrée
├── src/
│   ├── config/
│   │   └── firebase.ts              # Configuration Firebase
│   ├── types/
│   │   └── index.ts                 # Types TypeScript
│   ├── constants/
│   │   └── theme.ts                 # Thème (couleurs, tailles)
│   ├── context/
│   │   └── AuthContext.tsx          # Context d'authentification
│   ├── navigation/
│   │   └── Navigation.tsx           # Configuration navigation
│   └── screens/
│       ├── Auth/                    # Écrans d'authentification
│       ├── Home/                    # Écran d'accueil
│       ├── Search/                  # Recherche avancée
│       ├── Property/                # Détails et ajout de propriété
│       ├── Favorites/               # Favoris
│       ├── Messages/                # Messagerie
│       ├── Profile/                 # Profil utilisateur
│       └── Map/                     # Vue carte
├── package.json
├── app.json
└── tsconfig.json
```

## 🎨 Design et Interface

L'application utilise un design moderne et intuitif avec:
- **Palette de couleurs cohérente**
- **Gradients élégants** pour les en-têtes
- **Ombres subtiles** pour la profondeur
- **Animations fluides** avec React Native Reanimated
- **Icônes Ionicons** pour une meilleure UX

### Thème
```typescript
COLORS = {
  primary: '#4A90E2',      // Bleu principal
  secondary: '#50C878',    // Vert
  accent: '#FF6B6B',       // Rouge accent
  background: '#F8F9FA',   // Fond gris clair
  // ...
}
```

## 🔥 Configuration Firebase

### Collections Firestore

1. **users** - Informations utilisateurs
2. **properties** - Annonces immobilières
3. **messages** - Messages de chat
4. **conversations** - Conversations entre utilisateurs
5. **favorites** - Propriétés favorites

### Règles de Sécurité Firestore (à configurer)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Règles pour properties
    match /properties/{propertyId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.ownerId;
    }
    
    // Règles pour messages
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
    }
    
    // Règles pour favorites
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Règles de Sécurité Storage

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /properties/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## 📖 Documentation Architecture

Consultez [ARCHITECTURE_C4.md](./ARCHITECTURE_C4.md) pour une documentation détaillée de l'architecture selon la méthode C4:
- Diagramme de contexte système
- Diagramme de conteneur
- Diagramme de composants
- Structure de code
- Flux de données

## 🔧 Configuration Avancée

### Variables d'Environnement

Créez un fichier `.env` à la racine:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
# ...
```

### Personnalisation du Thème

Modifiez `src/constants/theme.ts` pour personnaliser les couleurs, tailles et styles.

## 🐛 Débogage

### Logs
```bash
# Afficher les logs
npm start -- --clear

# Logs Android
npx react-native log-android

# Logs iOS
npx react-native log-ios
```

### Réinitialiser le cache
```bash
# Nettoyer le cache Expo
expo start -c

# Nettoyer le cache Metro
npx react-native start --reset-cache
```

## 📱 Build de Production

### Android APK
```bash
eas build --platform android
```

### iOS IPA
```bash
eas build --platform ios
```

## 🤝 Contribution

Les contributions sont les bienvenues! Pour contribuer:

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.

## 👥 Auteurs

- Votre Nom - *Travail initial*

## 🙏 Remerciements

- React Native Team
- Expo Team
- Firebase Team
- Communauté Open Source

## 📞 Support

Pour toute question ou problème:
- Ouvrez une issue sur GitHub
- Contactez: support@homerental.com

---

**Note**: Cette application est un projet de démonstration développé avec les dernières versions de React Native et Expo. Elle utilise Firebase pour les services backend et suit les meilleures pratiques de développement mobile moderne.
