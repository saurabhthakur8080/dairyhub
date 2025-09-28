"use client";

import { Header } from "@/components/header";
import { TopicGrid } from "@/components/topic-grid";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DailyTip } from "@/components/daily-tip";

export default function App() {

  return (
    <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background to-blue-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <Header />
                <main>
                    <DailyTip />
                    <div className="text-center my-8">
                        <h2 className="font-headline text-3xl font-bold text-gray-800">
                        Dairy Information & Calculations
                        </h2>
                        <p className="font-headline text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        By Saurabh Rajput
                        </p>
                    </div>
                    <TopicGrid />
                </main>
            </div>
        </div>
    </ProtectedRoute>
  );
}
