import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/db";
import { auth } from '@clerk/nextjs/server';
export async function GET(request: Request) {
  const prismaClient = prisma;
  const user = await auth();
    if (!user || !user.userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
  try {
    const awards = await prismaClient.award.findMany({
    where: {
      userId: user.userId,
    },
})
    return NextResponse.json(awards);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching User awards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const prismaClient = prisma;
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const newAward = await prismaClient.award.create({
      data: {
        //id: user?.id,
        userId: user?.userId,
        title: body.title,
        description: body.description,
        date: body.date,
      },
    });
    return NextResponse.json(newAward);
  } catch (error) {
    console.error('Error updating User:', error);
    return NextResponse.json({ error: 'Error creating User Award' }, { status: 500 });
  }
}