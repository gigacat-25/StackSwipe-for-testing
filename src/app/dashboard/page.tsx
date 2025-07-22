
'use client';

import { useState } from 'react';
import { Heart, SlidersHorizontal, Undo, X as XIcon } from 'lucide-react';
import { profiles } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/components/profile-card';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SWIPE_LIMIT = 10;

export default function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipes, setSwipes] = useState(0);
  const { toast } = useToast();

  const handleSwipe = (action: 'like' | 'dislike') => {
    if (swipes >= SWIPE_LIMIT) {
      toast({
        title: 'Daily limit reached',
        description: 'You have used all your swipes for today. Come back tomorrow!',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: `You ${action}d ${profiles[currentIndex].name}`,
    });

    setSwipes(swipes + 1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length);
  };
  
  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
       if(swipes > 0) setSwipes(swipes - 1);
       toast({ title: 'Undid last swipe.'});
    }
  };

  const limitReached = swipes >= SWIPE_LIMIT;

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
           <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><SlidersHorizontal/> Filters</CardTitle>
                <CardDescription>Refine your search to find the perfect match.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., San Francisco, CA" />
                  </div>
                  <div>
                    <Label htmlFor="tech-stack">Tech Stack</Label>
                    <Input id="tech-stack" placeholder="e.g., React, Python" />
                  </div>
                   <Button className="w-full" disabled>Apply Filters</Button>
              </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 flex flex-col items-center justify-start space-y-6">
           <div className="relative w-full max-w-sm h-[700px]">
                {limitReached ? (
                     <Card className="flex flex-col items-center justify-center text-center h-full">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">You're out of swipes!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>You've reached your daily limit of {SWIPE_LIMIT} swipes. Come back tomorrow for more connections!</p>
                        </CardContent>
                    </Card>
                ) : (
                    <ProfileCard profile={profiles[currentIndex]} />
                )}
           </div>

            <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-600" onClick={() => handleSwipe('dislike')} disabled={limitReached}>
                    <XIcon className="h-8 w-8" />
                </Button>
                 <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2" onClick={handleUndo} disabled={currentIndex === 0}>
                    <Undo className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-100 hover:text-green-600" onClick={() => handleSwipe('like')} disabled={limitReached}>
                    <Heart className="h-8 w-8" />
                </Button>
            </div>
            <div className="text-center text-muted-foreground">
                <p>Swipes remaining: {SWIPE_LIMIT - swipes} / {SWIPE_LIMIT}</p>
            </div>
        </div>
      </div>
    </main>
  );
}
