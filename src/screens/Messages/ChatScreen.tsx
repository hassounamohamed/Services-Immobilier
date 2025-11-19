import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { Message } from '../../types';
import { COLORS, SIZES } from '../../constants/theme';

const ChatScreen = ({ route, navigation }: any) => {
  const { conversationId, recipientId, propertyTitle } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    if (!conversationId || !user) return;

    const messageText = inputText.trim();
    setInputText('');

    try {
      await addDoc(collection(db, 'messages'), {
        conversationId: conversationId,
        senderId: user.id,
        receiverId: recipientId || '',
        text: messageText,
        timestamp: serverTimestamp(),
        read: false,
      });

      const { updateConversation, createNotification } = require('../../services/firebase.service');
      await updateConversation(conversationId, messageText, user.id, recipientId);

      await createNotification(
        recipientId,
        'Nouveau message',
        `${user.displayName || 'Un utilisateur'} vous a envoyé un message à propos de: ${propertyTitle || 'une propriété'}`,
        'message',
        conversationId
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setInputText(messageText);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.id;

    return (
      <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.theirMessage]}>
        <View style={[styles.messageBubble, isMyMessage ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMyMessage ? styles.myText : styles.theirText]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {item.timestamp ? (() => {
            const date = (item.timestamp as any).toDate ? (item.timestamp as any).toDate() : new Date(item.timestamp);
            return date.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            });
          })() : ''}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{propertyTitle || 'Chat'}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          placeholderTextColor={COLORS.textLight}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  messagesList: {
    padding: SIZES.padding,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  myText: {
    color: COLORS.white,
  },
  theirText: {
    color: COLORS.text,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
