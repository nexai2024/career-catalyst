import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const subscriptions = await db.subscription.findMany();
  return NextResponse.json(subscriptions);
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (dbUser?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { name, price, features } = await request.json();
  const subscription = await db.subscription.create({
    data: {
      name,
      price,
      features,
    },
  });
  return NextResponse.json(subscription);
}
