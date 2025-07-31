import { useContext, useEffect, useState } from "react";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import ServerUser from "@/lib/server-user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const prismaClient = prisma;
  const user = await ServerUser();

  if (!user) {
    redirect('/');
  }

  const dbUser = await prismaClient.user.findUnique({
    where: {
      id: user.id || '',
    },
    select: {
      role: true,
    },
  });

  if (dbUser?.role !== 'admin') {
    redirect('/');
  }

  return <>{children}</>;
}
