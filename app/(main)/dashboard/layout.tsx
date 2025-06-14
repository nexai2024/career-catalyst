"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { prisma } from "@/lib/db";
import { UserContext } from "@/contexts/User";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useContext(UserContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const axios = require('axios');
  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        console.log('Checking profile for user:', user.user?.id);
       // const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/profile`;
        const profile = await axios.get('/api/profile/complete')
          .then(function (response: any) {
            console.log('Profile data:', response.data);
            return response.data.profile;
          })
          .catch(function (error: Error) {
            console.error('Error fetching profile:', error);
            return null;
          })
        
        if (!profile) {
          console.error('Profile not found for user:', user.user?.id);
          router.push('/profile/onboarding');
          return;
        }
console.log('Profile fetched:', profile);
        if (!profile || !profile.completedAt) {
          console.log('Profile not completed for user:', user.user?.id);
        alert('Please complete your profile');
          router.push('/profile/onboarding');
          return;
        }

        setProfileCompleted(true);
      } catch (error) {
        console.error('Error checking profile:', error);
        router.push('/profile/onboarding');
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileCompletion();
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileCompleted) {
    return null; // Will redirect to onboarding
  }

  return <>{children}</>;
}