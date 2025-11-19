import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || undefined,
            phoneNumber: firebaseUser.phoneNumber || undefined,
            createdAt: userDoc.data().createdAt?.toDate() || new Date(),
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      displayName,
      createdAt: new Date(),
      photoURL: '',
      phoneNumber: '',
    });
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: auth.currentUser.uid,
          email: auth.currentUser.email!,
          displayName: auth.currentUser.displayName || userData.displayName || '',
          photoURL: auth.currentUser.photoURL || userData.photoURL || undefined,
          phoneNumber: userData.phoneNumber || undefined,
          bio: userData.bio || undefined,
          createdAt: userData.createdAt?.toDate() || new Date(),
        });
      }
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!auth.currentUser) {
      throw new Error('No user logged in');
    }

    // Update Firebase Auth profile
    if (updates.displayName || updates.photoURL) {
      const authUpdates: any = {};
      if (updates.displayName) authUpdates.displayName = updates.displayName;
      if (updates.photoURL) authUpdates.photoURL = updates.photoURL;
      await updateProfile(auth.currentUser, authUpdates);
    }

    // Update Firestore user document
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    }, { merge: true });

    // Refresh user data
    await refreshUser();
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logout,
    updateUserProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
