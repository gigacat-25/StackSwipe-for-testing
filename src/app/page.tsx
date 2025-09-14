
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, hasProfile } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (hasProfile) {
            router.replace('/dashboard');
        } else {
            router.replace('/onboarding');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, hasProfile, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
