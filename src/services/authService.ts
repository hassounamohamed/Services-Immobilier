import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { getFirebase } from './firebase';

export type AppUser = { id: string; email: string; name?: string; avatarUrl?: string };

function mapUser(u: FirebaseUser | null): AppUser | null {
  if (!u) return null;
  return { id: u.uid, email: u.email ?? '', name: u.displayName ?? undefined, avatarUrl: u.photoURL ?? undefined };
}

export async function login(email: string, password: string): Promise<AppUser> {
  const { auth } = getFirebase();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return mapUser(cred.user)!;
}

export async function register(email: string, password: string, name?: string): Promise<AppUser> {
  const { auth } = getFirebase();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(cred.user, { displayName: name });
  }
  return mapUser(cred.user)!;
}

export async function logout(): Promise<void> {
  const { auth } = getFirebase();
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  const { auth } = getFirebase();
  await sendPasswordResetEmail(auth, email);
}

export function onAuthChanged(callback: (user: AppUser | null) => void) {
  const { auth } = getFirebase();
  return onAuthStateChanged(auth, (u) => callback(mapUser(u)));
}
