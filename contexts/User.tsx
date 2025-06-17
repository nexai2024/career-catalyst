"use client";
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CurrentUser, CurrentInternalUser, useUser } from '@stackframe/stack';
const axios = require('axios');
// type UserType = CurrentUser | CurrentInternalUser | null;
interface Experience {
  id: string;
  userId: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string;
}
interface Skill {
  id: string;
  userId: string;
  name: string;
  category: string;
  level: number;
}

interface UserFields {
  name: string;
  email: string;
  currentPosition: string;
  location: string;
  bio: string;
  careerGoals: string;
  image: string;
  experiences?: Experience[];
  yearsOfExperience?: number;
  skills?: Skill[];
}

type UserType = (CurrentUser & UserFields) | null;
interface UserContextType {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
});
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const stackUser = useUser() as CurrentUser | null;
  const [user, setUser] = useState<UserType>(null);
  const exp = async () => {
    const experience: Experience[] = await axios.get('/api/user/experience')
      .then(function (response: any) {
        console.log('Experience data:', response.data);
        return response.data;
      })
      .catch(function (error: Error) {
        console.error('Error fetching experience:', error);
        return [];
      });
    console.log('Experience:', experience);

    return experience;
  }
  const userSkills = async () => {
    const skills: Skill[] = await axios.get('/api/user/skills')
      .then(function (response: any) {
        console.log('Skill data:', response.data);
        return response.data;
      })
      .catch(function (error: Error) {
        console.error('Error fetching skills:', error);
        return [];
      });
    console.log('Skills:', skills);

    return skills;
  }
  useEffect(() => {
    if (stackUser) {
      const fetchData = async () => {
        const experiences = await exp();
        let iYearsOfExperience = 0;
        if (experiences && experiences.length > 0) {
          iYearsOfExperience = experiences.length
        }
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
          experiences: experiences,
          yearsOfExperience: iYearsOfExperience, // Default value, can be updated later
          skills: await userSkills(), // Fetch skills asynchronously
        });
      };

      fetchData();
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