import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo0plyCME9jog1-zQdST4PHYv75l2P6AQ",
  authDomain: "home-rental-app-de64b.firebaseapp.com",
  projectId: "home-rental-app-de64b",
  storageBucket: "home-rental-app-de64b.firebasestorage.app",
  messagingSenderId: "30533233383",
  appId: "1:30533233383:web:63981d33c533a5750c9042",
  measurementId: "G-V1ZFFHDJF4"
};

// Initialize Firebase App
// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth per platform
let auth: any;
// runtime check for web vs native (avoids importing Platform from react-native)
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

if (isWeb) {
  // Web: use getAuth + browserLocalPersistence
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Auth persistence (web) failed:', err);
  });
  
  // Handle invalid persisted auth state
  auth.onAuthStateChanged((user: any) => {
    if (!user) {
      // Clear any invalid cached data
      if (typeof localStorage !== 'undefined') {
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.startsWith('firebase:')
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
    }
  }, (error: any) => {
    console.warn('Auth state change error:', error);
    // Sign out on error to clear bad state
    auth.signOut().catch(() => {});
  });
} else {
  // React Native: use RN-specific auth persistence adapter
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getReactNativePersistence } = require('firebase/auth');
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}
// Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;