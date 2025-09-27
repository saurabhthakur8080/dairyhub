"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInAnonymously,
    updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// YEH PATH ALIAS AB HAMESHA KAAM KAREGA
import app from '@/lib/firebase'; 
import { useSubscription } from '@/context/subscription-context';

// Firebase services ko initialize karein
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Aapke Custom Types
export type Department = 'process-access' | 'production-access' | 'quality-access' | 'all-control-access' | 'guest';

export interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    gender?: 'male' | 'female' | 'other';
    department?: Department;
    isAnonymous: boolean;
}

// Auth Context ka Type
interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string, gender: 'male' | 'female' | 'other', department: Department) => Promise<void>;
  logout: () => Promise<void>;
  anonymousLogin: () => Promise<void>;
  updateUserProfile: (profileData: Partial<AppUser>) => Promise<void>;
  updateUserPhoto: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Main AuthProvider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadSubscription, clearSubscription } = useSubscription();

  // YEH FUNCTION FIREBASE SE LIVE USER KA STATUS CHECK KARTA HAI
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User logged in hai, ab uski extra details Firestore database se laayein
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          // Firestore mein user data mil gaya
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isAnonymous: firebaseUser.isAnonymous,
            department: userData.department || 'guest',
            gender: userData.gender || 'other',
          });
        } else if (firebaseUser.isAnonymous) {
          // User guest hai aur firestore me data nahi hai
           setUser({
              uid: firebaseUser.uid,
              email: null,
              displayName: 'Guest',
              photoURL: null,
              isAnonymous: true,
              department: 'guest',
              gender: 'other',
           });
        } else {
            // User authenticated hai (guest nahi hai), lekin firestore doc abhi tak nahi bana hai (signup case).
            // Firebase Auth object se hi basic user bana dein.
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                isAnonymous: false,
                department: 'guest', // Default value, will be updated shortly after signup
                gender: 'other', // Default value
            });
        }
        await loadSubscription(firebaseUser.uid);

      } else {
        // User logged out hai
        setUser(null);
        clearSubscription();
      }
      setLoading(false);
    });
    // Cleanup function
    return () => unsubscribe();
  }, [loadSubscription, clearSubscription]);

  // YEH SACH MEIN FIREBASE MEIN LOGIN KARTA HAI
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  
  // YEH SACH MEIN FIREBASE MEIN NAYA ACCOUNT BANATA HAI
  const signup = async (email: string, password: string, displayName: string, gender: 'male' | 'female' | 'other', department: Department) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    // Firebase Auth profile update karein
    await updateProfile(firebaseUser, { displayName });
    // Firestore database mein user ki extra details save karein
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userDocRef, { uid: firebaseUser.uid, displayName, email, gender, department, createdAt: new Date() });
  };

  const logout = async () => {
    await signOut(auth);
  };
  
  const anonymousLogin = async () => {
    await signInAnonymously(auth);
  }

  const updateUserProfile = async (profileData: Partial<AppUser>) => {
    if (!auth.currentUser) throw new Error("User not logged in");
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userDocRef, profileData);

    if (profileData.displayName || profileData.photoURL) {
        await updateProfile(auth.currentUser, { 
            displayName: profileData.displayName, 
            photoURL: profileData.photoURL 
        });
    }
    // Update local user state
    setUser(prevUser => prevUser ? { ...prevUser, ...profileData } : null);
  };

  const updateUserPhoto = async (file: File): Promise<string> => {
      if (!auth.currentUser) throw new Error("User not logged in");
      const filePath = `profile-photos/${auth.currentUser.uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await updateUserProfile({ photoURL: photoURL });
      return photoURL;
  };
  
  const value = { user, loading, login, signup, logout, anonymousLogin, updateUserProfile, updateUserPhoto };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
