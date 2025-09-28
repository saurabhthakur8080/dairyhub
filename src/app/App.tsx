"use client";

import { Header } from '@/components/header';
import { DailyTip } from '@/components/daily-tip';
import { TopicGrid } from '@/components/topic-grid';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function App() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-background to-blue-50">
                <main className="container mx-auto px-4 py-8">
                    <Header />
                    <DailyTip />
                    <TopicGrid />
                </main>
            </div>
        </ProtectedRoute>
    );
}
