import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data: assessments, error } = await supabase
      .from('assessments')
      .select(`
        id,
        title,
        description,
        time_limit_minutes,
        passing_score,
        is_published,
        created_at,
        assessment_questions (count)
      `)
      .eq('created_by', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data to include count
    const transformedAssessments = assessments.map(assessment => ({
      ...assessment,
      _count: {
        assessment_questions: assessment.assessment_questions?.length || 0
      }
    }));

    return NextResponse.json(transformedAssessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Error fetching assessments' }, { status: 500 });
  }
}