
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updateProfile as firebaseUpdateProfile,
    signInAnonymously
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSubscription } from './subscription-context';
import { initFirebaseClient } from '@/lib/firebaseClient';

export type Department = 'process-access' | 'production-access' | 'quality-access' | 'all-control-access' | 'guest';

interface AppUser {
    uid: string;
    email: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    gender?: 'male' | 'female' | 'other';
    department?: Department;
    isAnonymous: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, displayName: string, gender: 'male' | 'female' | 'other', department: Department) => Promise<any>;
  logout: () => Promise<void>;
  anonymousLogin: () => Promise<any>;
  updateUserProfile: (profileData: { displayName?: string; department?: Department }) => Promise<void>;
  updateUserPhoto: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadSubscription, clearSubscription } = useSubscription();
  const app = initFirebaseClient();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                 setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    isAnonymous: firebaseUser.isAnonymous,
                    gender: userData.gender,
                    department: userData.department,
                });
            } else if (firebaseUser.isAnonymous) {
                 setUser({
                    uid: firebaseUser.uid,
                    email: null,
                    displayName: 'Guest',
                    photoURL: `https://placehold.co/128x128/E0E0E0/333?text=G`,
                    isAnonymous: true,
                    department: 'guest',
                });
            } else {
                 setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    isAnonymous: false,
                });
            }
            loadSubscription(firebaseUser.uid);
        } else {
            setUser(null);
            clearSubscription();
        }
        setLoading(false);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, db]);

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  const anonymousLogin = () => {
    return signInAnonymously(auth);
  }

  const signup = async (email: string, password: string, displayName: string, gender: 'male' | 'female' | 'other', department: Department) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    await firebaseUpdateProfile(firebaseUser, { 
        displayName,
        photoURL: `https://placehold.co/128x128/E0E0E0/333?text=${displayName.charAt(0).toUpperCase()}`
    });

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName,
        gender: gender,
        department: department,
    });
    
    return userCredential;
};

const logout = () => {
    return signOut(auth);
};

const updateUserProfile = async (profileData: { displayName?: string; department?: Department }) => {
   if (auth.currentUser) {
       if (profileData.displayName) {
           await firebaseUpdateProfile(auth.currentUser, { displayName: profileData.displayName });
       }
       const userDocRef = doc(db, 'users', auth.currentUser.uid);
       await setDoc(userDocRef, profileData, { merge: true });
       // Refresh user state
       const updatedUserDoc = await getDoc(userDocRef);
       if (updatedUserDoc.exists()) {
           const userData = updatedUserDoc.data();
            setUser({
                uid: auth.currentUser.uid,
                email: auth.currentUser.email,
                displayName: auth.currentUser.displayName,
                photoURL: auth.currentUser.photoURL,
                isAnonymous: auth.currentUser.isAnonymous,
                gender: userData.gender,
                department: userData.department,
            });
       }
    }
  };

  const updateUserPhoto = async (file: File) => {
    if (!auth.currentUser) return;
    
    const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);

    await firebaseUpdateProfile(auth.currentUser, { photoURL });
     setUser(prevUser => prevUser ? { ...prevUser, photoURL } : null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    anonymousLogin,
    updateUserProfile,
    updateUserPhoto
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
