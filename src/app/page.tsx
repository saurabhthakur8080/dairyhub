"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SplashScreen } from '@/components/splash-screen';

const App = dynamic(() => import('@/app/App'), { ssr: false });

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial server render
    const timer = setTimeout(() => {
        setIsClient(true);
    }, 3000); // Duration of the splash screen
    
    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);
  
  // On the server and initial client render, show the splash screen
  if (!isClient) {
    return <SplashScreen onFinished={() => setIsClient(true)} />;
  }

  // Once the client has mounted and the timer is up, render the main App
  return <App />;
}
