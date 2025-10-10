'use client';

import type React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { UserProvider } from '@/contexts/user-context';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { PaymentProtection } from '@/components/plans/payment-protection';
import { Toaster } from 'sonner';
import { FooterContent } from '@/components/footer.content';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'UP Connection',
  description: '',
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Função para receber o estado de expansão da sidebar
  const handleSidebarExpandedChange = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  // Se for a página de login ou auth, renderizar apenas o conteúdo sem layout
  if (pathname.startsWith('/auth/')) {
    return <>{children}</>;
  }

  // Layout normal para outras páginas
  return (
    <div className="min-h-screen flex flex-col bg-[#FFEDC1] relative overflow-hidden">
      <div className="flex flex-1">
        {/* Sidebar apenas para desktop */}
        <div className="hidden md:block">
          <AppSidebar
            isMobileOpen={false}
            onToggleMobile={() => {}}
            onExpandedChange={handleSidebarExpandedChange}
            isDesktop={true}
          />
        </div>
        <div
          className={`flex-1 transition-all duration-300 ${
            isSidebarExpanded ? 'md:ml-72' : 'md:ml-24'
          } relative min-w-0`}
        >
          <DashboardHeader isSidebarExpanded={isSidebarExpanded} />
          <main className="pt-[10vh] w-full">{children}</main>
        </div>
      </div>
      <div className={`transition-all duration-300 ${isSidebarExpanded ? 'md:ml-72' : 'md:ml-24'} relative min-w-0`}>
        <FooterContent />
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
      </head>
      <body className={inter.className}>
        <UserProvider>
          <PaymentProtection>
            <LayoutContent>{children}</LayoutContent>
          </PaymentProtection>
        </UserProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
