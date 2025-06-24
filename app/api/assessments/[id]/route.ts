import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  
  const prismaClient = prisma;
  const user = await auth();
    if (!user || !user.userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

  try {
    const assessment = prismaClient.assessment.findUnique({
      where: {
        id: params.id,
      },
      include: {
        questions: {
          select: {
            id: true,
            points: true,
            questionOrder: true,
            question: {
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
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
    if (!assessment) throw new Error('Assessment not found');

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json({ error: 'Error fetching assessment' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  
  
  try {
    const updates = await request.json();

    const prismaClient = prisma;
  const user = await auth();
    if (!user || !user.userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
  
    if (assessment.created_by !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
   const updatedAssessment = await prismaClient.assessment.update({
      where: {
        id: params.id,
      },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
      },)

    return NextResponse.json(updatedAssessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    return NextResponse.json({ error: 'Error updating assessment' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  
  
  try {
    const prismaClient = prisma;
  const user = await auth();
    if (!user || !user.userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    // Check if user owns this assessment or is admin
    const data = await prismaClient.assessment.delete({
      where: {
        id: params.id,
      },
    });
    if (!data) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return NextResponse.json({ error: 'Error deleting assessment' }, { status: 500 });
  }
}