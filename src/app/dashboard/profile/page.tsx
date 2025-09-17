
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfilePage() {
    const { profile: initialProfile, updateProfile, loading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
    const { toast } = useToast();

    useEffect(() => {
        setProfile(initialProfile);
    }, [initialProfile]);

    if (loading || !profile) {
        return (
             <main className="container mx-auto p-4 md:p-8">
                 <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="flex justify-center">
                            <Skeleton className="h-24 w-24 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                        </div>
                        <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-20 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                        <div className="flex justify-end"><Skeleton className="h-10 w-24" /></div>
                    </CardContent>
                 </Card>
             </main>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => prev ? ({ ...prev, [name]: name === 'age' ? parseInt(value, 10) : value }) : null);
    };

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => prev ? ({ ...prev, links: { ...prev.links, [name]: value } }) : null);
    };
    
    const handleArrayChange = (field: 'techStack' | 'interests' | 'networkingTags', value: string) => {
        setProfile(prev => prev ? ({ ...prev, [field]: value.split(',').map(item => item.trim()) }) : null);
    };

    const handleSelectChange = (field: 'gender', value: string) => {
         setProfile(prev => prev ? ({ ...prev, [field]: value }) : null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (profile) {
            try {
                await updateProfile(profile);
                toast({
                    title: 'Profile Updated',
                    description: 'Your profile has been saved successfully.',
                });
            } catch (error) {
                 toast({
                    title: 'Error updating profile',
                    description: 'Could not save your profile. Please try again.',
                    variant: 'destructive',
                });
            }
        }
    };

    return (
        <main className="container mx-auto p-4 md:p-8">
             <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Edit Your Profile</CardTitle>
                    <CardDescription>Keep your profile up-to-date to get the best matches.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={profile.name ?? ''} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="headline">Headline</Label>
                                <Input id="headline" name="headline" value={profile.headline ?? ''} onChange={handleInputChange} />
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" name="age" type="number" value={profile.age ?? ''} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={profile.gender ?? ''} onValueChange={(value) => handleSelectChange('gender', value)}>
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select a gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="non-binary">Non-binary</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" name="location" value={profile.location ?? ''} onChange={handleInputChange} />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" name="bio" value={profile.bio ?? ''} onChange={handleInputChange} rows={4} />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="currentWork">Current Work</Label>
                            <Input id="currentWork" name="currentWork" value={profile.currentWork ?? ''} onChange={handleInputChange} />
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="github">GitHub Profile URL</Label>
                                <Input id="github" name="github" value={profile.links?.github ?? ''} onChange={handleLinkChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                                <Input id="linkedin" name="linkedin" value={profile.links?.linkedin ?? ''} onChange={handleLinkChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                            <Input 
                                id="techStack" 
                                name="techStack" 
                                value={(profile.techStack ?? []).join(', ')} 
                                onChange={(e) => handleArrayChange('techStack', e.target.value)}
                            />
                             <div className="flex flex-wrap gap-2 pt-2">
                                {(profile.techStack ?? []).filter(Boolean).map((skill) => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interests">Interests (comma-separated)</Label>
                            <Input 
                                id="interests" 
                                name="interests" 
                                value={(profile.interests ?? []).join(', ')} 
                                onChange={(e) => handleArrayChange('interests', e.target.value)}
                            />
                            <div className="flex flex-wrap gap-2 pt-2">
                                {(profile.interests ?? []).filter(Boolean).map((interest) => (
                                    <Badge key={interest} variant="secondary">{interest}</Badge>
                                ))}
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="networkingTags">Networking Goals (comma-separated)</Label>
                            <Input 
                                id="networkingTags" 
                                name="networkingTags" 
                                value={(profile.networkingTags ?? []).join(', ')} 
                                onChange={(e) => handleArrayChange('networkingTags', e.target.value)}
                            />
                            <div className="flex flex-wrap gap-2 pt-2">
                                {(profile.networkingTags ?? []).filter(Boolean).map((tag) => (
                                    <Badge key={tag} variant="outline">{tag}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
