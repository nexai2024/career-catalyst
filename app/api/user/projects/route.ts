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
    const projects = await prismaClient.project.findMany({
    where: {
      userId: user.userId,
    },
})
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching User projects' }, { status: 500 });
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
    const newProject = await prismaClient.project.create({
      data: {
        //id: user?.id,
        userId: user?.userId,
        title: body.name,
        description: body.category,
        startDate: body.level,
        endDate: body.endDate,
        technologies: body.technologies,
        repositoryUrl: body.repositoryUrl,
        liveUrl: body.liveUrl,
      },
    });
    return NextResponse.json(newProject);
  } catch (error) {
    console.error('Error updating User:', error);
    return NextResponse.json({ error: 'Error creating User Project' }, { status: 500 });
  }
}