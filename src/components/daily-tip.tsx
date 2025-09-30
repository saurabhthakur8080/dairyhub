"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDailyTip } from "@/app/actions";
import { Lightbulb, Sparkles, X, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DailyTip() {
  const [tip, setTip] = useState("SNF = TS - Fat");
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This ensures the component is only made visible on the client-side, preventing hydration mismatch.
    setIsVisible(true);
  }, []);

  const handleNewTip = () => {
    startTransition(async () => {
      try {
        const newTip = await getDailyTip();
        setTip(newTip);
        if (!isVisible) {
            setIsVisible(true);
        }
      } catch (error) {
        console.error("Failed to fetch new tip:", error);
        setTip("Oops! Koi gadbad ho gayi. Fir se try karein.");
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tip);
    toast({
        title: "Tip Copied!",
        description: "You can now paste the tip anywhere.",
    });
  }
  
  if (!isVisible) {
      // Render a placeholder or nothing on the server and during initial client render
      return (
        <div className="flex justify-center mb-8">
            <Button
              onClick={handleNewTip}
              disabled={isPending}
              className="text-sm shrink-0 bg-gradient-to-r from-primary to-indigo-400 text-primary-foreground hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isPending ? "Soch raha hu..." : "Show Daily Tip"}
            </Button>
        </div>
      );
  }

  return (
    <Card className="mb-8 bg-gradient-to-r from-amber-500 to-orange-600 border-amber-600 relative shadow-lg">
      <div className="absolute top-1 right-1 flex items-center">
         <Button variant="ghost" size="icon" className="w-6 h-6 text-white/70 hover:text-white" onClick={handleCopy} title="Copy Tip">
            <Copy className="w-3 h-3"/>
        </Button>
        <Button variant="ghost" size="icon" className="w-6 h-6 text-white/70 hover:text-white" onClick={() => setIsVisible(false)} title="Hide Tip">
            <X className="w-4 h-4"/>
        </Button>
      </div>
      <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-semibold text-white text-center sm:text-left flex items-center gap-2 pr-16 sm:pr-6">
          <Lightbulb className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="font-bold font-headline">Did You Know?</span>
          <span className="text-sm text-white/90">{isPending ? "Soch raha hu..." : tip}</span>
        </p>
        <Button
          onClick={handleNewTip}
          disabled={isPending}
          variant="outline"
          className="text-sm shrink-0 bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isPending ? "Soch raha hu..." : "Daily Tip"}
        </Button>
      </CardContent>
    </Card>
  );
}
