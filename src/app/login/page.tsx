
'use client';

import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { getAuth, signInWithPopup, GithubAuthProvider, getAdditionalUserInfo } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const auth = getAuth(firebaseApp);
    const provider = new GithubAuthProvider();

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const additionalInfo = getAdditionalUserInfo(result);

            if (additionalInfo?.isNewUser) {
                router.push('/dashboard/profile/create');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            toast({
                title: 'Authentication Failed',
                description: 'Could not log in with GitHub. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="mx-auto max-w-sm">
                <CardHeader className="text-center">
                     <div className="flex justify-center items-center mb-4">
                        <Icons.logo className="size-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-headline">Welcome to StackSwipe</CardTitle>
                    <CardDescription>
                        Sign in with your GitHub account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <Button onClick={handleLogin}>
                            <Github className="mr-2 h-4 w-4" />
                            Login with GitHub
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
