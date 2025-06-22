import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data: userAssessments, error } = await supabase
      .from('user_assessments')
      .select(`
        id,
        assessment_id,
        start_time,
        end_time,
        score,
        status,
        assessments (
          id,
          title,
          description,
          time_limit_minutes,
          passing_score,
          is_published
        )
      `)
      .eq('user_id', user.user.id)
      .order('start_time', { ascending: false });

    if (error) throw error;

    // Transform the data to match the expected format
    const transformedData = userAssessments.map(ua => ({
      ...ua,
      assessment: ua.assessments
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching user assessments:', error);
    return NextResponse.json({ error: 'Error fetching user assessments' }, { status: 500 });
  }
}