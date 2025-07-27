import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const dbUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (dbUser?.role !== 'admin') {
    redirect('/');
  }

  return <>{children}</>;
}
