import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const HelpScreen = ({ navigation }: any) => {
  const faqItems = [
    {
      question: 'Comment publier une annonce ?',
      answer: 'Appuyez sur l\'icône "+" dans la barre de navigation, remplissez le formulaire avec les détails de votre propriété, ajoutez des photos et publiez.',
    },
    {
      question: 'Comment contacter un vendeur ?',
      answer: 'Sur la page de détails d\'une propriété, appuyez sur "Contacter" pour envoyer un message au propriétaire.',
    },
    {
      question: 'Comment modifier mon profil ?',
      answer: 'Allez dans l\'onglet "Profil", puis appuyez sur "Modifier le profil" pour mettre à jour vos informations.',
    },
    {
      question: 'Comment signaler une annonce ?',
      answer: 'Sur la page de détails, appuyez sur les trois points en haut à droite et sélectionnez "Signaler".',
    },
    {
      question: 'Comment supprimer mon compte ?',
      answer: 'Allez dans Paramètres > Supprimer mon compte. Attention, cette action est irréversible.',
    },
  ];

  const contactOptions = [
    {
      icon: 'mail',
      title: 'Email',
      subtitle: 'support@immobilier.ma',
      onPress: () => Linking.openURL('mailto:support@immobilier.ma'),
    },
    {
      icon: 'call',
      title: 'Téléphone',
      subtitle: '+212 5XX XXX XXX',
      onPress: () => Linking.openURL('tel:+212500000000'),
    },
    {
      icon: 'logo-whatsapp',
      title: 'WhatsApp',
      subtitle: 'Chat en direct',
      onPress: () => Linking.openURL('https://wa.me/212500000000'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          <View style={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <View style={styles.questionContainer}>
                  <Ionicons name="help-circle" size={24} color={COLORS.primary} />
                  <Text style={styles.question}>{item.question}</Text>
                </View>
                <Text style={styles.answer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contactez-nous</Text>
          <View style={styles.contactContainer}>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactOption}
                onPress={option.onPress}
              >
                <View style={styles.contactLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={option.icon as any} size={24} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.contactTitle}>{option.title}</Text>
                    <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={32} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Notre équipe est disponible du lundi au vendredi de 9h à 18h pour répondre à toutes vos questions.
          </Text>
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
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SIZES.padding,
    marginBottom: 12,
  },
  faqContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  faqItem: {
    marginBottom: 20,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  answer: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginLeft: 36,
  },
  contactContainer: {
    backgroundColor: COLORS.white,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  contactSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary + '10',
    margin: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default HelpScreen;
