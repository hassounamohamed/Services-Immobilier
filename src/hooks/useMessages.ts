import { useState, useEffect } from 'react';
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  markMessageAsRead 
} from '../services/firebase.service';
import { Message, Conversation } from '../types';

export const useConversations = (userId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations(userId);
      setConversations(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des conversations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadConversations();
  };

  return { conversations, loading, error, refresh };
};

export const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      // Setup real-time listener
      const unsubscribe = setupRealtimeMessages();
      return () => unsubscribe && unsubscribe();
    }
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages(conversationId);
      setMessages(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeMessages = () => {
    // Real-time listener would be implemented here
    // For now, we'll use polling
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  };

  const send = async (text: string, senderId: string, receiverId: string) => {
    try {
      await sendMessage({
        conversationId,
        text,
        senderId,
        receiverId,
        read: false,
      });
      await loadMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await markMessageAsRead(conversationId, messageId);
      await loadMessages();
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  return { messages, loading, error, send, markAsRead, refresh: loadMessages };
};
