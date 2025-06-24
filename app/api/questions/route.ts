import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  const prismaClient = prisma;
   const user = await auth();
     if (!user || !user.userId) {
         return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
     }
 
  try {
    const questions = await prismaClient.question.findMany({
      where: {
        createdBy: user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!questions) throw new Error('Error fetching questions');

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Error fetching questions' }, { status: 500 });
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
      questionText,
      questionType,
      options,
      correctAnswer,
      explanation,
      category,
      difficulty,
      points
    } = await request.json();

    const question = await prismaClient.question.create({
      data: {
        questionText,
        questionType,
        options,
        correctAnswer,
        explanation,
        category,
        difficulty,
        points,
        createdBy: user.userId
      },
      select: {
        id: true,
        questionText: true,
        questionType: true,   
        options: true,
        correctAnswer: true,
        explanation: true,
        category: true,
        difficulty: true,
        points: true,
        createdBy: true,
        createdAt: true
      }
    });
    if (!question) throw new Error('Error creating question');

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Error creating question' }, { status: 500 });
  }
}