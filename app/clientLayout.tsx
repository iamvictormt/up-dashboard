'use client';

import type React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { UserProvider } from '@/contexts/user-context';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { useMobile } from '@/hooks/use-mobile';
import { PaymentProtection } from '@/components/plans/payment-protection';

const inter = Inter({ subsets: ['latin'] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleSidebarExpandedChange = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <AppSidebar
          isMobileOpen={false}
          onToggleMobile={() => {}}
          onExpandedChange={handleSidebarExpandedChange}
          isDesktop={true}
        />
      </div>
      <div
        className={`flex-1 transition-all duration-300 p-10 ${isSidebarExpanded ? 'md:ml-72' : 'md:ml-24'} relative min-w-0`}
      >
        <DashboardHeader isSidebarExpanded={isSidebarExpanded} />
        <main className="pt-[10vh] w-full">{children}</main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile();

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
