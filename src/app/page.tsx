'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import LandingView from '../components/pages/LandingView';

export default function Home() {
  const { isAuthenticated, login } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // If already authenticated, show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500 font-medium">
        Re-routing session to Dashboard platform...
      </div>
    );
  }

  // Show landing onboarding panel
  return (
    <LandingView
      onGetStarted={() => {
        login('alex@formforge.ai', 'Alex Mercer');
        router.push('/dashboard');
      }}
    />
  );
}
