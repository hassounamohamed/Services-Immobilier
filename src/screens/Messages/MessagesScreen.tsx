import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { Conversation } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { markConversationAsRead } from '../../services/firebase.service';

const MessagesScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.id),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const conversationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Conversation[];
      setConversations(conversationsData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading conversations:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const formatTime = (date: any) => {
    if (!date) return '';
    
    // Convert Firestore Timestamp to Date
    const messageDate = date.toDate ? date.toDate() : new Date(date);
    if (!messageDate || isNaN(messageDate.getTime())) return '';
    
    const now = new Date();
    const diff = now.getTime() - messageDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return `${days}j`;
    } else {
      return messageDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const unreadCount = (item as any).unreadCount?.[user?.id || ''] || 0;
    const hasUnread = unreadCount > 0;

    return (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={async () => {
          if (hasUnread && user) {
            await markConversationAsRead(item.id, user.id);
          }
          const otherParticipantId = item.participants.find(id => id !== user?.id);
          navigation.navigate('Chat', { 
            conversationId: item.id,
            recipientId: otherParticipantId,
            propertyTitle: item.propertyTitle
          });
        }}
      >
        <Image
          source={{ uri: (item as any).propertyImage || 'https://ui-avatars.com/api/?name=Property&size=120' }}
          style={styles.avatar}
        />
        {hasUnread && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
          </View>
        )}
        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.propertyTitle, hasUnread && styles.unreadTitle]} numberOfLines={1}>
              {item.propertyTitle || 'Conversation'}
            </Text>
            <Text style={styles.time}>
              {formatTime(item.lastMessageTime)}
            </Text>
          </View>
          <Text style={[styles.lastMessage, hasUnread && styles.unreadMessage]} numberOfLines={1}>
            {item.lastMessage || 'Commencer la conversation'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={80} color={COLORS.textLight} />
          <Text style={styles.emptyTitle}>Aucun message</Text>
          <Text style={styles.emptyText}>
            Commencez une conversation avec un propriétaire
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
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
    paddingHorizontal: SIZES.padding,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  conversationCard: {
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  propertyTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  time: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  unreadTitle: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  unreadMessage: {
    fontWeight: '600',
    color: COLORS.text,
  },
  unreadBadge: {
    position: 'absolute',
    top: 16,
    left: 44,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  unreadText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default MessagesScreen;
