import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Check if course exists and is published
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, is_published')
      .eq('id', params.id)
      .single();

    if (courseError) throw courseError;

    if (!course.is_published) {
      return NextResponse.json({ error: 'Course is not available for enrollment' }, { status: 400 });
    }

    // Check if user is already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('user_course_enrollments')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('course_id', params.id)
      .single();

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    // Create enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('user_course_enrollments')
      .insert({
        user_id: user.user.id,
        course_id: params.id,
        status: 'enrolled'
      })
      .select()
      .single();

    if (enrollmentError) throw enrollmentError;

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json({ error: 'Error enrolling in course' }, { status: 500 });
  }
}