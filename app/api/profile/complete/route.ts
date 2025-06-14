/**
 * API endpoints for managing user profile completion.
 * 
 * This module provides endpoints to check if a user profile is complete
 * and to complete a user profile with comprehensive information.
 * 
 * @module ProfileCompleteAPI
 */

/**
 * GET endpoint to retrieve the completion status of a user's profile.
 * 
 * @async
 * @function GET
 * @param {Request} request - The incoming HTTP request object
 * @returns {Promise<NextResponse>} JSON response with profile completion status or error
 * @throws Will return a 401 response if the user is not authenticated
 * @throws Will return a 404 response if the profile is not found
 * @throws Will return a 500 response on server errors
 */

/**
 * POST endpoint to complete a user's profile with comprehensive information.
 * 
 * Creates or updates a comprehensive user profile record in the database and
 * updates the user metadata to indicate profile completion.
 * 
 * @async
 * @function POST
 * @param {Request} request - The incoming HTTP request with profile data in JSON format
 * @returns {Promise<NextResponse>} JSON response indicating success or error
 * @throws Will return a 401 response if the user is not authenticated
 * @throws Will return a 500 response if profile creation fails or on server errors
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';
import { stackServerApp } from '@/stack';


export async function GET(request: Request) {
  const prismaClient = prisma;
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  console.log('Fetching profile for user:', user?.id);
  try {
    const profile = await prismaClient.profile.findFirst({
      where: { userId: user?.id },
      select: { completedAt: true },
    });
    console.log('Profile fetched:', profile);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const profileData = await request.json();

    // Get the current user
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create comprehensive profile record
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        personal_info: profileData[1],
        education: profileData[2],
        experience: profileData[3],
        technical_skills: profileData[4],
        soft_skills: profileData[5],
        self_assessment: profileData[6],
        certifications: profileData[7],
        goals: profileData[8],
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
    }

    // Update user metadata to indicate profile completion
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        profile_completed: true,
        profile_completion_date: new Date().toISOString()
      }
    });

    if (metadataError) {
      console.error('Metadata update error:', metadataError);
    }

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile completed successfully'
    });

  } catch (error) {
    console.error('Complete profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}