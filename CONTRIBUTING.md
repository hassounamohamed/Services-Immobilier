# Guide de Contribution - Home Rental App

Merci de votre intérêt pour contribuer à Home Rental App! Ce document vous guidera à travers le processus de contribution.

## 🌟 Comment Contribuer

### Signaler un Bug

Si vous trouvez un bug, veuillez créer une issue avec:

1. **Titre clair**: Description courte du problème
2. **Description détaillée**: 
   - Étapes pour reproduire le bug
   - Comportement attendu vs comportement observé
   - Screenshots si applicable
3. **Environnement**:
   - OS (Android/iOS/Web)
   - Version de l'application
   - Version d'Expo/React Native

**Template de Bug Report:**
```markdown
### Description
[Description claire du bug]

### Étapes pour reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Scroller jusqu'à '...'
4. Voir l'erreur

### Comportement attendu
[Ce qui devrait se passer]

### Comportement observé
[Ce qui se passe actuellement]

### Screenshots
[Si applicable]

### Environnement
- OS: [ex: Android 13]
- Version App: [ex: 1.0.0]
- Expo: [ex: 52.0.0]
```

### Proposer une Nouvelle Fonctionnalité

Pour proposer une nouvelle fonctionnalité:

1. Créez une issue avec le label `enhancement`
2. Décrivez la fonctionnalité en détail
3. Expliquez pourquoi elle serait utile
4. Ajoutez des mockups/wireframes si possible

**Template de Feature Request:**
```markdown
### Description de la fonctionnalité
[Description claire de la fonctionnalité]

### Problème résolu
[Quel problème cette fonctionnalité résout-elle?]

### Solution proposée
[Comment cette fonctionnalité devrait fonctionner]

### Alternatives considérées
[Autres solutions envisagées]

### Mockups/Wireframes
[Si applicable]
```

## 🔧 Process de Développement

### 1. Fork et Clone

```bash
# Fork le repository sur GitHub, puis:
git clone https://github.com/votre-username/home-rental-app.git
cd home-rental-app
npm install
```

### 2. Créer une Branche

```bash
# Créez une branche pour votre fonctionnalité/fix
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-du-bug
```

**Convention de nommage des branches:**
- `feature/` - Nouvelles fonctionnalités
- `fix/` - Corrections de bugs
- `docs/` - Modifications de documentation
- `refactor/` - Refactoring de code
- `test/` - Ajout/modification de tests
- `style/` - Modifications de style/formatting

### 3. Développer

Suivez ces bonnes pratiques:

#### Code Style

```typescript
// ✅ BON - Nommage explicite
const getUserProperties = async (userId: string) => {
  // ...
};

// ❌ MAUVAIS - Nommage vague
const getData = async (id: string) => {
  // ...
};
```

#### TypeScript

```typescript
// ✅ BON - Types explicites
interface PropertyCardProps {
  property: Property;
  onPress: (property: Property) => void;
}

// ❌ MAUVAIS - Types manquants
const PropertyCard = ({ property, onPress }: any) => {
  // ...
};
```

#### Commentaires

```typescript
// ✅ BON - Commentaires utiles
// Récupère les propriétés favorites de l'utilisateur
// et joint les données complètes depuis la collection properties
const getFavorites = async (userId: string) => {
  // ...
};

// ❌ MAUVAIS - Commentaires inutiles
// Cette fonction récupère les favoris
const getFavorites = async (userId: string) => {
  // ...
};
```

### 4. Tester

Avant de soumettre:

```bash
# Lancez l'application
npm start

# Testez sur:
# - Android (émulateur ou device)
# - iOS (simulateur ou device si disponible)
# - Web (optionnel)

# Vérifiez:
# - Pas d'erreurs dans la console
# - Fonctionnalité fonctionne comme prévu
# - UI responsive sur différentes tailles d'écran
# - Performance acceptable
```

### 5. Commit

Utilisez des messages de commit clairs et descriptifs:

```bash
# Format: <type>: <description>

# Types:
# - feat: Nouvelle fonctionnalité
# - fix: Correction de bug
# - docs: Documentation
# - style: Formatting, points-virgules manquants, etc.
# - refactor: Refactoring de code
# - test: Ajout de tests
# - chore: Tâches de maintenance

# Exemples:
git commit -m "feat: ajout de la recherche par code postal"
git commit -m "fix: correction du crash au chargement des images"
git commit -m "docs: mise à jour du README avec nouvelles instructions"
git commit -m "refactor: optimisation du chargement des propriétés"
```

### 6. Push et Pull Request

```bash
# Push vers votre fork
git push origin feature/ma-nouvelle-fonctionnalite

# Créez une Pull Request sur GitHub
```

**Template de Pull Request:**
```markdown
## Description
[Description claire des changements]

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Changements effectués
- [x] Ajout de...
- [x] Modification de...
- [x] Suppression de...

## Tests
- [ ] Testé sur Android
- [ ] Testé sur iOS
- [ ] Testé sur Web
- [ ] Pas de régression

## Screenshots/Vidéos
[Si applicable]

## Checklist
- [ ] Mon code suit le style du projet
- [ ] J'ai commenté mon code, particulièrement dans les zones difficiles
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai testé sur plusieurs appareils/tailles d'écran
```

## 📋 Standards de Code

### Structure des Fichiers

```typescript
// 1. Imports externes
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Imports internes
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES } from '../../constants/theme';
import { Property } from '../../types';

// 3. Types/Interfaces
interface MyScreenProps {
  navigation: any;
  route: any;
}

// 4. Composant
const MyScreen: React.FC<MyScreenProps> = ({ navigation, route }) => {
  // États
  const [data, setData] = useState<Property[]>([]);
  
  // Hooks
  const { user } = useAuth();
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Fonctions
  const handleAction = () => {
    // ...
  };
  
  // Render
  return (
    <View style={styles.container}>
      {/* JSX */}
    </View>
  );
};

// 5. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

// 6. Export
export default MyScreen;
```

### Nommage des Composants

```typescript
// ✅ BON
PropertyCard.tsx
UserProfile.tsx
SearchFilters.tsx

// ❌ MAUVAIS
propertycard.tsx
userprofile.tsx
search-filters.tsx
```

### Organisation des Styles

```typescript
// ✅ BON - Styles organisés logiquement
const styles = StyleSheet.create({
  // Container styles
  container: { /* ... */ },
  content: { /* ... */ },
  
  // Header styles
  header: { /* ... */ },
  headerTitle: { /* ... */ },
  
  // Card styles
  card: { /* ... */ },
  cardImage: { /* ... */ },
  cardTitle: { /* ... */ },
});

// ❌ MAUVAIS - Styles désorganisés
const styles = StyleSheet.create({
  container: { /* ... */ },
  cardTitle: { /* ... */ },
  header: { /* ... */ },
  cardImage: { /* ... */ },
});
```

## 🎨 Design Guidelines

### Couleurs

Utilisez toujours les couleurs du thème:

```typescript
// ✅ BON
import { COLORS } from '../../constants/theme';

backgroundColor: COLORS.primary

// ❌ MAUVAIS
backgroundColor: '#4A90E2'
```

### Espacements

Utilisez les tailles standardisées:

```typescript
// ✅ BON
import { SIZES } from '../../constants/theme';

padding: SIZES.padding
marginTop: SIZES.base * 2

// ❌ MAUVAIS
padding: 16
marginTop: 16
```

### Responsive

Assurez-vous que votre UI est responsive:

```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Utilisez des pourcentages ou des calculs basés sur la taille de l'écran
const cardWidth = width * 0.9;
const imageHeight = height * 0.3;
```

## 🔍 Review Process

Votre Pull Request sera reviewée selon ces critères:

1. **Fonctionnalité**: La fonctionnalité fonctionne comme prévu
2. **Code Quality**: Code propre, lisible et maintenable
3. **Performance**: Pas de ralentissement perceptible
4. **UI/UX**: Design cohérent avec le reste de l'app
5. **Tests**: Testé sur plusieurs plateformes
6. **Documentation**: Code et changements bien documentés

## 📞 Questions?

Si vous avez des questions:

1. Consultez la documentation (README.md, ARCHITECTURE_C4.md)
2. Cherchez dans les issues existantes
3. Créez une nouvelle issue avec le label `question`
4. Contactez les mainteneurs

## 🙏 Merci!

Merci de contribuer à Home Rental App! Chaque contribution, qu'elle soit grande ou petite, est appréciée.

---

**Happy Coding! 🚀**
