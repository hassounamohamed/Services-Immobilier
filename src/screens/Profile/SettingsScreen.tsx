import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const SettingsScreen = ({ navigation }: any) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            // TODO: Implémenter la suppression du compte
            Alert.alert('Info', 'Fonction en développement');
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Préférences',
      items: [
        {
          icon: 'moon-outline',
          title: 'Mode sombre',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          icon: 'language-outline',
          title: 'Langue',
          type: 'navigation',
          value: 'Français',
          onPress: () => Alert.alert('Info', 'Changement de langue bientôt disponible'),
        },
      ],
    },
    {
      title: 'Confidentialité',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Notifications',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: 'location-outline',
          title: 'Services de localisation',
          type: 'switch',
          value: locationServices,
          onValueChange: setLocationServices,
        },
        {
          icon: 'shield-checkmark-outline',
          title: 'Confidentialité',
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Paramètres de confidentialité'),
        },
      ],
    },
    {
      title: 'Sécurité',
      items: [
        {
          icon: 'lock-closed-outline',
          title: 'Changer le mot de passe',
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Changement de mot de passe bientôt disponible'),
        },
        {
          icon: 'finger-print-outline',
          title: 'Authentification biométrique',
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Fonction bientôt disponible'),
        },
      ],
    },
    {
      title: 'Données',
      items: [
        {
          icon: 'cloud-download-outline',
          title: 'Télécharger mes données',
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Téléchargement des données en cours...'),
        },
        {
          icon: 'trash-outline',
          title: 'Vider le cache',
          type: 'navigation',
          onPress: () => Alert.alert('Succès', 'Cache vidé avec succès'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    if (item.type === 'switch') {
      return (
        <View key={index} style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>{item.title}</Text>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onValueChange}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={styles.settingItem}
        onPress={item.onPress}
      >
        <View style={styles.settingLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.settingText}>{item.title}</Text>
            {item.value && (
              <Text style={styles.settingValue}>{item.value}</Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) =>
                renderSettingItem(item, itemIndex)
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleDeleteAccount}
        >
          <Ionicons name="warning-outline" size={24} color={COLORS.accent} />
          <Text style={styles.dangerButtonText}>Supprimer mon compte</Text>
        </TouchableOpacity>
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
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    marginLeft: SIZES.padding,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: COLORS.white,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    marginTop: 24,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    gap: 12,
    ...SHADOWS.small,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  version: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 14,
    marginTop: 24,
    marginBottom: 40,
  },
});

export default SettingsScreen;
