import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const enrolled = searchParams.get('enrolled');

    let query = supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        short_description,
        category,
        level,
        duration_hours,
        thumbnail_url,
        is_published,
        price,
        created_at,
        course_reviews (
          rating
        )
      `);

    // If enrolled=true, get user's enrolled courses
    if (enrolled === 'true') {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: enrollments, error: enrollmentError } = await supabase
        .from('user_course_enrollments')
        .select(`
          id,
          progress_percentage,
          status,
          enrolled_at,
          last_accessed_at,
          courses (
            id,
            title,
            description,
            short_description,
            category,
            level,
            duration_hours,
            thumbnail_url,
            course_reviews (
              rating
            )
          )
        `)
        .eq('user_id', user.user.id)
        .order('last_accessed_at', { ascending: false, nullsFirst: false });

      if (enrollmentError) throw enrollmentError;

      return NextResponse.json(enrollments);
    }

    // Filter published courses for public access
    query = query.eq('is_published', true);

    if (category) {
      query = query.eq('category', category);
    }

    if (level) {
      query = query.eq('level', level);
    }

    query = query.order('created_at', { ascending: false });

    const { data: courses, error } = await query;

    if (error) throw error;

    // Calculate average ratings
    const coursesWithRatings = courses.map(course => {
      const reviews = course.course_reviews || [];
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
        : 0;
      
      return {
        ...course,
        average_rating: Math.round(avgRating * 10) / 10,
        review_count: reviews.length,
        course_reviews: undefined // Remove from response
      };
    });

    return NextResponse.json(coursesWithRatings);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Error fetching courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const {
      title,
      description,
      shortDescription,
      category,
      level,
      durationHours,
      thumbnailUrl,
      isPublished,
      price,
      modules
    } = await request.json();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Create the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title,
        description,
        short_description: shortDescription,
        category,
        level,
        duration_hours: durationHours,
        thumbnail_url: thumbnailUrl,
        is_published: isPublished || false,
        price: price || 0,
        created_by: user.user.id
      })
      .select()
      .single();

    if (courseError) throw courseError;

    // If modules are provided, add them to the course
    if (modules && modules.length > 0) {
      const moduleInserts = modules.map((module: any, index: number) => ({
        course_id: course.id,
        title: module.title,
        description: module.description,
        content_type: module.contentType,
        content_url: module.contentUrl,
        content_text: module.contentText,
        duration_minutes: module.durationMinutes,
        module_order: index + 1,
        is_required: module.isRequired !== false
      }));

      const { error: modulesError } = await supabase
        .from('course_modules')
        .insert(moduleInserts);

      if (modulesError) throw modulesError;
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Error creating course' }, { status: 500 });
  }
}