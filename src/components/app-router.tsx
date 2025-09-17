
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const publicRoutes = ['/', '/login', '/signup'];
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
    const isOnboarding = pathname === onboardingRoute;

    if (user) {
        if (!hasProfile && !isOnboarding) {
            // If user is logged in but has no profile, force onboarding.
            router.replace(onboardingRoute);
        } else if (hasProfile && (isPublic || isOnboarding)) {
            // If user has a profile and is on a public page or onboarding, send to dashboard.
            router.replace('/dashboard');
        }
    } else {
        // If user is not logged in and is trying to access a protected route, send to login.
        if (!isPublic) {
            router.replace('/login');
        }
    }
  }, [user, loading, hasProfile, router, pathname]);

  // While loading, or if the logic is still processing, show a loading screen or nothing to prevent content flashing.
  if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
      )
  }
  
  const isPublic = publicRoutes.includes(pathname);
  if (!user && !isPublic) {
    return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
  }

  if (user && !hasProfile && pathname !== onboardingRoute) {
    return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
  }
  
  if (user && hasProfile && (isPublic || pathname === onboardingRoute)) {
     return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;
  }


  return <>{children}</>;
}
