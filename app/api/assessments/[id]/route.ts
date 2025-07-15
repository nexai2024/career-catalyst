import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { use } from 'react';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Missing assessment ID' }, { status: 400 });
  }
  const prismaClient = prisma;
  const user = await auth();
  if (!user || !user.userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const assessment = await prismaClient.assessment.findUnique({
      where: {
        id: id,
      },
      include: {
        questions: {
          select: {
            id: true,
            question: {
              select: {
                id: true,
                question_text: true,
                question_type: true,
                options: true,
                correct_answer: true,
                explanation: true,
                category: true,
                difficulty: true,
                points: true,
                created_by: true,
                created_at: true,
                updated_at: true,
              },
            },
          },
        },
      },
    });
    if (!assessment) throw new Error('Assessment not found');
   console.log('Assessment fetched:', assessment);
   console.log("Assessment Questions:", assessment.questions);
    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json({ error: 'Error fetching assessment' }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;


  try {
    const updates = await request.json();

    const prismaClient = prisma;
  const user = await auth();
    if (!user || !user.userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
  
    // if (assessment.userId !== user.userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }
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

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;


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