import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(user?.id || '');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [favoritesEnabled, setFavoritesEnabled] = useState(true);

  const formatTime = (date: any) => {
    if (!date) return '';
    const now = new Date();
    const notificationDate = date.toDate ? date.toDate() : new Date(date);
    const diff = now.getTime() - notificationDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days}j`;
    return notificationDate.toLocaleDateString('fr-FR');
  };

  const getIconName = (type: string) => {
    switch (type) {
      case 'message': return 'chatbubble';
      case 'favorite': return 'heart';
      case 'property': return 'home';
      default: return 'notifications';
    }
  };

  const renderNotification = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => {
        if (!item.read) {
          markAsRead(item.id);
        }
        if (item.type === 'message' && item.relatedId) {
          navigation.navigate('Chat', { conversationId: item.relatedId });
        } else if (item.type === 'property' && item.relatedId) {
          navigation.navigate('PropertyDetails', { id: item.relatedId });
        }
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) }]}>
        <Ionicons name={getIconName(item.type) as any} size={24} color={COLORS.white} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.message}</Text>
        <Text style={styles.notificationTime}>{formatTime(item.createdAt)}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const getIconColor = (type: string) => {
    switch (type) {
      case 'message':
        return COLORS.primary;
      case 'favorite':
        return COLORS.accent;
      case 'property':
        return COLORS.success;
      default:
        return COLORS.textLight;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadCountBadge}>{unreadCount} non lues</Text>
          )}
        </View>
        <TouchableOpacity onPress={markAllAsRead} disabled={unreadCount === 0}>
          <Text style={[styles.markAllRead, unreadCount === 0 && styles.disabledText]}>
            Tout lire
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Paramètres de notification</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color={COLORS.primary} />
            <Text style={styles.settingText}>Notifications push</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="mail" size={24} color={COLORS.primary} />
            <Text style={styles.settingText}>Notifications email</Text>
          </View>
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="chatbubble" size={24} color={COLORS.primary} />
            <Text style={styles.settingText}>Messages</Text>
          </View>
          <Switch
            value={messagesEnabled}
            onValueChange={setMessagesEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="heart" size={24} color={COLORS.primary} />
            <Text style={styles.settingText}>Favoris</Text>
          </View>
          <Switch
            value={favoritesEnabled}
            onValueChange={setFavoritesEnabled}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Récentes</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  markAllRead: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  settingsSection: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
    padding: SIZES.padding,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    marginLeft: SIZES.padding,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  listContainer: {
    paddingHorizontal: SIZES.padding,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 8,
    ...SHADOWS.small,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  unreadCountBadge: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 2,
  },
  disabledText: {
    color: COLORS.textLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 16,
  },
});

export default NotificationsScreen;
