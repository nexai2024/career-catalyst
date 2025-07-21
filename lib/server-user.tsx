//import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { UserResource } from '@clerk/types';
import { useEffect } from 'react';
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
  id: string;
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

export default async function ServerUser(): Promise<UserType> {
  //return null; // Return null as a default value to satisfy the return type
  //const { isSignedIn, user, isLoaded } = useUser()
  const stackUser = await currentUser();
console.log('Stack User:', stackUser);
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
  const userCertifications = async () => {
    const certifications: Certification[] = await axios.get(`${process.env.APP_URL}/api/user/certifications`)
      .then(function (response: any) {
        console.log('Certificaition data:', response.data);
        return response.data;
      })
      .catch(function (error: Error) {
        console.error('Error fetching certifications:', error);
        return [];
      });
    console.log('Certifications:', certifications);

    return certifications;
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
        const certifications = await userCertifications();
        console.log('Fetched data:', {
          experiences,
          iYearsOfExperience,
          skills,
          awards,
          projects,
          certifications
        });
        
        // Create a new object that matches UserType (UserResource & UserFields)
        // without directly spreading stackUser (which includes methods that cause type issues)
        const userData = {
          // Only take essential properties from stackUser
          id: stackUser?.id || '',
          // UserFields properties
          name: stackUser?.fullName || '',
          email: stackUser?.emailAddresses[0]?.emailAddress || '',
          currentPosition: (stackUser?.publicMetadata?.currentPosition as string) || '',
          location: (stackUser?.publicMetadata?.location as string) || '',
          bio: (stackUser?.publicMetadata?.bio as string) || '',
          education: (stackUser?.publicMetadata?.education as string) || '',
          desiredPosition: (stackUser?.publicMetadata?.desiredPosition as string) || '',
          careerGoals: (stackUser?.publicMetadata?.careerGoals as string) || '',
          image: stackUser?.imageUrl || '',
          experiences: experiences,
          yearsOfExperience: iYearsOfExperience,
          skills: skills,
          certifications: certifications,
          awards: awards,
          projects: projects,
          otherInfo: (stackUser?.publicMetadata?.otherInfo as string) || '',
          specialRequirements: (stackUser?.publicMetadata?.specialRequirements as string) || '',
        } as UserType;
        
        return userData;
      };
      return await fetchData();
    }

    return null;
  }
