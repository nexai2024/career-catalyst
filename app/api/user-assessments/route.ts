import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  
  
  try {
    const prismaClient = prisma;
  const user = await auth();
    if (!user || !user.userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    const data = await prismaClient.userAssessment.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        assessment: {
          select: {
            id: true,
            title: true,
            description: true,
            timeLimit: true,
            passingScore: true,
            isPublished: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    }); 

    if (!data) throw new Error('No assessments found for the user');

    // Transform the data to match the expected format
    const transformedData = data.map(ua => ({
      ...ua,
      assessment: ua.assessment
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching user assessments:', error);
    return NextResponse.json({ error: 'Error fetching user assessments' }, { status: 500 });
  }
}
export async function POST(request: Request) {
  const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { assessmentId, score, status, responses, attempts = 0 } = body;

    if (!assessmentId || score === undefined || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAssessment = await prisma.userAssessment.create({
      data: {
        userId: user.userId,
        assessmentId,
        score,
        attempts,
        startedAt: new Date(),
        UserResponses: {
          create: responses.map((response: any) => ({
            response: response.answer,
            is_correct: response.isCorrect,
            points_earned: response.pointsEarned,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            Questions: {
              connect: { id: response.questionId },
            },
            User: {
              connect: { id: user.userId },
            },
          })),
        },   
      },
    });

    return NextResponse.json(newAssessment);
  } catch (error) {
    console.error('Error creating user assessment:', error);
    return NextResponse.json({ error: 'Error creating user assessment' }, { status: 500 });
  }
}