import './globals.css';

import {ClerkProvider} from '@clerk/nextjs';
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
  <ClerkProvider>
     
    <html lang="en" suppressHydrationWarning>
      
      <body className={inter.className}><Suspense fallback={<div>=Loading...</div>}>
    <UserProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          
          <div className="min-h-screen flex flex-col">
           
          <NavBar />
            <main className="flex-1">
              {children}
            </main>
            <Toaster />
          </div>
        
        </ThemeProvider></UserProvider>
    </Suspense>
      </body> 
      
    </html>
   
    </ClerkProvider>
  );
}