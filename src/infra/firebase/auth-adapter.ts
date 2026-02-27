import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { AuthPort, AuthUser, UserRole } from '../../ports/auth-port';

function mapUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? undefined,
    photoURL: user.photoURL ?? undefined,
  };
}

export class FirebaseAuthAdapter implements AuthPort {
  async getCurrentUser(): Promise<AuthUser | null> {
    const user = auth.currentUser;
    return user ? mapUser(user) : null;
  }

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return mapUser(result.user);
  }

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<AuthUser> {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return mapUser(result.user);
  }

  async signInWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return mapUser(result.user);
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (user) => {
      callback(user ? mapUser(user) : null);
    });
  }

  async getUserRole(uid: string): Promise<UserRole | null> {
    const docRef = doc(db, 'userRoles', uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data().role as UserRole;
  }

  async setUserRole(uid: string, role: UserRole): Promise<void> {
    await setDoc(doc(db, 'userRoles', uid), { role, updatedAt: new Date() });
  }
}
