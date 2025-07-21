"use client";
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserResource } from '@clerk/types';
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
interface Certification {
  id: string;
  userId: string;
  name: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}
interface Award {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
}
interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  technologies: string[];
  repositoryUrl: string;
  liveUrl: string;
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
  education?: string;
  certifications?: Certification[];
  desiredPosition?: string;
  otherInfo?: string;
  specialRequirements?: string;
  skills?: Skill[];
  awards?: Award[];
  projects?: Project[];
}

type UserType = Partial<UserResource> & UserFields | null;
interface UserContextType {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
});
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  //const { isSignedIn, user, isLoaded } = useUser()
  const { user: stackUser } = useUser();
  const [user, setUser] = useState<UserType>(null);
  const exp = async () => {
    const experience: Experience[] = await axios.get(`${process.env.APP_URL}/api/user/experience`)
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
    const skills: Skill[] = await axios.get(`${process.env.APP_URL}/api/user/skills`)
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
  const userAwards = async () => {
    const awards: Award[] = await axios.get(`${process.env.APP_URL}/api/user/awards`)
      .then(function (response: any) {
        console.log('Award data:', response.data);
        return response.data;
      })
      .catch(function (error: Error) {
        console.error('Error fetching skills:', error);
        return [];
      });
    console.log('Awards:', awards);

    return awards;
  }
  const userProjects = async () => {
    const projects: Project[] = await axios.get(`${process.env.APP_URL}/api/user/projects`)
      .then(function (response: any) {
        console.log('Project data:', response.data);
        return response.data;
      })
      .catch(function (error: Error) {
        console.error('Error fetching projects:', error);
        return [];
      });
    console.log('Projects:', projects);

    return projects;
  }
  useEffect(() => {
    if (stackUser) {
      const fetchData = async () => {
        const experiences = await exp();
        let iYearsOfExperience = 0;
        if (experiences && experiences.length > 0) {
          iYearsOfExperience = experiences.length
        }
        const skills = await userSkills();
        const awards = await userAwards();
        const projects = await userProjects();
        console.log('Fetched data:', {
          experiences,
          iYearsOfExperience,
          skills,
          awards,
          projects,
        });
        
        // Create a new object that matches UserType (UserResource & UserFields)
        // without directly spreading stackUser (which includes methods that cause type issues)
        const userData = {
          // Only take essential properties from stackUser
          id: stackUser.id,
          // UserFields properties
          name: stackUser.fullName || '',
          email: stackUser.emailAddresses[0]?.emailAddress || '',
          currentPosition: (stackUser.publicMetadata?.currentPosition as string) || '',
          location: (stackUser.publicMetadata?.location as string) || '',
          bio: (stackUser.publicMetadata?.bio as string) || '',
          education: (stackUser.publicMetadata?.education as string) || '',
          desiredPosition: (stackUser.publicMetadata?.desiredPosition as string) || '',
          careerGoals: (stackUser.publicMetadata?.careerGoals as string) || '',
          image: stackUser.imageUrl || '',
          experiences: experiences,
          yearsOfExperience: iYearsOfExperience,
          skills: skills,
        } as UserType;
        
        setUser(userData);
      };

      fetchData();
    }
    console.log('UserProvider initialized with user:', user);

  }, [stackUser]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;