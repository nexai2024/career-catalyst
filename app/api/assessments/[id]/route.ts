import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select(`
        *,
        assessment_questions (
          id,
          points,
          question_order,
          questions (*)
        )
      `)
      .eq('id', params.id)
      .single();

    if (assessmentError) throw assessmentError;

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json({ error: 'Error fetching assessment' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const updates = await request.json();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Check if user owns this assessment or is admin
    const { data: assessment, error: checkError } = await supabase
      .from('assessments')
      .select('created_by')
      .eq('id', params.id)
      .single();

    if (checkError) throw checkError;
    
    if (assessment.created_by !== user.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data: updatedAssessment, error: updateError } = await supabase
      .from('assessments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updatedAssessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    return NextResponse.json({ error: 'Error updating assessment' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Check if user owns this assessment or is admin
    const { data: assessment, error: checkError } = await supabase
      .from('assessments')
      .select('created_by')
      .eq('id', params.id)
      .single();

    if (checkError) throw checkError;
    
    if (assessment.created_by !== user.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return NextResponse.json({ error: 'Error deleting assessment' }, { status: 500 });
  }
}