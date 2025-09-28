"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SplashScreen } from '@/components/splash-screen';

const App = dynamic(() => import('@/app/App'), { ssr: false });

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);

  // This effect will run only on the client.
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Duration of the splash screen

    return () => clearTimeout(timer);
  }, []);
  
  if (showSplash) {
    // While the splash screen is showing, we don't render the main app.
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  // Once the splash screen is done, render the main app.
  return <App />;
}
