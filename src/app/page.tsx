"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SplashScreen } from '@/components/splash-screen';
import { Loader2 } from 'lucide-react';

const App = dynamic(() => import('@/app/App'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

export default function Page() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  return <App />;
}
