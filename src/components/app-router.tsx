
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const publicRoutes = ['/login', '/signup', '/'];
const onboardingRoute = '/onboarding';

export function AppRouter({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, hasProfile } = useAuth();

  useEffect(() => {
    if (loading) {
      return; 
    }

    const isPublic = publicRoutes.includes(pathname);

    if (user) {
        if (!hasProfile && pathname !== onboardingRoute) {
            router.replace(onboardingRoute);
        } else if (hasProfile && (isPublic || pathname === onboardingRoute)) {
            router.replace('/dashboard');
        }
    } else {
        if (!isPublic) {
            router.replace('/login');
        }
    }
  }, [user, loading, hasProfile, router, pathname]);

  if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
      )
  }

  return <>{children}</>;
}
