# 📋 Commandes Utiles - Home Rental App

Ce document regroupe toutes les commandes utiles pour développer et maintenir l'application.

## 🚀 Installation et Démarrage

### Installation initiale
```powershell
# Installer toutes les dépendances
npm install

# Ou avec yarn
yarn install
```

### Lancer l'application
```powershell
# Démarrer le serveur de développement
npm start

# Démarrer avec cache nettoyé
npm start -- --clear
# ou
npx expo start -c

# Démarrer en mode tunnel (pour contourner les problèmes réseau)
npx expo start --tunnel

# Démarrer en mode LAN
npx expo start --lan

# Démarrer en mode localhost
npx expo start --localhost
```

### Lancer sur des plateformes spécifiques
```powershell
# Android
npm run android

# iOS (Mac uniquement)
npm run ios

# Web
npm run web
```

---

## 🛠️ Développement

### Nettoyage du cache
```powershell
# Nettoyer le cache Metro
npx react-native start --reset-cache

# Nettoyer le cache Expo
npx expo start -c

# Supprimer node_modules et réinstaller
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Vérification du code
```powershell
# Vérifier les erreurs TypeScript (si configuré)
npx tsc --noEmit

# Formater le code avec Prettier (si installé)
npx prettier --write "src/**/*.{ts,tsx}"

# Linter ESLint (si configuré)
npx eslint "src/**/*.{ts,tsx}"
```

---

## 📱 Build et Publication

### EAS Build

#### Installation et configuration
```powershell
# Installer EAS CLI globalement
npm install -g eas-cli

# Se connecter à Expo
eas login

# Configurer le projet
eas build:configure

# Voir les informations du projet
eas project:info
```

#### Builds de développement
```powershell
# Build de développement Android
eas build --platform android --profile development

# Build de développement iOS
eas build --platform ios --profile development
```

#### Builds de test (APK)
```powershell
# Build APK pour tests Android
eas build --platform android --profile preview

# Télécharger automatiquement après le build
eas build --platform android --profile preview --local
```

#### Builds de production
```powershell
# Build de production Android (AAB)
eas build --platform android --profile production

# Build de production iOS
eas build --platform ios --profile production

# Build pour les deux plateformes
eas build --platform all --profile production

# Build avec cache nettoyé
eas build --platform android --profile production --clear-cache
```

#### Submission aux stores
```powershell
# Soumettre à Google Play
eas submit --platform android --profile production

# Soumettre à l'App Store
eas submit --platform ios --profile production

# Les deux en même temps
eas submit --platform all --profile production
```

#### Gestion des builds
```powershell
# Lister tous les builds
eas build:list

# Voir les détails d'un build
eas build:view [BUILD_ID]

# Annuler un build en cours
eas build:cancel [BUILD_ID]
```

---

## 🔥 Firebase

### Commandes Firebase CLI
```powershell
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Initialiser Firebase dans le projet
firebase init

# Déployer les règles Firestore
firebase deploy --only firestore:rules

# Déployer les règles Storage
firebase deploy --only storage

# Déployer tout
firebase deploy
```

### Gérer les données Firestore
```powershell
# Exporter les données
firebase firestore:export gs://[BUCKET_NAME]/[EXPORT_PATH]

# Importer les données
firebase firestore:import gs://[BUCKET_NAME]/[EXPORT_PATH]

# Supprimer toutes les données d'une collection
firebase firestore:delete --all-collections --yes
```

---

## 📊 Gestion des versions

### Mise à jour des versions
```powershell
# Mettre à jour la version dans package.json
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

### Mise à jour app.json
Éditez manuellement `app.json`:
```json
{
  "expo": {
    "version": "1.0.1",
    "android": {
      "versionCode": 2  // Incrémentez toujours
    },
    "ios": {
      "buildNumber": "1.0.1"
    }
  }
}
```

---

## 🔍 Débogage

### Logs en temps réel
```powershell
# Logs Expo
npm start

# Dans une autre console, voir les logs du device
# (Appuyez sur 'd' dans le terminal Expo)

# Logs React Native
npx react-native log-android  # Pour Android
npx react-native log-ios      # Pour iOS
```

### Outils de développement
```powershell
# Ouvrir le menu développeur dans l'app
# Android: Secouer le téléphone ou Cmd+M (émulateur)
# iOS: Secouer le téléphone ou Cmd+D (simulateur)

# Recharger l'app
# Android: Double tap R
# iOS: Cmd+R

# Activer Fast Refresh (automatique dans Expo)
```

### Debug Firebase
```javascript
// Activer les logs Firebase dans le code
import { setLogLevel } from 'firebase/firestore';
setLogLevel('debug');
```

---

## 📦 Gestion des dépendances

### Installer des packages
```powershell
# Installer un package
npm install nom-du-package

# Installer une version spécifique
npm install nom-du-package@1.2.3

# Installer en dev dependency
npm install --save-dev nom-du-package

# Installer avec Expo (recommandé pour certains packages)
npx expo install nom-du-package
```

### Mettre à jour les packages
```powershell
# Vérifier les packages obsolètes
npm outdated

# Mettre à jour tous les packages
npm update

# Mettre à jour un package spécifique
npm update nom-du-package

# Mettre à jour vers la dernière version (même si breaking changes)
npm install nom-du-package@latest

# Mettre à jour SDK Expo
npx expo upgrade
```

### Désinstaller des packages
```powershell
# Désinstaller un package
npm uninstall nom-du-package
```

---

## 🎨 Assets et Ressources

### Générer les icônes et splash screens
```powershell
# Avec Expo (automatique)
npx expo prebuild

# Ou utilisez un générateur en ligne:
# - https://www.appicon.co
# - https://makeappicon.com
```

### Optimiser les images
```powershell
# Installer un optimiseur d'images
npm install -g imageoptim-cli

# Optimiser toutes les images
imageoptim --directory ./assets
```

---

## 🧪 Tests (si implémentés)

### Jest
```powershell
# Lancer les tests
npm test

# Lancer les tests en mode watch
npm test -- --watch

# Lancer les tests avec coverage
npm test -- --coverage

# Lancer un test spécifique
npm test -- MonTest.test.tsx
```

---

## 🗃️ Base de données

### Sauvegarder les données
```powershell
# Export Firestore
firebase firestore:export backups/backup-$(Get-Date -Format "yyyy-MM-dd")

# Ou via la console Firebase
# Firestore > Import/Export
```

---

## 🌐 Environnements

### Changer d'environnement
```powershell
# Développement (par défaut)
npm start

# Production (après build)
# Les variables d'environnement sont gérées dans app.json
```

### Variables d'environnement
```powershell
# Créer un fichier .env
Copy-Item .env.example .env

# Éditer les valeurs
notepad .env
```

---

## 📱 Gestion des devices

### Lister les devices connectés
```powershell
# Android
adb devices

# iOS (Mac uniquement)
xcrun simctl list devices
```

### Gérer les émulateurs Android
```powershell
# Lister les émulateurs
emulator -list-avds

# Démarrer un émulateur
emulator -avd Nom_De_L_Emulateur

# Créer un nouvel émulateur
# Via Android Studio > AVD Manager
```

---

## 🔐 Sécurité

### Gérer les secrets
```powershell
# Configurer les secrets EAS
eas secret:create --scope project --name SECRET_NAME --value secret_value

# Lister les secrets
eas secret:list

# Supprimer un secret
eas secret:delete --name SECRET_NAME
```

---

## 📈 Performance

### Analyser la performance
```powershell
# Profiler l'application
# Utilisez React DevTools dans le navigateur
# ou les outils de développement natifs
```

### Analyser la taille du bundle
```powershell
# Avec Expo
npx expo export

# Analyser les fichiers générés
# dans le dossier dist/
```

---

## 🆘 Aide et Diagnostics

### Informations système
```powershell
# Version de Node
node --version

# Version de npm
npm --version

# Version d'Expo CLI
npx expo --version

# Diagnostics Expo
npx expo-doctor

# Informations sur le projet
eas project:info
```

### Résolution de problèmes courants
```powershell
# Problème de cache
npx expo start -c

# Problème de dépendances
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Problème de Metro bundler
npx react-native start --reset-cache

# Réinitialiser complètement le projet
Remove-Item -Recurse -Force node_modules, .expo, dist
npm install
```

---

## 📚 Documentation

### Générer la documentation (si configuré)
```powershell
# Avec TypeDoc (si installé)
npx typedoc --out docs src
```

### Ouvrir la documentation
```powershell
# Documentation Expo
npx expo start
# Puis appuyez sur 'h' pour ouvrir l'aide

# Documentation React Native
Start-Process "https://reactnative.dev"

# Documentation Firebase
Start-Process "https://firebase.google.com/docs"
```

---

## 🎯 Raccourcis clavier (dans le terminal Expo)

Quand `npm start` est actif:

- `a` - Ouvrir sur Android
- `i` - Ouvrir sur iOS
- `w` - Ouvrir sur Web
- `r` - Recharger l'app
- `m` - Basculer le menu
- `d` - Ouvrir le DevTools
- `shift+d` - Basculer le mode de développement
- `j` - Ouvrir le debugger
- `c` - Nettoyer le cache Metro
- `?` - Afficher l'aide

---

## 💡 Astuces

### Développement plus rapide
```powershell
# Activer Fast Refresh (déjà activé par défaut)
# Sauvegarder automatiquement recharge l'app

# Utiliser le mode tunnel pour partager facilement
npx expo start --tunnel
```

### Productivité
```powershell
# Créer des alias PowerShell
# Ajoutez dans votre profil PowerShell ($PROFILE):
function exstart { npx expo start -c }
function exbuild { eas build --platform android --profile production }

# Puis utilisez simplement:
exstart
exbuild
```

---

**Ce document sera mis à jour au fur et à mesure de l'évolution du projet. N'hésitez pas à contribuer!** 🚀
