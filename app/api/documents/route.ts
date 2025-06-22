import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let query = supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data: documents, error } = await query;

    if (error) throw error;

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Error fetching documents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { type, title, content, metadata } = await request.json();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data: document, error: documentError } = await supabase
      .from('documents')
      .insert({
        user_id: user.user.id,
        type,
        title,
        content,
        metadata: metadata || {},
        status: 'draft'
      })
      .select()
      .single();

    if (documentError) throw documentError;

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Error creating document' }, { status: 500 });
  }
}