// import { prisma } from "@/lib/db";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';


export async function GET(request: Request) {
//  
  const prismaClient = prisma;
  const user = await auth();
    if (!user || !user.userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

  try {
    const assessments = await prismaClient.assessment.findMany({
      select: {
        id: true,
        title: true,
        instructions: true,
        description: true,
        type: true,
        timeLimit: true,
        passingScore: true,
        startDate: true,
        endDate: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Error fetching assessments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const prismaClient = prisma;
    const user = await auth();
      if (!user || !user.userId) {
          return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
      }
  try {
    const { 
      title, 
      description, 
      // instructions,
      timeLimit, 
      type,
      passingScore, 
      attempts,
      randomizeQuestions,
      isPublished,
      startDate,
      endDate,
      questions 
    } = await request.json();

 console.log('Creating assessment with data:', type)

    const assessment = await prismaClient.assessment.create({
      data: {
        title,
        description,
        timeLimit,
        type,
        passingScore,
        attempts: attempts || 1,
        isPublished: isPublished || false,
        startDate: startDate || null,
        endDate: endDate || null,
        userId: user.userId
      },
      include: {
        questions: true
      },
    });
    if (!assessment) {
        throw new Error('Failed to create assessment');

    // If questions are provided, add them to the assessment
    
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json({ error: 'Error creating assessment' }, { status: 500 });
  }
}