import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const profileData = await request.json();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
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