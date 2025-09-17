
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Icons } from './icons';

const publicRoutes = ['/login', '/signup'];
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
            router.replace(onboardingRoute);
        } else if (hasProfile && (isPublic || isOnboarding || pathname === '/')) {
            router.replace('/dashboard');
        }
    } else {
        if (!isPublic && pathname !== '/') {
            router.replace('/login');
        }
    }
  }, [user, loading, hasProfile, router, pathname]);

  if (loading) {
      return (
        <div className="flex h-screen items-center justify-center flex-col gap-4">
            <Icons.logo className="size-10 animate-pulse" />
            <p className="text-muted-foreground">Warming up the code engines…</p>
        </div>
      )
  }
  
  const isPublic = publicRoutes.includes(pathname) || pathname === '/';
  if (!user && !isPublic) {
    return <div className="flex h-screen items-center justify-center flex-col gap-4">
            <Icons.logo className="size-10 animate-pulse" />
            <p className="text-muted-foreground">Warming up the code engines…</p>
        </div>;
  }

  if (user && !hasProfile && pathname !== onboardingRoute) {
    return <div className="flex h-screen items-center justify-center flex-col gap-4">
            <Icons.logo className="size-10 animate-pulse" />
            <p className="text-muted-foreground">Warming up the code engines…</p>
        </div>;
  }
  
  if (user && hasProfile && (isPublic || pathname === onboardingRoute)) {
     return <div className="flex h-screen items-center justify-center flex-col gap-4">
            <Icons.logo className="size-10 animate-pulse" />
            <p className="text-muted-foreground">Warming up the code engines…</p>
        </div>;
  }


  return <>{children}</>;
}
