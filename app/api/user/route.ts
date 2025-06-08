import { prisma } from "@/lib/db";
import { stackServerApp } from "@/stack";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const prismaClient = prisma;
  const user = await stackServerApp.getUser();
    if (!user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
  try {
    const newUser = await prismaClient.user.findUnique({
    where: {
      authid: user.id,
    },
})
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching User' }, { status: 500 });
  }
}

