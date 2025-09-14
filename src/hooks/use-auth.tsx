
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { firebaseApp, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/data';
import { Match } from '@/lib/data';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    profile: UserProfile | null;
    hasProfile: boolean;
    matches: Match[];
    updateProfile: (profile: UserProfile) => Promise<void>;
    login: (email: string, pass: string) => Promise<any>;
    signup: (email: string, pass: string) => Promise<any>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasProfile, setHasProfile] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const auth = getAuth(firebaseApp);
    const router = useRouter();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            setUser(user);
            if (user) {
                const profileDoc = await getDoc(doc(db, 'users', user.uid));
                if (profileDoc.exists()) {
                    setProfile(profileDoc.data() as UserProfile);
                    setHasProfile(true);
                } else {
                    setProfile(null);
                    setHasProfile(false);
                    setMatches([]);
                }
            } else {
                setHasProfile(false);
                setProfile(null);
                setMatches([]);
            }
            setLoading(false);
        });

        return () => unsubscribeAuth();
    }, [auth]);

    useEffect(() => {
        if (!user) {
            setMatches([]);
            return;
        };

        const q = query(collection(db, "matches"), where("userIds", "array-contains", user.uid));
        
        const unsubscribeMatches = onSnapshot(q, async (querySnapshot) => {
            const userMatches: Match[] = [];
            const userIdsInMatches = new Set<string>();
        
            querySnapshot.forEach(doc => {
                const match = doc.data() as Match;
                userMatches.push(match);
                match.userIds.forEach(id => userIdsInMatches.add(id));
            });
        
            if (userIdsInMatches.size > 0) {
                const profilesMap = new Map<string, UserProfile>();
                // To avoid a large "in" query, fetch profiles as needed or paginate
                const profilesQuery = query(collection(db, "users"), where("id", "in", Array.from(userIdsInMatches)));
                const profileSnapshots = await getDocs(profilesQuery);
                profileSnapshots.forEach(doc => {
                    profilesMap.set(doc.id, doc.data() as UserProfile);
                });
        
                const enrichedMatches = userMatches.map(match => ({
                    ...match,
                    users: match.userIds.map(id => profilesMap.get(id)).filter(Boolean) as UserProfile[]
                }));
                setMatches(enrichedMatches);
            } else {
                setMatches([]);
            }
        });

        return () => unsubscribeMatches();

    }, [user]);

    const login = (email: string, pass: string) => {
        return signInWithEmailAndPassword(auth, email, pass);
    };

    const signup = (email: string, pass: string) => {
        setHasProfile(false);
        return createUserWithEmailAndPassword(auth, email, pass);
    };
    
    const updateProfile = async (newProfile: UserProfile) => {
        if (user) {
            await setDoc(doc(db, 'users', user.uid), newProfile);
            setProfile(newProfile);
            setHasProfile(true);
        }
    };

    const logout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    const value = { user, loading, profile, hasProfile, matches, updateProfile, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

    