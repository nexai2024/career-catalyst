"use client";
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CurrentUser, CurrentInternalUser, useUser } from '@stackframe/stack';

// type UserType = CurrentUser | CurrentInternalUser | null;
interface UserFields {
  name: string;
  email: string;
  currentPosition: string;
  location: string;
  bio: string;
  careerGoals: string;
  image: string;
}

type UserType = (CurrentUser & UserFields) | null;
interface UserContextType {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});
   export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const stackUser = useUser() as CurrentUser | null;
const [user, setUser] = useState<UserType>(null);
useEffect(() => {
  if (stackUser) {
    // Initialize user with default values for UserFields properties
    setUser({
      ...stackUser,
      name: stackUser.displayName || '',
      email: stackUser.primaryEmail || '',
      currentPosition: '',
      location: '',
      bio: '',
      careerGoals: '',
      image: stackUser.profileImageUrl || '',
    });
  }
}, [stackUser]);
  console.log('UserProvider initialized with user:', user);
    
  return (
    <UserContext.Provider value={{ user, setUser }}>
        {children} 
    </UserContext.Provider>
  );
};

export default UserProvider;