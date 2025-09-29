"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { MilkCanIcon } from '@/components/icons';
import { useAuth } from '@/context/auth-context';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { login, anonymousLogin } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // --- DEBUGGING STEP 1: चेक करें कि सही फंक्शन चल रहा है ---
        console.log("--- handleLogin function started ---");
        
        // --- DEBUGGING STEP 2: देखें कि useAuth() से क्या मिल रहा है ---
        console.log("The 'login' function received from context is:", login);

        try {
            const userCredential = await login(email, password);

            // --- DEBUGGING STEP 3: लॉगिन के बाद यूजर की जानकारी देखें ---
            console.log("Login successful, userCredential object:", userCredential);
            console.log("Is the user anonymous? :", userCredential.user.isAnonymous);

            toast({
                title: 'Login Successful!',
                description: "Welcome back!",
            });
            router.push('/');
        } catch (error: any) {
             // --- DEBUGGING: अगर कोई एरर आए तो उसे देखें ---
             console.error("Login failed with error:", error);
             toast({
                variant: "destructive",
                title: 'Login Failed',
                description: error.message || "Please check your credentials or sign up.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGuestLogin = async () => {
        setIsLoading(true);
        // गेस्ट लॉगिन के लिए भी एक लॉग लगा देते हैं ताकि कोई कन्फ्यूजन न हो
        console.log("--- handleGuestLogin function started ---");
        try {
            await anonymousLogin();
            toast({
                title: 'Logged in as Guest!',
                description: "Welcome! Explore the app's features.",
            });
            router.push('/');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: 'Guest Login Failed',
                description: "Could not log in as guest. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    // JSX कोड में कोई बदलाव नहीं है, इसलिए उसे यहाँ से हटा रहा हूँ ताकि फोकस बना रहे
    // ... आपका पूरा JSX कोड यहाँ आएगा ...
    return (
        <div className="bg-gray-50 flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 m-4 border">
                {/* ... The rest of your JSX code is exactly the same ... */}
                 <div className="text-center mb-8">
                    <MilkCanIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome to <span className="text-primary">Dairy Hub</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">Sign in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                     <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-300 rounded-lg focus:ring-primary transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-300 rounded-lg focus:ring-primary transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <Button type="submit"
                                className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 ease-in-out"
                                disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                        </Button>
                    </div>
                </form>

                 <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                 <div>
                    <Button onClick={handleGuestLogin}
                            variant="outline"
                            className="w-full"
                            disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                        Continue as Guest
                    </Button>
                </div>
                
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Don't have an account?
                        <Link href="/signup" className="text-primary hover:underline font-medium ml-1">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}