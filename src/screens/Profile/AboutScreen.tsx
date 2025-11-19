import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const AboutScreen = ({ navigation }: any) => {
  const socialLinks = [
    {
      icon: 'logo-facebook',
      name: 'Facebook',
      url: 'https://facebook.com',
      color: '#1877F2',
    },
    {
      icon: 'logo-instagram',
      name: 'Instagram',
      url: 'https://instagram.com',
      color: '#E4405F',
    },
    {
      icon: 'logo-twitter',
      name: 'Twitter',
      url: 'https://twitter.com',
      color: '#1DA1F2',
    },
    {
      icon: 'logo-linkedin',
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      color: '#0A66C2',
    },
  ];

  const menuItems = [
    {
      icon: 'document-text-outline',
      title: 'Conditions d\'utilisation',
      onPress: () => Linking.openURL('https://example.com/terms'),
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Politique de confidentialité',
      onPress: () => Linking.openURL('https://example.com/privacy'),
    },
    {
      icon: 'code-slash-outline',
      title: 'Licences open source',
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>À propos</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="home" size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>Immobilier App</Text>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Trouvez la propriété de vos rêves avec notre application immobilière.
            Nous connectons acheteurs, vendeurs et locataires à travers tout le Maroc.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suivez-nous</Text>
          <View style={styles.socialContainer}>
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.socialButton, { backgroundColor: social.color }]}
                onPress={() => Linking.openURL(social.url)}
              >
                <Ionicons name={social.icon as any} size={28} color={COLORS.white} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Développé avec ❤️</Text>
          <Text style={styles.infoText}>
            © 2025 Immobilier App. Tous droits réservés.
          </Text>
        </View>

        <View style={styles.creditsSection}>
          <Text style={styles.creditsTitle}>Technologies utilisées</Text>
          <View style={styles.techContainer}>
            <View style={styles.techItem}>
              <Text style={styles.techName}>React Native</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techName}>Firebase</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techName}>Expo</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techName}>TypeScript</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  logoSection: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    padding: SIZES.padding * 2,
    marginBottom: 16,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  descriptionSection: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 1.5,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SIZES.padding,
    marginBottom: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 1.5,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  menuSection: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  infoSection: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  creditsSection: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginBottom: 40,
  },
  creditsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  techItem: {
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  techName: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default AboutScreen;
