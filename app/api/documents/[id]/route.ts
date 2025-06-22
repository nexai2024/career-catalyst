import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.user.id)
      .single();

    if (error) throw error;

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Error fetching document' }, { status: 500 });
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

    const { data: document, error } = await supabase
      .from('documents')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Error updating document' }, { status: 500 });
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

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.user.id);

    if (error) throw error;

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Error deleting document' }, { status: 500 });
  }
}