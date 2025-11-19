# 🚀 Guide de Déploiement - Home Rental App

Ce guide vous accompagne pour déployer votre application Home Rental sur les stores Android et iOS.

## 📋 Prérequis

### Comptes Nécessaires

1. **Compte Expo** (Gratuit)
   - Créez un compte sur [expo.dev](https://expo.dev)
   - Installez Expo CLI: `npm install -g eas-cli`
   - Connectez-vous: `eas login`

2. **Compte Google Play** (Android - 25$ unique)
   - [console.play.google.com](https://play.google.com/console)

3. **Compte Apple Developer** (iOS - 99$/an)
   - [developer.apple.com](https://developer.apple.com)

---

## 🛠️ Configuration Initiale

### 1. Configurer EAS Build

```bash
# Installez EAS CLI globalement
npm install -g eas-cli

# Connectez-vous à votre compte Expo
eas login

# Configurez le projet
eas build:configure
```

### 2. Créer le fichier eas.json

Le fichier `eas.json` sera créé automatiquement. Voici une configuration recommandée:

```json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "autoIncrement": true
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 📱 Déploiement Android

### Étape 1: Préparer l'Application

#### 1.1 Icône et Splash Screen

Assurez-vous d'avoir ces images dans le dossier `assets/`:
- `icon.png` (1024x1024px)
- `adaptive-icon.png` (1024x1024px)
- `splash.png` (2048x2048px)

#### 1.2 Mettre à jour app.json

```json
{
  "expo": {
    "name": "Home Rental",
    "slug": "home-rental-app",
    "version": "1.0.0",
    "android": {
      "package": "com.votreentreprise.homerental",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

### Étape 2: Build de Production

```bash
# Build pour Android (AAB pour le Play Store)
eas build --platform android --profile production

# Ou build APK pour tests
eas build --platform android --profile preview
```

Le build prendra 10-20 minutes. Vous recevrez un lien pour télécharger le fichier.

### Étape 3: Préparer pour le Play Store

#### 3.1 Créer un Compte Développeur Google Play

1. Allez sur [play.google.com/console](https://play.google.com/console)
2. Payez les frais d'inscription (25$ unique)
3. Remplissez le profil de votre compte

#### 3.2 Créer une Nouvelle Application

1. Cliquez sur "Créer une application"
2. Nom de l'application: "Home Rental"
3. Langue par défaut: Français
4. Type: Application
5. Gratuit ou payant: Gratuit

#### 3.3 Préparer les Assets

**Captures d'écran requises:**
- Téléphone: 2-8 captures (1080x1920 ou 1080x2340)
- Tablette 7": 2-8 captures (1200x1920)
- Tablette 10": 2-8 captures (2560x1600)

**Graphique de la fonctionnalité:**
- 1024x500px
- Format: JPG ou PNG 24 bits

**Icône de l'application:**
- 512x512px
- Format: PNG 32 bits avec transparence

#### 3.4 Description de l'Application

**Titre:** Home Rental - Immobilier

**Description courte (80 caractères max):**
```
Trouvez votre logement idéal - Achat, location, annonces
```

**Description complète:**
```
🏠 Home Rental - Votre Application Immobilier Complète

Découvrez Home Rental, l'application mobile qui révolutionne la recherche immobilière. Que vous cherchiez à acheter, louer ou publier une annonce, nous avons tout ce qu'il vous faut!

✨ FONCTIONNALITÉS PRINCIPALES:

🔍 Recherche Avancée
• Filtrez par prix, localisation, type de bien
• Recherche par carte interactive
• Sauvegardez vos recherches favorites

🏘️ Annonces Détaillées
• Photos haute qualité
• Descriptions complètes
• Visite virtuelle 360°
• Localisation sur carte

💬 Messagerie Intégrée
• Contactez directement les propriétaires
• Chat en temps réel
• Notifications instantanées

📝 Publier des Annonces
• Interface simple et intuitive
• Upload de photos illimité
• Géolocalisation automatique
• Gestion de vos annonces

⭐ Favoris et Alertes
• Sauvegardez vos biens préférés
• Recevez des alertes personnalisées
• Comparez facilement

🗺️ Carte Interactive
• Visualisez tous les biens sur une carte
• Recherche géographique
• Points d'intérêt à proximité

🔒 Sécurisé et Fiable
• Authentification sécurisée
• Données protégées
• Support client réactif

📱 100% GRATUIT
Téléchargez maintenant et trouvez votre futur logement en quelques clics!

CONTACTEZ-NOUS:
Email: support@homerental.com
Site: www.homerental.com
```

### Étape 4: Soumettre au Play Store

```bash
# Automatique avec EAS Submit
eas submit --platform android --profile production

# Ou manuellement via la console Google Play
```

Si vous soumettez manuellement:
1. Production > Versions > Créer une nouvelle version
2. Uploadez le fichier AAB
3. Remplissez tous les détails requis
4. Enregistrez > Examiner > Publier

### Étape 5: Classification du Contenu

1. Répondez au questionnaire de classification
2. Sélectionnez les catégories appropriées
3. Confirmez la classification

### Étape 6: Tarification et Distribution

1. Pays: Sélectionnez tous les pays ou spécifiques
2. Prix: Gratuit
3. Enregistrez

**⏱️ Temps de review:** 1-7 jours

---

## 🍎 Déploiement iOS

### Étape 1: Préparer l'Application

#### 1.1 Mettre à jour app.json

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.votreentreprise.homerental",
      "buildNumber": "1.0.0",
      "supportsTablet": true,
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Cette app utilise votre localisation pour trouver des propriétés à proximité.",
        "NSCameraUsageDescription": "Cette app nécessite l'accès à la caméra pour prendre des photos de propriétés.",
        "NSPhotoLibraryUsageDescription": "Cette app nécessite l'accès à vos photos pour sélectionner des images de propriétés."
      }
    }
  }
}
```

### Étape 2: Build pour iOS

```bash
# Build pour iOS
eas build --platform ios --profile production
```

**Note:** Vous devez avoir un compte Apple Developer actif (99$/an)

### Étape 3: Configurer App Store Connect

1. Allez sur [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Créez une nouvelle app:
   - Nom: Home Rental
   - Langue principale: Français
   - Bundle ID: com.votreentreprise.homerental
   - SKU: unique identifier (ex: homerental001)

### Étape 4: Préparer les Assets

**Captures d'écran requises:**
- iPhone 6.7": 1290x2796px (3 minimum)
- iPhone 6.5": 1242x2688px (3 minimum)
- iPhone 5.5": 1242x2208px (3 minimum)
- iPad Pro 12.9": 2048x2732px (3 minimum)

**Icône:**
- 1024x1024px sans transparence

### Étape 5: Description de l'App

**Nom:** Home Rental

**Sous-titre (30 caractères max):**
```
Trouvez votre logement idéal
```

**Description:**
(Utilisez la même description que pour Android)

**Mots-clés (100 caractères max):**
```
immobilier,maison,appartement,location,achat,logement,propriété,annonce
```

**URL de support:**
```
https://votresite.com/support
```

**URL marketing (optionnel):**
```
https://votresite.com
```

### Étape 6: Informations App

**Catégorie principale:** Lifestyle
**Catégorie secondaire:** Business

**Classification du contenu:**
- None (Aucune)

**Informations de confidentialité:**
- URL de la politique de confidentialité requise
- Déclarez toutes les données collectées

### Étape 7: Soumettre à l'App Store

```bash
# Automatique avec EAS Submit
eas submit --platform ios --profile production
```

Ou manuellement:
1. Uploadez l'IPA via Transporter (app macOS)
2. Sélectionnez le build dans App Store Connect
3. Remplissez toutes les informations
4. Soumettez pour review

**⏱️ Temps de review:** 1-7 jours

---

## 🔄 Mises à Jour

### Android

```bash
# 1. Incrémentez la version dans app.json
{
  "version": "1.0.1",
  "android": {
    "versionCode": 2  // Incrémentez toujours
  }
}

# 2. Build et submit
eas build --platform android --profile production
eas submit --platform android --profile production
```

### iOS

```bash
# 1. Incrémentez la version dans app.json
{
  "version": "1.0.1",
  "ios": {
    "buildNumber": "1.0.1"  // Incrémentez toujours
  }
}

# 2. Build et submit
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

---

## 📊 Analytics et Monitoring

### Firebase Analytics

Déjà configuré dans l'app. Consultez la console Firebase pour:
- Nombre d'utilisateurs actifs
- Événements personnalisés
- Crashes et erreurs
- Performance

### Expo Analytics

```bash
# Voir les statistiques de téléchargement
eas project:info
```

---

## 🔒 Checklist Avant Publication

### Technique
- [ ] Testé sur plusieurs appareils Android
- [ ] Testé sur plusieurs appareils iOS
- [ ] Pas de crashes
- [ ] Performance optimale
- [ ] Toutes les fonctionnalités marchent
- [ ] Pas de fuites mémoire

### Légal
- [ ] Politique de confidentialité créée
- [ ] Conditions d'utilisation rédigées
- [ ] Conformité RGPD (si applicable)
- [ ] Déclarations de collecte de données

### Marketing
- [ ] Description optimisée (SEO)
- [ ] Captures d'écran attrayantes
- [ ] Icône professionnelle
- [ ] Graphiques de fonctionnalité
- [ ] Mots-clés pertinents

### Support
- [ ] Email de support configuré
- [ ] Site web ou page de support
- [ ] FAQ disponible
- [ ] Système de feedback

---

## 🆘 Problèmes Courants

### Build échoue

```bash
# Nettoyez et recommencez
eas build:configure
eas build --platform android --profile production --clear-cache
```

### Rejet du store

**Raisons courantes:**
1. Captures d'écran incorrectes
2. Description non conforme
3. Fonctionnalité manquante
4. Crash au lancement
5. Politique de confidentialité absente

**Solution:** Corrigez le problème et resoumettez

---

## 📞 Support

Pour plus d'aide:
- [Documentation Expo](https://docs.expo.dev)
- [Documentation EAS Build](https://docs.expo.dev/build/introduction/)
- [Support Google Play](https://support.google.com/googleplay)
- [Support App Store](https://developer.apple.com/support/)

---

**Bonne chance avec votre lancement! 🚀**
