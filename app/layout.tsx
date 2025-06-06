import './globals.css';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import  NavBar from '@/components/navbar';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Career Catalyst | Accelerate Your Professional Growth',
  description: 'AI-powered career development platform to help you achieve your professional goals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <StackProvider app={stackServerApp}>
          <StackTheme>
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<div>=Loading...</div>}>
          <NavBar />
            </Suspense>
            <main className="flex-1">
              {children}
            </main>
            <Toaster />
          </div>
          </StackTheme>
          </StackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}