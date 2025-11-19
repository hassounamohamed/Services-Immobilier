# Firebase Security Rules - Home Rental App

## Règles Firestore

Copiez ces règles dans la console Firebase (Firestore Database > Règles):

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
    
    // Properties collection
    match /properties/{propertyId} {
      allow read: if isAuthenticated();
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

## Règles Storage

Copiez ces règles dans la console Firebase (Storage > Règles):

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
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
      allow delete: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // User avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
      allow delete: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

## Indexes Firestore

Pour optimiser les requêtes, créez ces index composites dans la console Firebase:

### Collection: properties

1. **Index pour la recherche filtrée**
   - Champ 1: `type` (Ascending)
   - Champ 2: `createdAt` (Descending)

2. **Index pour les propriétés en vedette**
   - Champ 1: `featured` (Ascending)
   - Champ 2: `createdAt` (Descending)

3. **Index pour la recherche par ville**
   - Champ 1: `location.city` (Ascending)
   - Champ 2: `price` (Ascending)

### Collection: messages

1. **Index pour les messages d'une conversation**
   - Champ 1: `conversationId` (Ascending)
   - Champ 2: `timestamp` (Ascending)

### Collection: conversations

1. **Index pour les conversations d'un utilisateur**
   - Champ 1: `participants` (Array)
   - Champ 2: `lastMessageTime` (Descending)

## Configuration Authentication

Dans Firebase Console > Authentication:

1. Activez **Email/Password** comme méthode de connexion
2. Configurez les domaines autorisés si nécessaire
3. Personnalisez les templates d'emails (optionnel)

## Configuration Analytics

Dans Firebase Console > Analytics:

1. Activez Google Analytics
2. Configurez les événements personnalisés si nécessaire
3. Liez avec Google Analytics pour des rapports détaillés
