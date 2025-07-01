import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Get course details with modules
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        course_modules (
          id,
          title,
          description,
          content_type,
          content_url,
          content_text,
          duration_minutes,
          module_order,
          is_required
        ),
        course_reviews (
          id,
          rating,
          review_text,
          created_at,
          user_id
        )
      `)
      .eq('id', params.id)
      .single();

    if (courseError) throw courseError;

    // Check if user is enrolled
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('user_course_enrollments')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('course_id', params.id)
      .single();

    // Get user's progress on modules if enrolled
    let moduleProgress = [];
    if (enrollment) {
      const { data: progress, error: progressError } = await supabase
        .from('user_module_progress')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('course_id', params.id);

      if (!progressError) {
        moduleProgress = progress || [];
      }
    }

    // Calculate average rating
    const reviews = course.course_reviews || [];
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
      : 0;

    // Sort modules by order
    const sortedModules = (course.course_modules || []).sort((a: any, b: any) => a.module_order - b.module_order);

    const response = {
      ...course,
      course_modules: sortedModules,
      average_rating: Math.round(avgRating * 10) / 10,
      review_count: reviews.length,
      is_enrolled: !!enrollment,
      enrollment,
      module_progress: moduleProgress
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Error fetching course' }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const updates = await request.json();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Check if user owns this course
    const { data: course, error: checkError } = await supabase
      .from('courses')
      .select('created_by')
      .eq('id', params.id)
      .single();

    if (checkError) throw checkError;
    
    if (course.created_by !== user.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data: updatedCourse, error: updateError } = await supabase
      .from('courses')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Error updating course' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Check if user owns this course
    const { data: course, error: checkError } = await supabase
      .from('courses')
      .select('created_by')
      .eq('id', params.id)
      .single();

    if (checkError) throw checkError;
    
    if (course.created_by !== user.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Error deleting course' }, { status: 500 });
  }
}