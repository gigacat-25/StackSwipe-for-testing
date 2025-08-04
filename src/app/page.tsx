
'use client';

import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error("Authentication failed:", error);
      toast({
        title: 'Authentication Failed',
        description: 'Could not log in with GitHub. Please try again.',
        variant: 'destructive'
      })
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
                <Icons.logo className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold tracking-tight">
              Welcome to StackSwipe
            </CardTitle>
            <CardDescription className="pt-2">
              Connect with tech professionals. Swipe right for your next opportunity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
                <Button onClick={handleLogin} size="lg">
                    <Github className="mr-2 h-5 w-5" />
                    Login with GitHub
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
       <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} StackSwipe. All rights reserved.</p>
        <p className="mt-1">
          Designed to connect innovators and creators.
        </p>
      </footer>
    </div>
  );
}
