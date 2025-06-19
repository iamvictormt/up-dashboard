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

const inter = Inter({ subsets: ['latin'] });

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
    <div className="flex min-h-screen bg-[#FFEDC1]">
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
        className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'md:ml-72' : 'md:ml-24'} relative min-w-0`}
      >
        <DashboardHeader isSidebarExpanded={isSidebarExpanded} />
        <main className="pt-[10vh] w-full">{children}</main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
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
