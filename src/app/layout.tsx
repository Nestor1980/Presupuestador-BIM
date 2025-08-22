
import type {Metadata} from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { BimProvider } from '@/contexts/BimContext';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BIM Budgeteer',
  description: 'Online BIM Model Budgeting Tool for AECO Industry',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <style>
          {`
          .logo {
            position: absolute;
            top: 10px;
            left: 10px;
          }
        `}
        </style>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <BimProvider>
          {children}
          <Toaster />
        </BimProvider>
      </body>
    </html>
  );
}
