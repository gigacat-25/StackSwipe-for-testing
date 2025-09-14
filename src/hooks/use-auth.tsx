
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseApp, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/data';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    profile: UserProfile | null;
    hasProfile: boolean;
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
    const auth = getAuth(firebaseApp);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                const profileDoc = await getDoc(doc(db, 'users', user.uid));
                if (profileDoc.exists()) {
                    setProfile(profileDoc.data() as UserProfile);
                    setHasProfile(true);
                } else {
                    setProfile(null);
                    setHasProfile(false);
                }
            } else {
                setHasProfile(false);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

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

    const value = { user, loading, profile, hasProfile, updateProfile, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
