
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';

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
      <div className="flex flex-col items-center justify-start space-y-6">
        <div className="w-full max-w-sm flex justify-end">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle className="font-headline flex items-center gap-2">
                            <SlidersHorizontal/> Filters
                        </SheetTitle>
                        <SheetDescription>
                            Refine your search to find the perfect match.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" placeholder="e.g., San Francisco, CA" />
                        </div>
                        <div>
                            <Label htmlFor="tech-stack">Tech Stack</Label>
                            <Input id="tech-stack" placeholder="e.g., React, Python" />
                        </div>
                        <Button className="w-full" disabled>Apply Filters</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>

        <div className="w-full max-w-sm flex flex-col items-center space-y-6">
          <div className="relative h-[700px] w-full">
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

          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
                <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-600" onClick={() => handleSwipe('dislike')} disabled={limitReached}>
                    <XIcon className="h-8 w-8" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2" onClick={handleUndo} disabled={currentIndex === 0 || limitReached}>
                    <Undo className="h-6 w-6" />
                </Button>
                <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-100 hover:text-green-600" onClick={() => handleSwipe('like')} disabled={limitReached}>
                    <Heart className="h-8 w-8" />
                </Button>
            </div>
            <div className="text-center text-muted-foreground h-5">
                {!limitReached && <p>Swipes remaining: {SWIPE_LIMIT - swipes} / {SWIPE_LIMIT}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
