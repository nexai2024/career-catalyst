import { UserContext } from "@/contexts/User";
import { prisma } from "@/lib/db";

import { NextResponse } from "next/server";
import { useContext } from "react";
import { auth } from "@clerk/nextjs/server" // Adjust the path based on your project structure

export async function GET(request: Request) {
  const prismaClient = prisma;
  const user = await auth();
    if (!user || !user.userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
  try {
    const newUser = await prismaClient.user.findUnique({
    where: {
      authid: user.userId,
    },
})
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching User' }, { status: 500 });
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
    const newUser = await prismaClient.user.update({
        where: {
          authid: user?.userId   },
      data: {
        ...body,
      },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error updating User:', error);
    return NextResponse.json({ error: 'Error creating User' }, { status: 500 });
  }
}