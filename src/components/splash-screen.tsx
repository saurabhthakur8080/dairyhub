"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen({ onFinished }: { onFinished: () => void }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 6000); // 6 seconds

    return () => clearTimeout(timer);
  }, [onFinished, router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <video
        src="https://firebasestorage.googleapis.com/v0/b/dhenuguide.firebasestorage.app/o/0f78-5ba2-4b80-8b36-a4f989cc5bd3.mp4?alt=media&token=6fd6825c-c769-4367-a0c4-9c948da32638"
        autoPlay
        muted
        playsInline
        className="object-cover w-full h-full"
        onContextMenu={(e) => e.preventDefault()} // Disable right-click menu
      />
    </div>
  );
}