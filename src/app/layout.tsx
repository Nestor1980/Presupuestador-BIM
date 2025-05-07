
import type {Metadata} from 'next';
import type { ReactNode } from 'react'; // Import ReactNode type
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected import for Geist font
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
  children: ReactNode; // Changed from React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <BimProvider>
          {children}
          <Toaster />
        </BimProvider>
      </body>
    </html>
  );
}

