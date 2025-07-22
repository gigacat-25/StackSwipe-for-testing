
'use client';
import { useState } from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getRecommendations } from '@/actions/recommendations';
import { currentUser } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecommendationsPage() {
    const [networkingGoals, setNetworkingGoals] = useState('Find a mentor in frontend development and connect with potential teammates for a side project.');
    const [profileDetails] = useState(JSON.stringify({
        headline: currentUser.headline,
        bio: currentUser.bio,
        techStack: currentUser.techStack,
        interests: currentUser.interests,
    }, null, 2));

    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRecommendations([]);

        const result = await getRecommendations({ networkingGoals, profileDetails });

        if ('error' in result && result.error) {
            setError(result.error);
        } else if ('recommendedProfiles' in result) {
            setRecommendations(result.recommendedProfiles);
        }
        
        setLoading(false);
    };

    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Card className="mb-8 shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl flex items-center gap-2">
                            <Sparkles className="text-primary" />
                            AI Profile Recommendations
                        </CardTitle>
                        <CardDescription>
                            Let our AI suggest relevant profiles based on your goals and profile.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="networking-goals">Your Networking Goals</Label>
                                <Textarea
                                    id="networking-goals"
                                    value={networkingGoals}
                                    onChange={(e) => setNetworkingGoals(e.target.value)}
                                    placeholder="e.g., Find a mentor, look for job referrals, connect with other developers..."
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="profile-details">Your Profile Details</Label>
                                <Textarea
                                    id="profile-details"
                                    value={profileDetails}
                                    readOnly
                                    rows={8}
                                    className="bg-muted font-code text-xs"
                                />
                                <p className="text-xs text-muted-foreground">This is based on your current profile.</p>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {loading && (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                )}
                
                {error && <p className="text-destructive text-center">{error}</p>}

                {!loading && recommendations.length > 0 && (
                     <div className="space-y-4">
                        <h2 className="font-headline text-xl font-semibold">Here are your recommendations:</h2>
                        {recommendations.map((rec, index) => (
                             <Card key={index} className="bg-card">
                                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <Bot className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-card-foreground">{rec}</p>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
