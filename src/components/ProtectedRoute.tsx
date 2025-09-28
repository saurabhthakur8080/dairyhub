"use client";

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// Yeh component ek "gatekeeper" ki tarah kaam karega
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jab loading poori ho jaaye aur user logged in NA ho, tab login page par bhejo
    if (!loading && !user) {
      router.push('/login'); // Yahan apne login page ka sahi URL daalein
    }
  }, [user, loading, router]);

  // Jab tak Firebase check kar raha hai, tab tak loading indicator dikhao
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Agar user logged in hai, to page ka content (children) dikhao
  return <>{children}</>;
}
