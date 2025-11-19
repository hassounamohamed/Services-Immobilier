# 🔧 Guide de Dépannage (Troubleshooting)

Ce guide vous aide à résoudre les problèmes courants rencontrés lors du développement et de l'utilisation de l'application.

---

## 🚨 Problèmes Courants

### 1. L'application ne démarre pas

#### Symptôme
```
Error: Unable to resolve module...
```

#### Solutions

**Solution 1: Nettoyer le cache**
```bash
npx expo start --clear
```

**Solution 2: Réinstaller les dépendances**
```bash
rm -rf node_modules
npm install
```

**Solution 3: Réinitialiser Metro Bundler**
```bash
npx react-native start --reset-cache
```

---

### 2. Erreurs Firebase

#### Symptôme
```
Firebase: Error (auth/configuration-not-found)
```

#### Solutions

**Vérifier firebase.ts**
```typescript
// src/config/firebase.ts
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  // ... autres configs
};
```

**Vérifier que Firebase est initialisé**
```typescript
import { auth, db, storage } from '../config/firebase';
```

**Activer les services Firebase**
1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet
3. Activez Authentication, Firestore, Storage

---

### 3. Erreurs de TypeScript

#### Symptôme
```
Property 'xxx' does not exist on type 'yyy'
```

#### Solutions

**Vérifier les types dans types/index.ts**
```typescript
export interface Property {
  id: string;
  title: string;
  // ... tous les champs nécessaires
}
```

**Installer les types manquants**
```bash
npm install --save-dev @types/react @types/react-native
```

---

### 4. Problèmes de permissions (Location, Camera)

#### Symptôme
```
Permission denied for location/camera
```

#### Solutions

**Vérifier app.json**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "The app needs access to your photos."
        }
      ]
    ]
  }
}
```

**Demander les permissions au runtime**
```typescript
const { status } = await Location.requestForegroundPermissionsAsync();
```

---

### 5. Images ne se chargent pas

#### Symptôme
Les images restent vides ou affichent une erreur

#### Solutions

**Vérifier les règles Firebase Storage**
```javascript
// Dans la console Firebase > Storage > Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Vérifier l'URL de l'image**
```typescript
<Image 
  source={{ uri: property.images[0] }} 
  onError={(e) => console.log('Image error:', e.nativeEvent.error)}
/>
```

---

### 6. Erreurs de Navigation

#### Symptôme
```
The action 'NAVIGATE' with payload {"name":"ScreenName"} was not handled
```

#### Solutions

**Vérifier que l'écran est défini**
```typescript
<Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
```

**Utiliser le bon nom d'écran**
```typescript
navigation.navigate('PropertyDetails', { propertyId: '123' });
```

---

### 7. Expo Go vs EAS Build

#### Quand utiliser Expo Go
- ✅ Développement rapide
- ✅ Pas besoin de bibliothèques natives personnalisées
- ✅ Tests rapides

#### Quand utiliser EAS Build
- ✅ Bibliothèques natives personnalisées
- ✅ Build pour production
- ✅ Tests sur App Store/Google Play

#### Créer un build EAS
```bash
# Installation
npm install -g eas-cli
eas login

# Configuration
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

---

### 8. Problèmes de performance

#### Symptôme
L'application est lente ou saccadée

#### Solutions

**Optimiser les listes**
```typescript
<FlatList
  data={properties}
  renderItem={renderProperty}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={5}
/>
```

**Mémoriser les composants**
```typescript
import React, { memo } from 'react';

const PropertyCard = memo(({ property }) => {
  // Component code
});
```

**Utiliser React.useCallback**
```typescript
const handlePress = useCallback(() => {
  navigation.navigate('PropertyDetails');
}, [navigation]);
```

---

### 9. Erreurs de build Android

#### Symptôme
```
Execution failed for task ':app:processReleaseResources'
```

#### Solutions

**Nettoyer le projet**
```bash
cd android
./gradlew clean
cd ..
```

**Vérifier android/gradle.properties**
```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m
android.useAndroidX=true
android.enableJetifier=true
```

---

### 10. Erreurs de build iOS

#### Symptôme
```
Command PhaseScriptExecution failed with a nonzero exit code
```

#### Solutions

**Installer les pods**
```bash
cd ios
pod install
cd ..
```

**Nettoyer le cache**
```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..
```

---

## 🐛 Debug Mode

### Activer le mode debug

**Dans l'application**
- Secouez l'appareil
- Appuyez sur "Debug"

**Dans le navigateur**
- Ouvrez http://localhost:19000
- Cliquez sur "Open DevTools"

### Console logs

```typescript
console.log('Variable:', variable);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### React DevTools

```bash
npm install -g react-devtools
react-devtools
```

---

## 📱 Tests sur appareil réel

### Android

**Via USB**
```bash
adb devices
npx expo start --android
```

**Via QR Code**
1. Installer Expo Go
2. Scanner le QR code
3. L'app s'ouvre automatiquement

### iOS

**Via USB (Mac uniquement)**
```bash
npx expo start --ios
```

**Via QR Code**
1. Installer Expo Go
2. Scanner le QR code depuis l'app Appareil photo
3. Ouvrir dans Expo Go

---

## 🔍 Vérifications avant déploiement

### Checklist technique

- [ ] Toutes les dépendances sont à jour
- [ ] Pas d'erreurs TypeScript
- [ ] Tests passent (si implémentés)
- [ ] Firebase configuré correctement
- [ ] Permissions configurées dans app.json
- [ ] Icons et splash screen créés
- [ ] Version mise à jour dans app.json
- [ ] Build Android réussi
- [ ] Build iOS réussi

### Checklist fonctionnelle

- [ ] Login/Signup fonctionne
- [ ] Toutes les pages s'affichent
- [ ] Navigation fluide
- [ ] Images se chargent
- [ ] Localisation fonctionne
- [ ] Chat en temps réel
- [ ] Upload d'images
- [ ] Favoris synchronisés
- [ ] Logout fonctionne

---

## 📚 Ressources supplémentaires

### Documentation officielle
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)

### Communautés
- [Expo Discord](https://discord.gg/expo)
- [React Native Community](https://www.reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

### Outils utiles
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [Reactotron](https://github.com/infinitered/reactotron)

---

## 💡 Conseils de développement

### 1. Toujours commencer par nettoyer
```bash
npx expo start --clear
```

### 2. Vérifier les versions
```bash
npm outdated
```

### 3. Sauvegarder régulièrement
```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push
```

### 4. Lire les erreurs attentivement
Les messages d'erreur TypeScript et React Native sont généralement très explicites.

### 5. Utiliser le mode strict de TypeScript
Aide à détecter les erreurs tôt.

---

## 🆘 Support d'urgence

Si rien ne fonctionne, essayez cette séquence:

```bash
# 1. Supprimer node_modules
rm -rf node_modules

# 2. Supprimer le cache
rm -rf .expo

# 3. Supprimer package-lock.json
rm package-lock.json

# 4. Réinstaller
npm install

# 5. Démarrer en mode clean
npx expo start --clear
```

---

**Dernière mise à jour:** Novembre 2025  
**Version:** 1.0.0

Si vous rencontrez un problème non listé ici, consultez:
- La documentation officielle
- Les issues GitHub du projet
- Stack Overflow
- Discord Expo/React Native
