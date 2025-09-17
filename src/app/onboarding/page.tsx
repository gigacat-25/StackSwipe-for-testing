
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { UserProfile } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const profileStepSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  headline: z.string().min(5, { message: 'Headline must be at least 5 characters.' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' }),
  age: z.coerce.number().min(18, { message: 'You must be at least 18.' }).max(99),
  gender: z.string().min(1, { message: 'Please select a gender.'}),
});

const workStepSchema = z.object({
  currentWork: z.string().min(5, { message: 'Current work must be at least 5 characters.' }),
  techStack: z.string().min(2, { message: 'Please add at least one skill.' }),
  interests: z.string().min(2, { message: 'Please add at least one interest.' }),
});

const socialStepSchema = z.object({
    github: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
    linkedin: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

const goalsStepSchema = z.object({
  networkingTags: z.string().min(2, { message: 'Please add at least one goal.' }),
});

const allSteps = [
    { id: 'Step 1', name: 'Profile Basics', fields: ['name', 'headline', 'bio', 'location', 'age', 'gender'], schema: profileStepSchema },
    { id: 'Step 2', name: 'Work & Skills', fields: ['currentWork', 'techStack', 'interests'], schema: workStepSchema },
    { id: 'Step 3', name: 'Social Links', fields: ['github', 'linkedin'], schema: socialStepSchema },
    { id: 'Step 4', name: 'Networking Goals', fields: ['networkingTags'], schema: goalsStepSchema },
];


const fullSchema = profileStepSchema.merge(workStepSchema).merge(socialStepSchema).merge(goalsStepSchema);
type FormValues = z.infer<typeof fullSchema>;

export default function OnboardingPage() {
    const [step, setStep] = useState(0);
    const router = useRouter();
    const { user, updateProfile } = useAuth();
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(fullSchema),
        defaultValues: {
            name: '',
            headline: '',
            bio: '',
            location: '',
            currentWork: '',
            techStack: '',
            interests: '',
            networkingTags: '',
            github: '',
            linkedin: '',
            gender: '',
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
            headline: data.headline,
            bio: data.bio,
            location: data.location,
            age: data.age,
            gender: data.gender,
            currentWork: data.currentWork,
            techStack: (data.techStack || '').split(',').map(item => item.trim()).filter(Boolean),
            interests: (data.interests || '').split(',').map(item => item.trim()).filter(Boolean),
            networkingTags: (data.networkingTags || '').split(',').map(item => item.trim()).filter(Boolean),
            links: {
                github: data.github || '',
                linkedin: data.linkedin || '',
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="age" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Age</FormLabel>
                                                <FormControl><Input type="number" {...field} placeholder="e.g., 28" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="gender" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="non-binary">Non-binary</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="headline" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Headline</FormLabel>
                                            <FormControl><Input {...field} placeholder="e.g., Senior Software Engineer @ DevCo" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="location" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl><Input {...field} placeholder="e.g., San Francisco, CA" /></FormControl>
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
