
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/data';
import { profiles } from '@/lib/data';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    profile: UserProfile | null;
    hasProfile: boolean;
    setHasProfile: (hasProfile: boolean) => void;
    updateProfile: (profile: UserProfile) => void;
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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                const profileExists = localStorage.getItem(`profile_${user.uid}`) === 'true';
                setHasProfile(profileExists);
                if (profileExists) {
                    const storedProfile = localStorage.getItem(`profile_data_${user.uid}`);
                    if (storedProfile) {
                        setProfile(JSON.parse(storedProfile));
                    }
                } else {
                    setProfile(null);
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
    
    const updateProfile = (newProfile: UserProfile) => {
        if(user) {
            localStorage.setItem(`profile_data_${user.uid}`, JSON.stringify(newProfile));
            setProfile(newProfile);
            if (!hasProfile) {
                localStorage.setItem(`profile_${user.uid}`, 'true');
                setHasProfile(true);
            }
        }
    };

    const logout = async () => {
        await signOut(auth);
        if (user) {
             localStorage.removeItem(`profile_${user.uid}`);
             localStorage.removeItem(`profile_data_${user.uid}`);
        }
        router.push('/login');
    };

    const value = { user, loading, profile, hasProfile, setHasProfile, updateProfile, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
