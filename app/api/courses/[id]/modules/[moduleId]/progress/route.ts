import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string; moduleId: string }> }
) {
  const params = await props.params;
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { status, timeSpentMinutes, score } = await request.json();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Check if user is enrolled in the course
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('user_course_enrollments')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('course_id', params.id)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 });
    }

    // Update or create module progress
    const progressData = {
      user_id: user.user.id,
      course_id: params.id,
      module_id: params.moduleId,
      status,
      time_spent_minutes: timeSpentMinutes,
      score,
      started_at: status === 'in_progress' ? new Date().toISOString() : undefined,
      completed_at: status === 'completed' ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString()
    };

    const { data: progress, error: progressError } = await supabase
      .from('user_module_progress')
      .upsert(progressData)
      .select()
      .single();

    if (progressError) throw progressError;

    // Update course enrollment progress
    await updateCourseProgress(supabase, user.user.id, params.id);

    // Update last accessed time
    await supabase
      .from('user_course_enrollments')
      .update({ 
        last_accessed_at: new Date().toISOString(),
        status: 'in_progress'
      })
      .eq('user_id', user.user.id)
      .eq('course_id', params.id);

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating module progress:', error);
    return NextResponse.json({ error: 'Error updating progress' }, { status: 500 });
  }
}

async function updateCourseProgress(supabase: any, userId: string, courseId: string) {
  try {
    // Get all modules for the course
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select('id, is_required')
      .eq('course_id', courseId);

    if (modulesError) throw modulesError;

    // Get user's progress on all modules
    const { data: progress, error: progressError } = await supabase
      .from('user_module_progress')
      .select('module_id, status')
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (progressError) throw progressError;

    // Calculate progress percentage
    const requiredModules = modules.filter((m: any) => m.is_required);
    const completedModules = progress.filter((p: any) => 
      p.status === 'completed' && 
      requiredModules.some((m: any) => m.id === p.module_id)
    );

    const progressPercentage = requiredModules.length > 0 
      ? Math.round((completedModules.length / requiredModules.length) * 100)
      : 0;

    const courseStatus = progressPercentage === 100 ? 'completed' : 'in_progress';

    // Update enrollment progress
    await supabase
      .from('user_course_enrollments')
      .update({
        progress_percentage: progressPercentage,
        status: courseStatus,
        completed_at: courseStatus === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('course_id', courseId);

  } catch (error) {
    console.error('Error updating course progress:', error);
  }
}