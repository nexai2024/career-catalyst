import { UserContext } from "@/contexts/User";
import { prisma } from "@/lib/db";
import { stackServerApp } from "@/stack";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { useContext } from "react";

export async function GET(request: Request) {
  const prismaClient = prisma;
  const user = await auth();
    if (!user || !user.userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
  try {
    const newExp = await prismaClient.experience.findMany({
    where: {
      userId: user.userId,
    },
})
    return NextResponse.json(newExp);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching User' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const prismaClient = prisma;
  const authData = await auth();
  if (!authData || !authData.userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const newExp = await prismaClient.experience.create({
      data: {
        //id: user?.id,
        userId: authData.userId,
        company: body.company,
        role: body.role,
        startDate: (new Date(body.startDate)).toISOString(),
        endDate: (new Date(body.endDate)).toISOString(),
        description: body.description,
        achievements: body.achievements,
      },
    });
    return NextResponse.json(newExp);
  } catch (error) {
    console.error('Error updating User:', error);
    return NextResponse.json({ error: 'Error creating User' }, { status: 500 });
  }
}