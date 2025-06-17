import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/db";
import { stackServerApp } from "@/stack";
export async function GET(request: Request) {
  const prismaClient = prisma;
  const user = await stackServerApp.getUser();
    if (!user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
  try {
    const skills = await prismaClient.skill.findMany({
    where: {
      userId: user.id,
    },
})
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching User skills' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const prismaClient = prisma;
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const newSkill = await prismaClient.skill.create({
      data: {
        //id: user?.id,
        userId: user?.id,
        name: body.name,
        category: body.category,
        level: body.level,
      },
    });
    return NextResponse.json(newSkill);
  } catch (error) {
    console.error('Error updating User:', error);
    return NextResponse.json({ error: 'Error creating User Skill' }, { status: 500 });
  }
}