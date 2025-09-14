
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { UserProfile } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon } from 'lucide-react';

const profileStepSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  headline: z.string().min(5, { message: 'Headline must be at least 5 characters.' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }),
});

const workStepSchema = z.object({
  currentWork: z.string().min(5, { message: 'Current work must be at least 5 characters.' }),
  techStack: z.string().min(2, { message: 'Please add at least one skill.' }),
  interests: z.string().min(2, { message: 'Please add at least one interest.' }),
});

const socialStepSchema = z.object({
    github: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
    linkedin: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
    avatar: z.any().optional(),
});

const goalsStepSchema = z.object({
  networkingTags: z.string().min(2, { message: 'Please add at least one goal.' }),
});

const allSteps = [
    { id: 'Step 1', name: 'Profile Basics', fields: ['name', 'headline', 'bio'], schema: profileStepSchema },
    { id: 'Step 2', name: 'Work & Skills', fields: ['currentWork', 'techStack', 'interests'], schema: workStepSchema },
    { id: 'Step 3', name: 'Links & Picture', fields: ['github', 'linkedin', 'avatar'], schema: socialStepSchema },
    { id: 'Step 4', name: 'Networking Goals', fields: ['networkingTags'], schema: goalsStepSchema },
];


const fullSchema = profileStepSchema.merge(workStepSchema).merge(socialStepSchema).merge(goalsStepSchema);
type FormValues = z.infer<typeof fullSchema>;

export default function OnboardingPage() {
    const [step, setStep] = useState(0);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const router = useRouter();
    const { user, updateProfile } = useAuth();
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(fullSchema),
        defaultValues: {
            name: '',
            headline: '',
            bio: '',
            currentWork: '',
            techStack: '',
            interests: '',
            networkingTags: '',
            github: '',
            linkedin: '',
        },
    });

    const nextStep = async () => {
        const result = await form.trigger(allSteps[step].fields as (keyof FormValues)[]);
        if (result) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        setStep((prev) => prev - 1);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                form.setValue('avatar', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!user) {
            toast({
                title: 'Error',
                description: 'You must be logged in to create a profile.',
                variant: 'destructive',
            });
            return;
        }

        const newProfile: UserProfile = {
            id: user.uid,
            name: data.name,
            avatarUrl: (data.avatar as string) || `https://i.pravatar.cc/150?u=${user.uid}`,
            headline: data.headline,
            bio: data.bio,
            currentWork: data.currentWork,
            techStack: (data.techStack || '').split(',').map(item => item.trim()).filter(Boolean),
            interests: (data.interests || '').split(',').map(item => item.trim()).filter(Boolean),
            networkingTags: (data.networkingTags || '').split(',').map(item => item.trim()).filter(Boolean),
            links: {
                github: data.github || 'https://github.com',
                linkedin: data.linkedin || 'https://linkedin.com',
            },
        };
        
        try {
           await updateProfile(newProfile);
            toast({
                title: 'Profile Created!',
                description: "Welcome to StackSwipe! Let's find your next connection.",
            });
            router.push('/dashboard');
        } catch (error) {
             toast({
                title: 'Error creating profile',
                description: 'Could not save your profile. Please try again.',
                variant: 'destructive',
            });
             console.error("Profile creation error:", error);
        }
    };

    const progress = ((step + 1) / allSteps.length) * 100;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <Progress value={progress} className="mb-4" />
                    <CardTitle className="font-headline text-2xl">Welcome to StackSwipe</CardTitle>
                    <CardDescription>
                        {allSteps[step].name}: Let's set up your profile to find the best connections.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {step === 0 && (
                                <>
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl><Input {...field} placeholder="e.g., Ada Lovelace" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="headline" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Headline</FormLabel>
                                            <FormControl><Input {...field} placeholder="e.g., Senior Software Engineer @ DevCo" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="bio" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl><Textarea {...field} placeholder="Tell us a little about yourself..." rows={3} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </>
                            )}
                             {step === 1 && (
                                <>
                                    <FormField control={form.control} name="currentWork" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Work</FormLabel>
                                            <FormControl><Input {...field} placeholder="e.g., Building a new design system." /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="techStack" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tech Stack (comma-separated)</FormLabel>
                                            <FormControl><Input {...field} placeholder="e.g., React, TypeScript, Next.js" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField control={form.control} name="interests" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Interests (comma-separated)</FormLabel>
                                            <FormControl><Input {...field} placeholder="e.g., Design Systems, Web Accessibility" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <div className="flex flex-col items-center gap-4">
                                        <Avatar className="w-24 h-24">
                                            <AvatarImage src={avatarPreview ?? undefined} />
                                            <AvatarFallback className="text-4xl"><UserIcon /></AvatarFallback>
                                        </Avatar>
                                        <FormField control={form.control} name="avatar" render={() => (
                                            <FormItem>
                                                <FormLabel>Profile Picture</FormLabel>
                                                <FormControl>
                                                    <Input type="file" accept="image/*" onChange={handleAvatarChange} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="github" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GitHub Profile</FormLabel>
                                            <FormControl><Input {...field} placeholder="https://github.com/your-username" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="linkedin" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LinkedIn Profile</FormLabel>
                                            <FormControl><Input {...field} placeholder="https://linkedin.com/in/your-username" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </>
                            )}
                             {step === 3 && (
                                <>
                                    <FormField control={form.control} name="networkingTags" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Networking Goals (comma-separated)</FormLabel>
                                            <FormControl><Input {...field} placeholder="e.g., Mentor, Teammate, Referrals" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </>
                            )}
                            <div className="flex justify-between pt-4">
                                {step > 0 ? (
                                    <Button type="button" variant="outline" onClick={prevStep}>
                                        Back
                                    </Button>
                                ) : <div />}
                                {step < allSteps.length - 1 ? (
                                    <Button type="button" onClick={nextStep}>
                                        Next
                                    </Button>
                                ) : (
                                    <Button type="submit">Finish</Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

    