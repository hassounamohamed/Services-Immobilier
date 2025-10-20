## Structure du projet

```
HomeRentalApp/
├── app/                            # Expo Router (navigation principale)
│   ├── (tabs)/                     # Navigation par onglets
│   │   ├── index.tsx               # Accueil (Home)
│   │   ├── explore.tsx             # Recherche / Explore
│   │   ├── favorites.tsx           # Favoris
│   │   ├── chat.tsx                # Messagerie
│   │   └── profile.tsx             # Profil utilisateur
│   ├── auth/                       # Pages d'authentification
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── property/                   # Gestion des biens
│   │   ├── details.tsx
│   │   ├── add-property.tsx
│   │   └── my-listings.tsx
│   ├── map/                        # Écran carte
│   │   └── map-screen.tsx
│   ├── modal.tsx                   # Exemple de modal (Expo)
│   ├── _layout.tsx                 # Layout global
│   └── _layout.auth.tsx            # Layout spécifique pour auth
│
├── src/
│   ├── components/                 # Composants réutilisables
│   │   ├── PropertyCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CustomButton.tsx
│   │   └── Loader.tsx
│   ├── navigation/                 # (Optionnel si non expo-router)
│   │   ├── AppNavigator.tsx
│   │   └── BottomTabNavigator.tsx
│   ├── context/                    # Context API (Auth, Favoris, Chat)
│   │   ├── AuthContext.tsx
│   │   ├── FavoritesContext.tsx
│   │   └── ChatContext.tsx
│   ├── services/                   # Intégration Firebase / API
│   │   ├── firebase.ts             # Initialisation Firebase (stub)
│   │   ├── authService.ts
│   │   ├── propertyService.ts
│   │   ├── chatService.ts
│   │   └── notificationService.ts
│   ├── utils/                      # Fonctions utilitaires
│   │   ├── formatPrice.ts
│   │   ├── validateForm.ts
│   │   └── geolocationHelper.ts
│   ├── constants/                  # Variables globales
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   └── config.ts
│   └── types/                      # Types et interfaces TypeScript
│       ├── property.ts
│       ├── user.ts
│       └── message.ts
│
├── services/firebase.ts            # Re-export -> src/services/firebase
└── ...
```

Notes:
- Nous utilisons Expo Router pour la navigation. Les fichiers dans `src/navigation` sont optionnels.
- `services/firebase.ts` au niveau racine ré-exporte le module de `src/` pour conserver les imports existants.
- Les fichiers de services et context contiennent des stubs à remplacer par l'implémentation réelle (Firebase Auth, Firestore, Expo Notifications, etc.).

## Étapes suivantes
- Brancher Firebase (env, config) dans `src/constants/config.ts` et initialiser dans `src/services/firebase.ts`.
- Remplacer les stubs des services par des appels réels.
- Ajouter les tests unitaires de base pour les utils et services.

### Feature flags
- Un flag `features.gpt5` est ajouté dans `src/constants/config.ts` (activé par défaut pour tous les clients).
- Utilisation côté app: `import { getFeatureFlag } from '@/src/utils/featureFlags'; const enabled = getFeatureFlag('gpt5');`
- Vous pourrez migrer ces flags vers un backend (Remote Config, API) plus tard.
