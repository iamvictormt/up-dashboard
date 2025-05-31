import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { UserProvider } from '@/contexts/user-context';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UP Connection',
  description: 'Plataforma de conexão entre profissionais e clientes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <UserProvider>
          <div className="flex min-h-screen bg-[#FFEDC1]">
            <AppSidebar />
            <div className="flex-1 transition-all duration-300 md:ml-72 peer-data-[state=collapsed]:md:ml-24 relative min-w-0">
              <DashboardHeader />
              <main className="pt-16 w-full">{children}</main>
            </div>
          </div>
        </UserProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
