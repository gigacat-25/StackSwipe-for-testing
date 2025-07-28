
'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { profileFormSchema, type ProfileFormValues } from '@/lib/schemas';
import { type UserProfile } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Save } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

const networkingTagOptions = ['Mentor', 'Mentee', 'Teammate', 'Vibes', 'Referrals'];

export default function EditProfilePage() {
  const { toast } = useToast();
  const { user, setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
        name: user.name,
        headline: user.headline,
        bio: user.bio,
        currentWork: user.currentWork,
        techStack: user.techStack.join(', '),
        interests: user.interests.join(', '),
        networkingTags: user.networkingTags,
        github: user.links.github,
        linkedin: user.links.linkedin,
    },
  });

  useEffect(() => {
    form.reset({
        name: user.name,
        headline: user.headline,
        bio: user.bio,
        currentWork: user.currentWork,
        techStack: user.techStack.join(', '),
        interests: user.interests.join(', '),
        networkingTags: user.networkingTags,
        github: user.links.github,
        linkedin: user.links.linkedin,
    });
  }, [user, form]);


  function onSubmit(data: ProfileFormValues) {
    const updatedUser: UserProfile = {
        ...user,
        name: data.name,
        headline: data.headline,
        bio: data.bio ?? '',
        currentWork: data.currentWork ?? '',
        techStack: data.techStack?.split(',').map(s => s.trim()) ?? [],
        interests: data.interests?.split(',').map(i => i.trim()) ?? [],
        networkingTags: data.networkingTags ?? [],
        links: {
            github: data.github ?? '',
            linkedin: data.linkedin ?? '',
        }
    };
    setUser(updatedUser);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been saved successfully.',
    });
    console.log(data);
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = {
          ...user,
          avatarUrl: reader.result as string,
        };
        setUser(updatedUser);
        toast({
          title: 'Photo Updated',
          description: 'Your new photo has been set.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <User />
                    Edit Your Profile
                </CardTitle>
                <CardDescription>
                    Keep your profile up-to-date to attract the best connections.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex items-center space-x-4">
                         <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button type="button" variant="outline" onClick={handleChoosePhoto}>Change Photo</Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Headline</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Senior Frontend Engineer @ Innovate Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Tell us a little bit about yourself" className="resize-y" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="currentWork"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Current Work</FormLabel>
                        <FormControl>
                            <Input placeholder="What are you working on right now?" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="techStack"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tech Stack</FormLabel>
                        <FormControl>
                            <Input placeholder="React, Python, AWS..." {...field} />
                        </FormControl>
                        <FormDescription>
                            Enter skills separated by commas.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Interests</FormLabel>
                        <FormControl>
                            <Input placeholder="Design Systems, AI, Indie Hacking..." {...field} />
                        </FormControl>
                         <FormDescription>
                            Enter interests separated by commas.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                        control={form.control}
                        name="networkingTags"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel>Networking Goals</FormLabel>
                                    <FormDescription>
                                        What are you looking for on StackSwipe?
                                    </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {networkingTagOptions.map((item) => (
                                    <FormField
                                    key={item}
                                    control={form.control}
                                    name="networkingTags"
                                    render={({ field }) => {
                                        return (
                                        <FormItem
                                            key={item}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value ?? []), item])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== item
                                                        )
                                                    )
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                            {item}
                                            </FormLabel>
                                        </FormItem>
                                        )
                                    }}
                                    />
                                ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                    <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://github.com/your-username" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <Button type="submit" className="w-full sm:w-auto">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
