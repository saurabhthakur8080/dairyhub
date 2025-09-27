'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-lg text-center shadow-lg">
            <CardHeader>
                <div className="mx-auto bg-red-100 p-3 rounded-full w-fit">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="mt-4 text-2xl font-bold">कुछ गड़बड़ हो गई!</CardTitle>
                <CardDescription>
                    हमें एक अनपेक्षित त्रुटि का सामना करना पड़ा।
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-muted p-3 rounded-md text-left text-xs text-muted-foreground">
                    <p><strong>Error:</strong> {error.message}</p>
                </div>
                <Button onClick={() => reset()} className="w-full">
                    फिर से ट्राई करें
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}