import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID (CRITICAL: The app will break without this line)
let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
} catch {
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}
export const db = firestoreInstance;

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Operation Types for Hardened Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot (CRITICAL CONSTRAINT from Firebase Skill)
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified.');
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : String(error);
    const code = error?.code || '';
    if (
      msg.includes('the client is offline') ||
      msg.includes('unavailable') ||
      code === 'unavailable' ||
      msg.includes('Could not reach Cloud Firestore')
    ) {
      console.warn('Firestore running in offline/standby mode: backend will connect as network permits.');
    } else {
      console.warn('Firestore initial check notice:', msg);
    }
  }
}

// Firebase Email & Password Authentication Helper
export async function loginWithEmailFirebase(email: string, password: string): Promise<FirebaseUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// Firebase Password Reset Helper
export async function sendFirebasePasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// Google Authentication Helper
export async function loginWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Firebase Google sign-in failed:', err);
    throw err;
  }
}

export async function logoutFirebase(): Promise<void> {
  await fbSignOut(auth);
}

// Call connection check
testFirestoreConnection();
