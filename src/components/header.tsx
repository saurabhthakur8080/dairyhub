
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { User as UserIcon, Settings, ChevronRight, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export function Header() {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <header className="mb-8">
                <Card className="bg-gradient-to-br from-green-100 via-white to-blue-100 p-1 rounded-2xl shadow-md transition-all">
                    <CardContent className="p-4 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </CardContent>
                </Card>
            </header>
        );
    }

    return (
        <>
            <header className="mb-8">
                <Card className="bg-gradient-to-br from-green-100 via-white to-blue-100 p-1 rounded-2xl shadow-md transition-all">
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div className="flex items-center gap-4 group w-full">
                            <Avatar className="w-12 h-12 border-2 border-primary/20">
                                <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                                <AvatarFallback><UserIcon /></AvatarFallback>
                            </Avatar>
                            
                            <div>
                                <h1 className="font-headline text-xl sm:text-2xl font-bold text-gray-800">
                                    Welcome, {user?.displayName || 'Guest'}! 👋
                                </h1>
                                <p className="text-sm text-gray-500">Your digital dairy guide</p>
                            </div>
                        </div>
                         
                        {user ? (
                             <Link href="/profile">
                                <Button variant="ghost" className="shrink-0">
                                    View Profile
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        ) : (
                             <Link href="/login">
                                <Button variant="ghost" className="shrink-0">
                                    Login / Sign Up
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </header>
        </>
    );
}
