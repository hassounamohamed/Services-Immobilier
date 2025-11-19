# 🚀 Guide de Démarrage Rapide - Home Rental App

## Installation en 5 minutes

### 1. Installation des dépendances

Ouvrez un terminal dans le dossier du projet et exécutez:

```powershell
npm install
```

Cette commande installera toutes les dépendances nécessaires, y compris:
- React Native et Expo
- Firebase SDK
- React Navigation
- Et toutes les autres bibliothèques

⏱️ **Temps estimé**: 2-3 minutes

---

### 2. Lancement de l'application

Une fois l'installation terminée, lancez le serveur de développement:

```powershell
npm start
```

ou avec Expo:

```powershell
npx expo start
```

Un QR code s'affichera dans le terminal et une page web s'ouvrira dans votre navigateur.

⏱️ **Temps estimé**: 30 secondes

---

### 3. Tester l'application

Vous avez **3 options** pour tester l'application:

#### Option A: Sur votre smartphone (Recommandé) 📱

1. **Android**: 
   - Installez [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) depuis Google Play
   - Ouvrez Expo Go et scannez le QR code

2. **iOS**:
   - Installez [Expo Go](https://apps.apple.com/app/expo-go/id982107779) depuis l'App Store
   - Ouvrez l'appareil photo natif et scannez le QR code

#### Option B: Sur un émulateur Android

```powershell
npm run android
```

**Prérequis**: Android Studio avec un émulateur configuré

#### Option C: Sur un simulateur iOS (Mac uniquement)

```powershell
npm run ios
```

**Prérequis**: Xcode installé

---

## ✅ Vérification de l'Installation

Si tout fonctionne correctement, vous devriez voir:

1. ✅ L'écran de connexion avec le logo "Home Rental"
2. ✅ Un dégradé violet/bleu élégant
3. ✅ Les champs Email et Mot de passe
4. ✅ Les boutons "Se connecter" et "S'inscrire"

---

## 🎯 Premier Test

### Créer un compte

1. Appuyez sur **"S'inscrire"**
2. Remplissez le formulaire:
   - Nom complet: `Test User`
   - Email: `test@example.com`
   - Mot de passe: `test123` (minimum 6 caractères)
   - Confirmer le mot de passe: `test123`
3. Appuyez sur **"S'inscrire"**

### Se connecter

1. Email: `test@example.com`
2. Mot de passe: `test123`
3. Appuyez sur **"Se connecter"**

Vous devriez maintenant voir l'écran d'accueil avec:
- La barre de navigation en bas (5 onglets)
- La barre de recherche en haut
- Les filtres (Tout, À vendre, À louer)
- La section "Toutes les propriétés"

---

## 🔧 Résolution des Problèmes Courants

### Problème: Erreur lors de `npm install`

**Solution**:
```powershell
# Supprimez le dossier node_modules et le fichier package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Réinstallez
npm install
```

### Problème: Le QR code ne s'affiche pas

**Solution**:
```powershell
# Démarrez avec le cache nettoyé
npx expo start -c
```

### Problème: Erreur de connexion Firebase

**Solution**: Le projet est déjà configuré avec Firebase. Si vous voyez des erreurs:
1. Vérifiez votre connexion internet
2. Assurez-vous que les règles Firebase sont correctement configurées (voir `FIREBASE_RULES.md`)

### Problème: L'application ne se charge pas sur le téléphone

**Solution**:
1. Vérifiez que votre téléphone et votre ordinateur sont sur le **même réseau Wi-Fi**
2. Désactivez temporairement les pare-feu ou VPN
3. Essayez de vous connecter en mode **Tunnel**:
   ```powershell
   npx expo start --tunnel
   ```

---

## 📱 Fonctionnalités à Tester

Une fois connecté, testez ces fonctionnalités:

### 1. Navigation entre les onglets
- ✅ **Accueil**: Liste des propriétés
- ✅ **Recherche**: Filtres avancés
- ✅ **Publier**: Ajouter une annonce
- ✅ **Favoris**: Propriétés sauvegardées
- ✅ **Profil**: Informations utilisateur

### 2. Recherche
- Changez les filtres (Tout / À vendre / À louer)
- Utilisez la barre de recherche
- Accédez aux filtres avancés depuis l'onglet Recherche

### 3. Publier une annonce
1. Allez dans l'onglet **Publier**
2. Ajoutez des photos (utilisez le bouton caméra)
3. Remplissez le formulaire
4. Publiez l'annonce

### 4. Profil
- Consultez vos statistiques
- Explorez les options du menu
- Testez la déconnexion

---

## 🎨 Personnalisation Rapide

### Changer les couleurs

Éditez `src/constants/theme.ts`:

```typescript
export const COLORS = {
  primary: '#4A90E2',      // Changez cette couleur
  secondary: '#50C878',    // Et celle-ci
  // ...
};
```

### Modifier le logo

Remplacez les fichiers dans le dossier `assets/`:
- `icon.png` (1024x1024)
- `splash.png` (2048x2048)
- `adaptive-icon.png` (1024x1024)

---

## 📚 Documentation Complète

Pour plus d'informations, consultez:

- 📖 **README.md** - Documentation générale
- 🏗️ **ARCHITECTURE_C4.md** - Architecture du système
- 🔥 **FIREBASE_RULES.md** - Configuration Firebase

---

## 🆘 Besoin d'Aide?

Si vous rencontrez des problèmes:

1. Consultez la section "Résolution des Problèmes" ci-dessus
2. Vérifiez les logs dans le terminal
3. Redémarrez le serveur avec `npx expo start -c`
4. Ouvrez une issue sur GitHub

---

## ✨ Prochaines Étapes

Maintenant que votre application fonctionne:

1. 📖 Lisez la documentation complète (README.md)
2. 🏗️ Étudiez l'architecture (ARCHITECTURE_C4.md)
3. 🔥 Configurez Firebase pour la production
4. 🎨 Personnalisez le design selon vos besoins
5. 📱 Testez toutes les fonctionnalités
6. 🚀 Déployez votre application!

---

**Bon développement! 🚀**
