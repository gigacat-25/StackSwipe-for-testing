
'use client';
import Link from 'next/link';
import { Github, Linkedin, Briefcase, Code, Sparkles as InterestIcon, MapPin } from 'lucide-react';
import { type UserProfile } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfileCardProps {
  profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col">
      <CardHeader className="p-6 pb-2">
            <CardTitle className="font-headline text-2xl">{profile.name}, {profile.age}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </CardDescription>
            <CardDescription>{profile.headline}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-2 space-y-4 flex-1">
        <p className="text-sm text-muted-foreground">{profile.bio}</p>
        
        <div className="space-y-2">
            <h4 className="flex items-center text-sm font-semibold"><Briefcase className="mr-2 h-4 w-4" /> Current Work</h4>
            <p className="text-sm text-muted-foreground pl-6">{profile.currentWork}</p>
        </div>
        
        <div className="space-y-2">
             <h4 className="flex items-center text-sm font-semibold"><Code className="mr-2 h-4 w-4" /> Tech Stack</h4>
            <div className="flex flex-wrap gap-2 pl-6">
                {profile.techStack.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
            </div>
        </div>

        <div className="space-y-2">
            <h4 className="flex items-center text-sm font-semibold"><InterestIcon className="mr-2 h-4 w-4" /> Interests</h4>
            <div className="flex flex-wrap gap-2 pl-6">
                {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">{interest}</Badge>
                ))}
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 p-6">
        <div>
            <h4 className="text-sm font-semibold mb-2">Networking Goals</h4>
            <div className="flex flex-wrap gap-2">
            {profile.networkingTags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-primary/50 text-primary">{tag}</Badge>
            ))}
            </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link href={profile.links.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <Github className="h-6 w-6" />
          </Link>
          <Link href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <Linkedin className="h-6 w-6" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
