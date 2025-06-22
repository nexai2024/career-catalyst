import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('created_by', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Error fetching questions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const {
      questionText,
      questionType,
      options,
      correctAnswer,
      explanation,
      category,
      difficulty,
      points
    } = await request.json();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .insert({
        question_text: questionText,
        question_type: questionType,
        options,
        correct_answer: correctAnswer,
        explanation,
        category,
        difficulty,
        created_by: user.user.id
      })
      .select()
      .single();

    if (questionError) throw questionError;

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Error creating question' }, { status: 500 });
  }
}