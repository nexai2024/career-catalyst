import './globals.css';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import  NavBar from '@/components/navbar';
import { Suspense } from 'react';
import UserProvider from '@/contexts/User';
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
  <StackProvider app={stackServerApp}>
     
    <html lang="en" suppressHydrationWarning>
      
      <body className={inter.className}><Suspense fallback={<div>=Loading...</div>}>
    <UserProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          
          <StackTheme>
          <div className="min-h-screen flex flex-col">
           
          <NavBar />
            <main className="flex-1">
              {children}
            </main>
            <Toaster />
          </div>
          </StackTheme>
        
        </ThemeProvider></UserProvider>
    </Suspense>
      </body> 
      
    </html>
   
    </StackProvider>
  );
}