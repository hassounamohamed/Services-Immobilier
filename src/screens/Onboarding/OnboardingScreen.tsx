import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Images de maisons et appartements
const homeImages = [
  // Maisons
  'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg',
  'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
  'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
  'https://cdn.pixabay.com/photo/2016/11/29/09/08/architecture-1867187_1280.jpg',
  'https://cdn.pixabay.com/photo/2017/03/28/12/13/home-2187170_1280.jpg',
  'https://cdn.pixabay.com/photo/2016/11/18/13/47/house-1836070_1280.jpg',
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994',

  // Appartements
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
  'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg',
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
  'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg',
  'https://cdn.pixabay.com/photo/2016/11/29/09/08/architecture-1867187_1280.jpg',
  'https://cdn.pixabay.com/photo/2017/03/28/12/13/home-2187170_1280.jpg',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511',

  // Bonus
  'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511'
];


interface FloatingHomeProps {
  image: string;
  delay: number;
  left: number;
  top: number;
  scale: number;
}

const FloatingHome: React.FC<FloatingHomeProps> = ({ image, delay, left, top, scale }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: delay * 1000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 15000 + Math.random() * 10000,
          delay: delay * 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -50, -100, -50, 0],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 30, -20, 35, 0],
  });

  const rotate = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '8deg', '-5deg', '6deg', '0deg'],
  });

  const scaleAnim = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  return (
    <Animated.View
      style={[
        styles.floatingHome,
        {
          left: `${left}%`,
          top: `${top}%`,
          opacity: fadeAnim,
          transform: [
            { translateY },
            { translateX },
            { rotate },
            { scale: Animated.multiply(scale, scaleAnim) },
          ],
        },
      ]}
    >
      <Image
        source={{ uri: image }}
        style={styles.homeImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.1)']}
        style={styles.imageOverlay}
      />
    </Animated.View>
  );
};

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onGetStarted }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(50)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;

  const floatingHomes = React.useMemo(() => {
    const homes = [];
    const positions = [
      { left: 5, top: 5 },
      { left: 75, top: 8 },
      { left: 15, top: 18 },
      { left: 65, top: 22 },
      { left: 10, top: 38 },
      { left: 70, top: 42 },
      { left: 8, top: 65 },
      { left: 72, top: 68 },
      { left: 12, top: 82 },
      { left: 68, top: 85 },
    ];

    for (let i = 0; i < 10; i++) {
      homes.push({
        id: i,
        image: homeImages[i % homeImages.length],
        left: positions[i].left,
        top: positions[i].top,
        delay: i * 0.2,
        scale: 0.8 + Math.random() * 0.3,
      });
    }
    return homes;
  }, []);

  useEffect(() => {
    // Animation du logo
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de la carte
    Animated.parallel([
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation du bouton
    Animated.spring(buttonScale, {
      toValue: 1,
      tension: 50,
      friction: 5,
      delay: 600,
      useNativeDriver: true,
    }).start();

    // Animation pulsante du logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation des features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: 'shield-checkmark', text: 'Annonces Vérifiées', color: '#2563EB' },
    { icon: 'calendar', text: 'Réservation Facile', color: '#9333EA' },
    { icon: 'pricetag', text: 'Meilleurs Prix', color: '#EC4899' },
  ];

  const rotate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#667EEA', '#764BA2', '#F093FB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Floating homes background */}
        {floatingHomes.map((home) => (
          <FloatingHome
            key={home.id}
            image={home.image}
            delay={home.delay}
            left={home.left}
            top={home.top}
            scale={home.scale}
          />
        ))}

        {/* Overlay gradient animé */}
        <LinearGradient
          colors={[
            'rgba(102, 126, 234, 0.6)',
            'rgba(118, 75, 162, 0.5)',
            'rgba(240, 147, 251, 0.4)',
          ]}
          style={styles.overlay}
        />

        {/* Main content */}
        <View style={styles.content}>
          {/* Logo animé */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <View style={styles.logoWrapper}>
              <Animated.View
                style={[
                  styles.logoBackground,
                  { transform: [{ rotate }] },
                ]}
              />
              <LinearGradient
                colors={['#FFFFFF', '#F0F9FF']}
                style={styles.logoCircle}
              >
                <Ionicons name="home" size={68} color="#667EEA" />
              </LinearGradient>
            </View>
            <LinearGradient
              colors={['#FFFFFF', '#F0F9FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.appNameGradient}
            >
              <Text style={styles.appName}>HomeNest</Text>
            </LinearGradient>
          </Animated.View>

          {/* Welcome card animée */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: cardOpacity,
                transform: [{ translateY: cardTranslateY }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.98)', 'rgba(255, 255, 255, 0.95)']}
              style={styles.cardGradient}
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Bienvenue ! 🏡</Text>
                <View style={styles.titleUnderline} />
              </View>
              <Text style={styles.description}>
                Découvrez votre espace de location parfait parmi des milliers de belles maisons et
                appartements. La maison de vos rêves est à portée de main.
              </Text>
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={onGetStarted}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#667EEA', '#764BA2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>Commencer</Text>
                    <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </LinearGradient>
          </Animated.View>

          {/* Feature highlights animées */}
          <View style={styles.features}>
            {features.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.feature,
                  currentFeature === index && styles.featureActive,
                ]}
              >
                <LinearGradient
                  colors={[feature.color, feature.color + 'CC']}
                  style={styles.featureIcon}
                >
                  <Ionicons name={feature.icon as any} size={16} color="#FFFFFF" />
                </LinearGradient>
                <Text
                  style={[
                    styles.featureText,
                    currentFeature === index && styles.featureTextActive,
                  ]}
                >
                  {feature.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  floatingHome: {
    position: 'absolute',
    width: 160,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  homeImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBackground: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    opacity: 0.2,
    transform: [{ scale: 1.3 }],
  },
  logoCircle: {
    borderRadius: 40,
    padding: 28,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  appNameGradient: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#667EEA',
    letterSpacing: 1,
  },
  card: {
    borderRadius: 32,
    overflow: 'hidden',
    width: width - 48,
    maxWidth: 500,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 20,
  },
  cardGradient: {
    padding: 36,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 32,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#667EEA',
    borderRadius: 2,
    marginTop: 12,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 26,
    marginBottom: 28,
    textAlign: 'center',
    fontWeight: '400',
  },
  button: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 36,
    gap: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  featureActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    transform: [{ scale: 1.05 }],
    borderColor: 'rgba(102, 126, 234, 0.4)',
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  featureTextActive: {
    color: '#667EEA',
    fontWeight: '700',
  },
});

export default OnboardingScreen;