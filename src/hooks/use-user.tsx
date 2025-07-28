
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { currentUser as initialUser, UserProfile } from '@/lib/data';

interface UserContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
