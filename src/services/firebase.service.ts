import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../config/firebase';
import { Property, Message, Conversation } from '../types';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from './cloudinary.service';

// Auth Services
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// User Profile Services
export const updateUserProfile = async (
  userId: string,
  updates: {
    displayName?: string;
    photoURL?: string;
    phoneNumber?: string;
    bio?: string;
  }
): Promise<void> => {
  try {
    // Update Firestore user document
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });

    // Update Firebase Auth profile if displayName or photoURL changed
    if (auth.currentUser && (updates.displayName || updates.photoURL)) {
      const authUpdates: any = {};
      if (updates.displayName) authUpdates.displayName = updates.displayName;
      if (updates.photoURL) authUpdates.photoURL = updates.photoURL;
      await updateProfile(auth.currentUser, authUpdates);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Property Services
export const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'properties'), {
      ...property,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
};

export const updateProperty = async (propertyId: string, updates: Partial<Property>) => {
  try {
    const propertyRef = doc(db, 'properties', propertyId);
    await updateDoc(propertyRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

export const deleteProperty = async (propertyId: string) => {
  try {
    await deleteDoc(doc(db, 'properties', propertyId));
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

export const getProperty = async (propertyId: string): Promise<Property | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'properties', propertyId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Property;
    }
    return null;
  } catch (error) {
    console.error('Error getting property:', error);
    throw error;
  }
};

export const getProperties = async (filters?: {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
}): Promise<Property[]> => {
  try {
    let q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));

    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.city) {
      q = query(q, where('location.city', '==', filters.city));
    }

    const querySnapshot = await getDocs(q);
    const properties: Property[] = [];
    
    querySnapshot.forEach((doc) => {
      const property = { id: doc.id, ...doc.data() } as Property;
      
      // Client-side filtering for price range
      if (filters?.minPrice && property.price < filters.minPrice) return;
      if (filters?.maxPrice && property.price > filters.maxPrice) return;
      
      properties.push(property);
    });

    return properties;
  } catch (error) {
    console.error('Error getting properties:', error);
    throw error;
  }
};

export const getUserProperties = async (userId: string): Promise<Property[]> => {
  try {
    const q = query(
      collection(db, 'properties'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
  } catch (error) {
    console.error('Error getting user properties:', error);
    throw error;
  }
};

// Favorites Services
export const addToFavorites = async (userId: string, propertyId: string) => {
  try {
    await addDoc(collection(db, 'favorites'), {
      userId,
      propertyId,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, propertyId: string) => {
  try {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('propertyId', '==', propertyId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'favorites', document.id));
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getFavorites = async (userId: string): Promise<string[]> => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().propertyId);
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

// Image Upload Service - Using Cloudinary
export const uploadImage = async (uri: string, folder: string = 'properties', userId?: string): Promise<string> => {
  try {
    if (!userId && auth.currentUser) {
      userId = auth.currentUser.uid;
    }
    
    if (!userId) {
      throw new Error('User must be authenticated to upload images');
    }

    // Use Cloudinary for image upload
    const folderPath = `${folder}/${userId}`;
    return await uploadImageToCloudinary(uri, folderPath);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (imageUrl: string) => {
  try {
    // Use Cloudinary for image deletion
    await deleteImageFromCloudinary(imageUrl);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Message Services
export const sendMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
  try {
    if (!message.conversationId) {
      throw new Error('conversationId is required');
    }
    
    const docRef = await addDoc(collection(db, 'messages'), {
      ...message,
      conversationId: message.conversationId,
      senderId: message.senderId || '',
      receiverId: message.receiverId || '',
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessages = async (chatId: string): Promise<Message[]> => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

export const getUserChats = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user chats:', error);
    throw error;
  }
};

// Conversation Services
export const getConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
};

export const findOrCreateConversation = async (
  currentUserId: string,
  otherUserId: string,
  propertyId: string,
  propertyTitle: string,
  propertyImage?: string
): Promise<string> => {
  try {
    // Check if conversation already exists
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUserId),
      where('propertyId', '==', propertyId)
    );
    const querySnapshot = await getDocs(q);
    
    // Filter to find exact match with both participants
    const existingConversation = querySnapshot.docs.find(doc => {
      const data = doc.data();
      return data.participants.includes(otherUserId);
    });

    if (existingConversation) {
      return existingConversation.id;
    }

    // Create new conversation
    const docRef = await addDoc(collection(db, 'conversations'), {
      participants: [currentUserId, otherUserId],
      propertyId,
      propertyTitle,
      propertyImage: propertyImage || '',
      lastMessage: '',
      lastMessageTime: Timestamp.now(),
      createdAt: Timestamp.now(),
      unreadCount: {
        [currentUserId]: 0,
        [otherUserId]: 0,
      },
    });

    return docRef.id;
  } catch (error) {
    console.error('Error finding or creating conversation:', error);
    throw error;
  }
};

export const updateConversation = async (
  conversationId: string,
  lastMessage: string,
  senderId: string,
  receiverId: string
) => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessage,
      lastMessageTime: Timestamp.now(),
      [`unreadCount.${receiverId}`]: increment(1),
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    throw error;
  }
};

export const markConversationAsRead = async (conversationId: string, userId: string) => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      [`unreadCount.${userId}`]: 0,
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    throw error;
  }
};

export const markMessageAsRead = async (conversationId: string, messageId: string) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, {
      read: true,
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

// Notification Services
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'message' | 'favorite' | 'property',
  relatedId?: string
) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      type,
      relatedId: relatedId || '',
      read: false,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getNotifications = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return 0;
  }
};
