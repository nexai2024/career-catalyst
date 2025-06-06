"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@stackframe/stack";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const supabase = createClient();
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('completed_at')
          .eq('user_id', user.id)
          .single();

        if (!profile || !profile.completed_at) {
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