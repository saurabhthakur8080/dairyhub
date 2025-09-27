
'use client';

import { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp, Firestore, getFirestore } from 'firebase/firestore';
import { initFirebaseClient } from '@/lib/firebaseClient';
import { add } from 'date-fns';

export type SubscriptionPlan = '7-days' | '1-month' | '6-months' | 'yearly' | 'lifetime' | '7-days-ultimate' | '1-month-ultimate' | '6-months-ultimate' | 'yearly-ultimate' | 'lifetime-ultimate';

interface SubscriptionContextType {
  plan: SubscriptionPlan | null;
  expiryDate: Date | null;
  subscribe: (newPlan: SubscriptionPlan, userId: string, paymentId: string) => Promise<void>;
  isPro: boolean;
  loadSubscription: (userId: string) => Promise<void>;
  clearSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);

  useEffect(() => {
    const app = initFirebaseClient();
    if (app) {
      setDb(getFirestore(app));
    }
  }, []);

  const loadSubscription = useCallback(async (userId: string) => {
    if (!userId || !db) {
        setPlan(null);
        setExpiryDate(null);
        return;
    }
    const subDocRef = doc(db, "users", userId, "subscription", "current");
    try {
        const subDocSnap = await getDoc(subDocRef);
        if (subDocSnap.exists()) {
            const data = subDocSnap.data();
            setPlan(data.plan);
            setExpiryDate(data.expiryDate ? data.expiryDate.toDate() : null);
        } else {
            setPlan(null);
            setExpiryDate(null);
        }
    } catch (error) {
        console.error("Failed to load subscription:", error);
        setPlan(null);
        setExpiryDate(null);
    }
  }, [db]);

  const clearSubscription = () => {
    setPlan(null);
    setExpiryDate(null);
  };

  const subscribe = async (newPlan: SubscriptionPlan, userId: string, paymentId: string) => {
    if (!db) {
      console.error("Firestore is not initialized.");
      return;
    }
    const now = new Date();
    let newExpiryDate: Date | null = null;
    
    let duration: { [key: string]: number } | undefined;

    if (newPlan.includes('7-days')) duration = { days: 7 };
    else if (newPlan.includes('1-month')) duration = { months: 1 };
    else if (newPlan.includes('6-months')) duration = { months: 6 };
    else if (newPlan.includes('yearly')) duration = { years: 1 };
    else if (newPlan.includes('lifetime')) duration = undefined;

    if (duration) {
        newExpiryDate = add(now, duration);
    }

    const subDocRef = doc(db, "users", userId, "subscription", "current");
    await setDoc(subDocRef, {
        plan: newPlan,
        startDate: serverTimestamp(),
        expiryDate: newExpiryDate,
        status: 'active',
        paymentId: paymentId
    });

    setPlan(newPlan);
    setExpiryDate(newExpiryDate);
  };
  
  const isPro = !!plan && (expiryDate === null || expiryDate > new Date());


  return (
    <SubscriptionContext.Provider value={{ plan, expiryDate, subscribe, isPro, loadSubscription, clearSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
