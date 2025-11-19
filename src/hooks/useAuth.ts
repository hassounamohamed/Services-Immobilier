import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { signIn, signUp, signOut, resetPassword } from '../services/firebase.service';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const userCredential = await signIn(email, password);
      return userCredential;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const userCredential = await signUp(email, password, displayName);
      return userCredential;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    isAuthenticated: !!user,
  };
};
