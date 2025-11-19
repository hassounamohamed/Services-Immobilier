# 🔧 Instructions de Configuration Firebase

## ⚠️ IMPORTANT - Actions Requises

Vous devez configurer les règles de sécurité dans votre console Firebase pour résoudre les erreurs de permissions.

---

## 📋 Étape 1: Règles Firestore Database

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet: **home-rental-app-de64b**
3. Dans le menu latéral, cliquez sur **Firestore Database**
4. Cliquez sur l'onglet **Règles**
5. Remplacez tout le contenu par ces règles:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && isOwner(userId);
      allow delete: if isAuthenticated() && isOwner(userId);
    }
    
    // Properties collection - LECTURE PUBLIQUE ACTIVÉE
    match /properties/{propertyId} {
      allow read: if true; // Permet à tous de lire les propriétés
      allow create: if isAuthenticated() && 
                       request.resource.data.ownerId == request.auth.uid;
      allow update: if isAuthenticated() && 
                       resource.data.ownerId == request.auth.uid;
      allow delete: if isAuthenticated() && 
                       resource.data.ownerId == request.auth.uid;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if isAuthenticated() && 
                     (request.auth.uid == resource.data.senderId || 
                      request.auth.uid == resource.data.receiverId);
      allow create: if isAuthenticated() && 
                       request.resource.data.senderId == request.auth.uid;
      allow update: if isAuthenticated() && 
                       (request.auth.uid == resource.data.senderId || 
                        request.auth.uid == resource.data.receiverId);
      allow delete: if isAuthenticated() && 
                       request.auth.uid == resource.data.senderId;
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      allow read: if isAuthenticated() && 
                     request.auth.uid in resource.data.participants;
      allow create: if isAuthenticated() && 
                       request.auth.uid in request.resource.data.participants;
      allow update: if isAuthenticated() && 
                       request.auth.uid in resource.data.participants;
      allow delete: if isAuthenticated() && 
                       request.auth.uid in resource.data.participants;
    }
    
    // Favorites collection
    match /favorites/{favoriteId} {
      allow read: if isAuthenticated() && 
                     request.auth.uid == resource.data.userId;
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

6. Cliquez sur **Publier** en haut à droite

---

## 📋 Étape 2: Règles Firebase Storage

1. Dans la console Firebase, cliquez sur **Storage** dans le menu latéral
2. Cliquez sur l'onglet **Règles**
3. Remplacez tout le contenu par ces règles:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Properties images
    match /properties/{userId}/{allPaths=**} {
      allow read: if true; // Permet à tous de lire les images
      allow write: if isAuthenticated() && request.auth.uid == userId;
      allow delete: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // User avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true; // Permet à tous de voir les avatars
      allow write: if isAuthenticated() && request.auth.uid == userId;
      allow delete: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

4. Cliquez sur **Publier**

---

## 📋 Étape 3: Vérifier l'Authentication

1. Dans la console Firebase, cliquez sur **Authentication**
2. Vérifiez que **Email/Password** est activé
3. Si non activé:
   - Cliquez sur **Get started** (si première fois)
   - Cliquez sur **Email/Password**
   - Activez le premier interrupteur
   - Cliquez sur **Enregistrer**

---

## 🔍 Vérification

Après avoir appliqué ces modifications:

1. Fermez complètement votre application
2. Redémarrez le serveur de développement:
   ```bash
   npx expo start --clear
   ```
3. Testez les fonctionnalités suivantes:
   - ✅ Lecture des propriétés (sans connexion)
   - ✅ Connexion/Inscription
   - ✅ Upload d'images
   - ✅ Ajout de propriétés

---

## ✅ Corrections Appliquées dans le Code

### 1. API ImagePicker Mise à Jour
- ❌ Ancien: `ImagePicker.MediaTypeOptions.Images`
- ✅ Nouveau: `[ImagePicker.MediaType.Images]`

### 2. Chemin Storage Corrigé
- ❌ Ancien: `properties/image.jpg`
- ✅ Nouveau: `properties/{userId}/{timestamp}_random.jpg`

### 3. Gestion d'Erreurs Améliorée
- Ajout de messages d'erreur spécifiques pour les problèmes de permissions
- Meilleure identification des erreurs Firebase

---

## 🆘 En Cas de Problème

Si les erreurs persistent:

1. **Vérifiez que vous êtes connecté** avant d'ajouter une propriété
2. **Videz le cache**:
   ```bash
   npx expo start --clear
   ```
3. **Vérifiez les règles** dans la console Firebase
4. **Consultez les logs** dans la console Firebase > Storage > Fichiers

---

## 📝 Notes Importantes

- Les règles de lecture publique (`allow read: if true`) pour les propriétés et images permettent à tous les utilisateurs de voir le contenu
- Seuls les utilisateurs authentifiés peuvent créer/modifier/supprimer leurs propres données
- Les chemins de stockage incluent maintenant l'ID utilisateur pour respecter les règles de sécurité
