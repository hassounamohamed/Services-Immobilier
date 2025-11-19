import { useState, useEffect } from 'react';
import { 
  getNotifications, 
  markNotificationAsRead,
  getUnreadNotificationCount 
} from '../services/firebase.service';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'message' | 'favorite' | 'property';
  relatedId: string;
  read: boolean;
  createdAt: Date;
}

export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Real-time listener for notifications
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const notificationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Notification[];
        
        setNotifications(notificationsData);
        setUnreadCount(notificationsData.filter(n => !n.read).length);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error loading notifications:', error);
        setError('Erreur lors du chargement des notifications');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => markNotificationAsRead(n.id))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  return { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead 
  };
};
